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
package com.andia.mixin.bekasi.webface.converters;

import static com.andia.mixin.Lean.LEAN_NAME;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.lang.reflect.Array;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonNumber;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonReader;
import javax.json.JsonString;
import javax.json.JsonValue;
import javax.json.JsonValue.ValueType;
import javax.json.JsonWriter;
import javax.ws.rs.ext.ParamConverter;

import com.andia.mixin.Lean;
import com.andia.mixin.model.EObject;
import com.andia.mixin.model.EObjectJson;
import com.andia.mixin.model.EObjectSerde;
import com.andia.mixin.model.EPackage;
import com.andia.mixin.util.MethodUtils;

public class LeanJsonParamConverter implements ParamConverter<Lean> {

	private EPackage ePackage;
	private EObjectJsonParamConverter eObjectConverter;
	private Map<String, Class<?>> classes = new HashMap<>();

	public LeanJsonParamConverter(EPackage ePackage, EObjectJsonParamConverter eObjectConverter, Class<?>... classes) {
		this.ePackage = ePackage;
		this.eObjectConverter = eObjectConverter;
		for (Class<?> aClass : classes) {
			addClass(aClass);
		}
	}

	public void addClass(Class<?> leanClass) {
		String name = leanClass.getSimpleName();
		this.classes.put(name, leanClass);
	}

	@Override
	public Lean fromString(String src) {
		try {
			StringReader stringReader = new StringReader(src);
			JsonReader jsonReader = Json.createReader(stringReader);
			JsonObject jsonObject = jsonReader.readObject();
			return readLean(jsonObject);
		} catch (IOException e) {
			throw new JsonParamConverterException("Fail read object from json", e);
		}
	}

	@Override
	public String toString(Lean value) {
		StringWriter writer = new StringWriter();
		try {
			JsonObjectBuilder builder = Json.createObjectBuilder();
			JsonWriter jsonWriter = Json.createWriter(writer);
			writeLean(value, builder);
			JsonObject object = builder.build();
			jsonWriter.write(object);
			return writer.toString();
		} catch (Exception e) {
			throw new JsonParamConverterException("Fail write object from json", e);
		}
	}

	private Lean readLean(JsonObject object) throws IOException {

		// Baca lean name dan buat object yang sesuai
		if (!object.containsKey(LEAN_NAME)) {
			throw new IOException("Missing json property [" + LEAN_NAME + "]");
		}

		String leanName = object.getString(LEAN_NAME);
		Lean lean = null;
		Class<?> leanClass = null;
		if (classes.containsKey(leanName)) {
			leanClass = classes.get(leanName);
			try {
				lean = (Lean) leanClass.newInstance();
			} catch (InstantiationException | IllegalAccessException e) {
				throw new IOException("Fail create lean object from [" + leanClass + "]", e);
			}
		} else {
			throw new IOException("Unknown lean class [" + leanName + "]");
		}

		// Looping selama ada field
		Set<String> fieldNames = object.keySet();
		for (String fieldName : fieldNames) {

			// Lean name tidak perlu di set lagi
			if (fieldName.equals(LEAN_NAME)) {
				continue;
			}

			// Mulai cari field di lean class
			Method method = null;
			Class<?> currentClass = leanClass;
			while (currentClass != Lean.class) {

				// Cari di semua method
				for (Method currentMethod : currentClass.getDeclaredMethods()) {
					if (currentMethod.getParameterCount() == 1) {
						String methodName = currentMethod.getName();
						if (MethodUtils.isExistsSetField(methodName, fieldName)) {
							method = currentMethod;
							break;
						}
					}
				}

				// Jika tidak ditemukan maka recursive ke super class
				if (method == null) {
					currentClass = currentClass.getSuperclass();
				} else {
					break;
				}
			}

			if (method == null) {
				throw new IOException("Cannot find setter method for field [" + fieldName + "] of " + leanClass);
			}

			try {

				JsonValue jsonValue = object.get(fieldName);
				Class<?>[] parameterTypes = method.getParameterTypes();
				Object value = readValue(jsonValue, parameterTypes[0]);
				if (value != null) {
					method.invoke(lean, value);
				}

			} catch (Exception e) {
				throw new IOException("Fail set field [" + fieldName + "]", e);
			}

		}

		return lean;
	}

	private Object readValue(JsonValue jsonValue, Class<?> type) throws Exception {

		// Jika method ditemukan ambil argument-nya
		if (isSimpleValueType(jsonValue)) {

			Object simple = getSimpleObject(jsonValue);
			if (type.isEnum()) {

				Object[] constants = type.getEnumConstants();
				for (Object constant : constants) {
					if (constant.toString().equals(simple)) {
						return constant;
					}
				}

				return null;

			} else {
				return simple;
			}

		} else if (type.isArray() || (jsonValue instanceof JsonArray && type == Object.class)) {

			JsonArray jsonArray = (JsonArray) jsonValue;
			int size = jsonArray.size();
			Class<?> componentType = type.getComponentType();
			componentType = componentType == null ? Object.class : componentType;
			Object array = Array.newInstance(componentType, size);
			for (int i = 0; i < size; i++) {
				JsonValue elementValue = jsonArray.get(i);
				Object element = readValue(elementValue, componentType);
				Array.set(array, i, element);
			}
			return array;

		} else if (Lean.class.isAssignableFrom(type)) {

			JsonObject jsonObject = (JsonObject) jsonValue;
			Lean subLean = readLean((JsonObject) jsonObject);
			return subLean;

		} else {

			JsonObject jsonObject = (JsonObject) jsonValue;
			if (jsonObject.containsKey(EObjectSerde.E_CLASS)) {

				EObjectSerde<EObject> serde = eObjectConverter.getSerde();
				EObject model = serde.toModel(jsonObject);
				return model;

			} else {

				Map<String, Object> map = new LinkedHashMap<>();
				Set<Entry<String, JsonValue>> entrySet = jsonObject.entrySet();
				for (Entry<String, JsonValue> entry : entrySet) {
					String key = entry.getKey();
					JsonValue value = entry.getValue();
					Object element = readValue(value, Object.class);
					map.put(key, element);
				}
				return map;

			}

		}
	}

	private boolean isSimpleObjectType(Object object, Class<?> type) {
		if (object == null) {
			return true;
		} else {
			Class<? extends Object> oType = object.getClass();
			return isSimpleType(oType);
		}
	}

	private boolean isSimpleType(Class<?> oType) {
		return String.class.isAssignableFrom(oType)
				|| Number.class.isAssignableFrom(oType)
				|| Boolean.class.isAssignableFrom(oType)
				|| oType.isPrimitive();
	}

	private boolean isSimpleValueType(JsonValue value) {
		ValueType valueType = value.getValueType();
		return valueType == ValueType.NULL
				|| valueType == ValueType.STRING
				|| valueType == ValueType.NUMBER
				|| valueType == ValueType.TRUE
				|| valueType == ValueType.FALSE;
	}

	private Object getSimpleObject(JsonValue value) {
		ValueType type = value.getValueType();
		if (type == ValueType.NULL) {
			return null;
		} else if (type == ValueType.TRUE) {
			return true;
		} else if (type == ValueType.FALSE) {
			return false;
		} else if (type == ValueType.NUMBER) {
			JsonNumber number = (JsonNumber) value;
			return number.numberValue();
		} else if (type == ValueType.STRING) {
			JsonString string = (JsonString) value;
			return string.getString();
		} else {
			return value.toString();
		}
	}

	private JsonValue getSimpleValue(Object object) {
		if (object == null) {
			return JsonValue.NULL;
		} else if (object.equals(true)) {
			return JsonValue.TRUE;
		} else if (object.equals(false)) {
			return JsonValue.FALSE;
		} else if (object instanceof Integer) {
			return Json.createValue((Integer) object);
		} else if (object instanceof Long) {
			return Json.createValue((Long) object);
		} else if (object instanceof Double) {
			return Json.createValue((Double) object);
		} else if (object instanceof Float) {
			return Json.createValue((Float) object);
		} else if (object instanceof String) {
			return Json.createValue((String) object);
		} else {
			return Json.createValue(String.valueOf(object));
		}
	}

	private void writeLean(Lean lean, JsonObjectBuilder builder) throws IOException {

		Class<? extends Lean> leanClass = lean.getClass();
		Class<?> currentClass = leanClass;
		while (currentClass != Object.class) {

			// Baca semua field di current class
			for (Method method : currentClass.getDeclaredMethods()) {

				String methodName = method.getName();

				try {

					// Get or Is harus tidak ada argument
					if (method.getParameterCount() != 0) {
						continue;
					}

					// Pastikan method berawalan get atau is
					String fieldName = MethodUtils.checkGetOrIsField(methodName);
					if (fieldName == null) {
						continue;
					}

					Class<?> type = method.getReturnType();
					Object value = method.invoke(lean);
					Object readValue = readValue(value, type);
					if (readValue instanceof JsonValue) {
						builder.add(fieldName, (JsonValue) readValue);
					} else if (readValue instanceof JsonArrayBuilder) {
						builder.add(fieldName, (JsonArrayBuilder) readValue);
					} else if (readValue instanceof JsonObjectBuilder) {
						builder.add(fieldName, (JsonObjectBuilder) readValue);
					} else {
						throw new IOException("Unknown read value " + readValue);
					}

				} catch (Exception e) {
					throw new IOException("Fail read field [" + methodName + "]", e);
				}

			}

			// Hanya sampai Lean saja
			if (currentClass == Lean.class) {
				break;
			}

			// Recursive ke super class
			currentClass = currentClass.getSuperclass();
		}
	}

	private Object readValue(Object value, Class<?> type) throws IOException {

		if (isSimpleObjectType(value, type)) {

			JsonValue jsonValue = getSimpleValue(value);
			return jsonValue;

		} else if (type.isArray() || (value.getClass().isArray() && type == Object.class)) {

			JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
			Class<?> elementType = type.getComponentType();
			int length = Array.getLength(value);

			for (int i = 0; i < length; i++) {

				Object object = Array.get(value, i);
				Object jsonValue = readValue(object, elementType);
				if (jsonValue instanceof JsonValue) {
					arrayBuilder.add((JsonValue) jsonValue);
				} else if (jsonValue instanceof JsonArrayBuilder) {
					arrayBuilder.add((JsonArrayBuilder) jsonValue);
				} else if (jsonValue instanceof JsonObjectBuilder) {
					arrayBuilder.add((JsonObjectBuilder) jsonValue);
				}
			}

			return arrayBuilder;

		} else if (value instanceof Lean) {

			Lean subLean = (Lean) value;
			JsonObjectBuilder subBuilder = Json.createObjectBuilder();
			writeLean(subLean, subBuilder);
			return subBuilder;

		} else if (value instanceof EObject) {

			EObject eObject = (EObject) value;
			EObjectJson json = new EObjectJson(ePackage);
			JsonObject object = json.fromModel(eObject);
			return object;

		} else {
			throw new IOException("Unknown value " + value);
		}
	}

}
