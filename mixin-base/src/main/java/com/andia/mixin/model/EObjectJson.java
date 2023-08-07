/*
 * Copyright (c) 2020-2023 Datamixin.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
package com.andia.mixin.model;

import static com.andia.mixin.model.EObjectSerde.E_CLASS;
import static com.andia.mixin.model.EObjectSerde.NAMESPACE;
import static com.andia.mixin.model.EObjectSerde.NAMESPACE_PREFIX;
import static com.andia.mixin.model.EObjectSerde.NAMESPACE_URI;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Set;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonNumber;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonString;
import javax.json.JsonValue;
import javax.json.JsonValue.ValueType;

public class EObjectJson {

	private EPackage ePackage;

	public EObjectJson(EPackage ePackage) {
		this.ePackage = ePackage;
	}

	public EObject fromObject(JsonObject jsonObject) throws Exception {

		Class<? extends EObject> eObjectType = getEObjectType(jsonObject);
		if (eObjectType != null) {

			EObject eObject = eObjectType.newInstance();
			buildEObject(eObject, jsonObject);
			return eObject;

		} else {
			throw new RuntimeException("Fail discover eClass type");
		}
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	private void buildEObject(EObject eObject, JsonObject jsonObject) {

		EFeature[] features = eObject.eFeatures();

		for (int i = 0; i < features.length; i++) {

			EFeature feature = features[i];

			Object featureValue = eObject.eGet(feature);
			String featureId = feature.getName();
			JsonValue jsonValue = jsonObject.get(featureId);

			// Jika jsonValue null, skip discover
			if (jsonValue == null) {
				continue;
			}

			if (featureValue instanceof EList) {

				EList eList = (EList) featureValue;

				if (jsonValue.getValueType() == ValueType.ARRAY) {

					JsonArray list = jsonValue.asJsonArray();
					for (int j = 0; j < list.size(); j++) {

						JsonValue value = list.get(j);
						if (isSimple(value)) {

							Object elementValue = getSimpleValue(value);
							eList.add(elementValue);

						} else {

							JsonObject elementObject = value.asJsonObject();
							EObject nestedObject = createNestedEObject(
									elementObject, eObject, (EReference) feature);
							eList.add(nestedObject);
						}
					}

				} else {
					String msg = "Property " + featureId + " expected array, actually " + jsonValue;
					throw new RuntimeException(msg);
				}

			} else if (featureValue instanceof EMap) {

				EMap eMap = (EMap) featureValue;

				if (jsonValue.getValueType() == ValueType.OBJECT) {

					JsonObject mapObject = jsonValue.asJsonObject();
					Set<String> keys = mapObject.keySet();
					for (String key : keys) {

						JsonValue value = mapObject.get(key);
						if (isSimple(value)) {

							Object simpleValue = getSimpleValue(value);
							eMap.put(key, simpleValue);

						} else {

							JsonObject valueObject = value.asJsonObject();
							EObject nestedObject = createNestedEObject(
									valueObject, eObject, (EReference) feature);

							eMap.put(key, nestedObject);
						}
					}

				} else {
					throw new Error("Property " + featureId + " expected object, actually " + jsonValue);
				}

			} else if (jsonValue.getValueType() == ValueType.OBJECT) {

				JsonObject object = jsonValue.asJsonObject();
				EObject nestedObject = createNestedEObject(object, eObject, (EReference) feature);
				eObject.eSet(feature, nestedObject);

			} else if (isSimple(jsonValue)) {

				Object value = getSimpleValue(jsonValue);
				eObject.eSet(feature, value);

			} else {

				// JsonValue tidak null, namun featureId belum diketahui
				throw new RuntimeException("Unknown property " + featureId + "=" + jsonValue);
			}

		}

	}

	private EObject createNestedEObject(JsonObject json, EObject container, EReference reference) {

		EObject eObject = null;
		try {

			JsonValue eClass = json.get(E_CLASS);
			if (eClass != null) {
				eObject = fromObject(json);
			} else {
				Class<? extends EObject> eObjectType = reference.getType();
				eObject = eObjectType.newInstance();
				buildEObject(eObject, json);
			}

		} catch (Exception e) {
			throw new RuntimeException("fail create nested object", e);
		}

		return eObject;
	}

	private Object getSimpleValue(JsonValue jsonValue) {

		ValueType valueType = jsonValue.getValueType();

		if (valueType == ValueType.NULL) {

			return null;

		} else if (valueType == ValueType.TRUE) {

			return true;

		} else if (valueType == ValueType.FALSE) {

			return false;

		} else if (jsonValue instanceof JsonString) {

			JsonString string = (JsonString) jsonValue;
			return string.getString();

		} else if (jsonValue instanceof JsonNumber) {

			JsonNumber number = (JsonNumber) jsonValue;
			Number numberValue = number.numberValue();

			if (numberValue instanceof BigDecimal) {
				return numberValue.floatValue();
			}

			return numberValue;

		} else {

			throw new EObjectJsonException("Unknown simple json value type " + valueType);
		}

	}

	private boolean isSimple(JsonValue value) {
		ValueType valueType = value.getValueType();
		return valueType == ValueType.NULL ||
				valueType == ValueType.TRUE ||
				valueType == ValueType.FALSE ||
				valueType == ValueType.NUMBER ||
				valueType == ValueType.STRING;
	}

	private Class<? extends EObject> getEObjectType(JsonObject jsonObject) {

		String eClassString = jsonObject.getString(E_CLASS);
		Namespace[] namespaces = ePackage.getNamespaces();

		for (int i = 0; i < namespaces.length; i++) {

			Namespace modelNamespace = namespaces[i];
			String modelName = modelNamespace.getName();
			int prefixLength = modelName.length();
			String simpleClassName = eClassString.substring(prefixLength + 1);
			String eClassName = modelName + "://" + simpleClassName;
			Class<? extends EObject> eClass = ePackage.getEClass(eClassName);
			if (eClass != null) {
				return eClass;
			}

		}

		throw new EObjectJsonException("Missing " + eClassString + " from namespaces " + Arrays.toString(namespaces));
	}

	public JsonObject fromModel(EObject model) {
		JsonObjectBuilder builder = Json.createObjectBuilder();
		writeNamespaces(builder);
		builder.addAll(toObject(model));
		JsonObject object = builder.build();
		return object;
	}

	private void writeNamespaces(JsonObjectBuilder builder) {

		JsonArrayBuilder nsBuilder = Json.createArrayBuilder();
		Namespace[] namespaces = ePackage.getNamespaces();

		for (Namespace namespace : namespaces) {
			JsonObjectBuilder nsObject = Json.createObjectBuilder();
			nsObject.add(NAMESPACE_PREFIX, namespace.getName());
			nsObject.add(NAMESPACE_URI, namespace.getURI());
			nsBuilder.add(nsObject);
		}

		JsonArray ns = nsBuilder.build();
		builder.add(NAMESPACE, ns);
	}

	@SuppressWarnings("unchecked")
	private JsonObjectBuilder toObject(EObject eObject) {

		JsonObjectBuilder objectBuilder = Json.createObjectBuilder();

		boolean writeEClass = EObjectSerde.isWriteEClass(eObject);
		if (writeEClass == true) {
			EClass eClass = eObject.eClass();
			String classAlias = EObjectSerde.getClassAlias(eClass);
			objectBuilder.add(E_CLASS, classAlias);
		}

		EFeature[] features = eObject.eFeatures();
		for (int i = 0; i < features.length; i++) {

			// Property name
			EFeature feature = features[i];
			String featureId = feature.getName();

			// Property value
			Object value = eObject.eGet(feature);

			if (value instanceof EList) {

				// Value adalah EList
				EList<Object> eList = (EList<Object>) value;

				JsonArrayBuilder listBuilder = Json.createArrayBuilder();

				for (int j = 0; j < eList.size(); j++) {

					Object element = eList.get(j);
					if (EObjectSerde.isSimple(element)) {

						JsonValue simpleValue = getSimpleValue(element);
						listBuilder.add(simpleValue);

					} else if (element instanceof EObject) {

						JsonObjectBuilder object = toObject((EObject) element);
						listBuilder.add(object);

					}
				}

				objectBuilder.add(featureId, listBuilder);

			} else if (value instanceof EMap) {

				// Value adalah EMap
				EMap<Object> eMap = (EMap<Object>) value;
				Set<String> names = eMap.keySet();

				if (names.size() > 0) {

					// Bangun map object
					JsonObjectBuilder mapBuilder = Json.createObjectBuilder();

					for (String name : names) {
						Object mapValue = eMap.get(name);
						JsonObjectBuilder jsonObject = toObject((EObject) mapValue);
						mapBuilder.add(name, jsonObject);
					}

					objectBuilder.add(featureId, mapBuilder);
				}

			} else if (EObjectSerde.isSimple(value)) {

				JsonValue simpleValue = getSimpleValue(value);
				objectBuilder.add(featureId, simpleValue);

			} else if (value instanceof EObject) {

				EObject childObject = (EObject) value;
				JsonObjectBuilder object = toObject(childObject);
				objectBuilder.add(featureId, object);
			}
		}

		return objectBuilder;
	}

	private JsonValue getSimpleValue(Object value) {

		if (value instanceof String) {

			return Json.createValue((String) value);

		} else if (value instanceof Boolean) {

			return (Boolean) value ? JsonValue.TRUE : JsonValue.FALSE;

		} else if (value instanceof Number) {

			if (value instanceof Integer) {
				return Json.createValue((int) value);
			} else if (value instanceof Float) {
				return Json.createValue((float) value);
			} else {
				return Json.createValue((double) value);
			}

		} else if (value == null) {

			return JsonValue.NULL;

		} else {

			throw new EObjectJsonException("Unknown simple value " + value);
		}

	}

}
