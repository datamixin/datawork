/*
 * Copyright (c) 2020-2023 Datamixin.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>. */
package com.andia.mixin.model;

import java.io.StringReader;
import java.io.StringWriter;
import java.lang.reflect.Modifier;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.json.JsonValue;
import javax.json.stream.JsonGenerator;
import javax.json.stream.JsonGeneratorFactory;

/**
 * Fungsi transformasi dari model ke json dan sebaliknya di lakukan oleh object
 * ini. Transformer harus dibuat dengan dasar daftar packages yang sesuai dengan
 * isi model.
 * 
 * @author "Zahid Al Haris"
 * 
 */
public class EObjectSerde<M extends EObject> {

	public static final String NAMESPACE = "ns";
	public static final String NAMESPACE_URI = "uri";
	public static final String NAMESPACE_PREFIX = "prefix";

	public static final String E_CLASS = "eClass";

	/**
	 * Package yang digunakan.
	 */
	private EPackage ePackage;

	/**
	 * Buat serde baru.
	 */
	public EObjectSerde(EPackage ePackage) {
		this.ePackage = ePackage;
	}

	public EPackage getEPackage() {
		return ePackage;
	}

	public M deserialize(String jsonModel) throws EObjectSerdeException {

		try {

			StringReader stringReader = new StringReader(jsonModel);
			JsonReader jsonReader = Json.createReader(stringReader);
			JsonObject jsonObject = jsonReader.readObject();

			return toModel(jsonObject);

		} catch (Exception e) {
			throw new EObjectSerdeException("Fail deserialize json", e);
		}
	}

	@SuppressWarnings("unchecked")
	public M toModel(JsonObject jsonObject) throws EObjectSerdeException {
		EObjectJson ebuilder = new EObjectJson(this.ePackage);
		try {
			EObject eObject = ebuilder.fromObject(jsonObject);
			return (M) eObject;
		} catch (Exception e) {
			throw new EObjectSerdeException("Fail read from json object", e);
		}
	}

	public String serialize(M model) throws EObjectSerdeException {

		try {

			Map<String, Object> properties = new HashMap<>(1);
			properties.put(JsonGenerator.PRETTY_PRINTING, true);
			JsonGeneratorFactory factory = Json.createGeneratorFactory(properties);

			StringWriter writer = new StringWriter();
			JsonGenerator generator = factory.createGenerator(writer);

			writeModel(generator, model);

			return writer.toString();

		} catch (Exception e) {
			throw new EObjectSerdeException("Fail serialize model", e);
		}
	}

	@SuppressWarnings("unchecked")
	private void writeModel(JsonGenerator generator, EObject eObject) {

		generator.writeStartObject();

		// Write namespace
		EObject eContainer = eObject.eContainer();
		if (eContainer == null) {
			Namespace[] namespaces = ePackage.getNamespaces();
			generator.writeStartArray(NAMESPACE);
			for (Namespace namespace : namespaces) {
				generator.writeStartObject();
				generator.write(NAMESPACE_PREFIX, namespace.getName());
				generator.write(NAMESPACE_URI, namespace.getURI());
				generator.writeEnd();
			}
			generator.writeEnd();
		}

		// Write eClass
		boolean writeEClass = isWriteEClass(eObject);
		if (writeEClass == true) {
			EClass eClass = eObject.eClass();
			String classAlias = getClassAlias(eClass);
			generator.write(E_CLASS, classAlias);
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

				generator.writeStartArray(featureId);

				for (int j = 0; j < eList.size(); j++) {

					Object element = eList.get(j);
					if (element != null) {
						if (isSimple(element)) {
							writeSimple(generator, element);
						} else {
							writeModel(generator, (EObject) element);
						}
					}
				}

				generator.writeEnd();

			} else if (value instanceof EMap) {

				// Value adalah EList
				EMap<Object> eMap = (EMap<Object>) value;

				generator.writeStartObject(featureId);

				Set<String> keySet = eMap.keySet();
				for (String key : keySet) {

					Object entry = eMap.get(key);
					generator.writeKey(key);
					if (isSimple(entry)) {
						writeSimple(generator, entry);
					} else {
						writeModel(generator, (EObject) entry);
					}

				}

				generator.writeEnd();

			} else if (isSimple(value)) {

				generator.writeKey(featureId);
				writeSimple(generator, value);

			} else if (value instanceof EObject) {

				generator.writeKey(featureId);
				EObject childObject = (EObject) value;
				writeModel(generator, childObject);
			}
		}

		generator.writeEnd();
		generator.flush();

	}

	private void writeSimple(JsonGenerator generator, Object value) {

		if (value instanceof String) {

			String string = (String) value;
			generator.write(string);

		} else if (value instanceof Boolean) {

			Boolean bool = (Boolean) value;
			generator.write(bool ? JsonValue.TRUE : JsonValue.FALSE);

		} else if (value instanceof Number) {

			if (value instanceof Integer) {
				generator.write((int) value);
			} else if (value instanceof Float) {
				generator.write((float) value);
			} else {
				generator.write((double) value);
			}

		} else if (value == null) {

			generator.writeNull();

		}
	}

	protected static String getClassAlias(EClass eClass) {
		String name = eClass.getName();
		EPackage ePackage = eClass.getEPackage();
		Namespace[] namespaces = ePackage.getNamespaces();
		Namespace namespace = namespaces[0];
		String prefix = namespace.getName();
		return prefix + ":" + name.substring(prefix.length() + 3);
	}

	protected static boolean isWriteEClass(EObject eObject) {

		boolean needEClass = false;
		EFeature containingFeature = eObject.eContainingFeature();
		if (containingFeature == null) {

			needEClass = true;

		} else if (containingFeature instanceof EReference) {

			EReference reference = (EReference) containingFeature;
			Class<? extends EObject> type = reference.getType();
			int modifiers = type.getModifiers();

			if (Modifier.isAbstract(modifiers)) {
				needEClass = true;
			}
		}
		return needEClass;
	}

	protected static boolean isSimple(Object element) {
		if (element instanceof Boolean || element instanceof String || element instanceof Number) {
			return true;
		}
		return element == null;
	}

}
