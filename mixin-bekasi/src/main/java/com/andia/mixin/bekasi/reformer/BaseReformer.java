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
package com.andia.mixin.bekasi.reformer;

import java.util.Set;
import java.util.function.BiConsumer;
import java.util.function.Function;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonNumber;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonString;
import javax.json.JsonValue;
import javax.json.JsonValue.ValueType;

public abstract class BaseReformer implements Reformer {

	private String packageName;

	public BaseReformer(String packageName) {
		this.packageName = packageName;
	}

	protected boolean hasEClass(JsonObject object, String eType) {
		if (object.containsKey(ECLASS)) {
			String eClassType = getEClassType(eType);
			String eClass = object.getString(ECLASS);
			return eClassType.equals(eClass);
		} else {
			return false;
		}
	}

	protected boolean hasObject(JsonObject object, String field) {
		if (object.containsKey(field)) {
			JsonValue value = object.get(field);
			return value instanceof JsonObject;
		} else {
			return false;
		}
	}

	protected boolean hasString(JsonObject object, String field) {
		if (object.containsKey(field)) {
			JsonValue value = object.get(field);
			return value instanceof JsonString;
		} else {
			return false;
		}
	}

	protected String getEClassType(String name) {
		return packageName + COLON + name;
	}

	protected void modifyObject(
			JsonObject object, JsonObjectBuilder builder,
			Function<JsonObject, Boolean> evaluator,
			BiConsumer<JsonObject, JsonObjectBuilder> modifier) {
		if (evaluator.apply(object)) {
			modifier.accept(object, builder);
		} else {
			Set<String> set = object.keySet();
			for (String name : set) {
				JsonValue subValue = object.get(name);
				JsonValue newValue = createModify(subValue, evaluator, modifier);
				builder.add(name, newValue);
			}
		}
	}

	private JsonValue createModify(JsonValue source, Function<JsonObject, Boolean> evaluator,
			BiConsumer<JsonObject, JsonObjectBuilder> modifier) {
		if (source instanceof JsonObject) {
			JsonObjectBuilder builder = Json.createObjectBuilder();
			JsonObject subObject = (JsonObject) source;
			modifyObject(subObject, builder, evaluator, modifier);
			return builder.build();
		} else if (source instanceof JsonArray) {
			JsonArrayBuilder builder = Json.createArrayBuilder();
			JsonArray array = (JsonArray) source;
			array.forEach((element) -> {
				JsonValue newValue = createModify(element, evaluator, modifier);
				builder.add(newValue);
			});
			return builder.build();
		} else {
			return createSimple(source);
		}
	}

	public static JsonValue createClone(JsonValue source) {
		if (source instanceof JsonObject) {
			JsonObjectBuilder builder = Json.createObjectBuilder();
			JsonObject subObject = (JsonObject) source;
			Set<String> set = subObject.keySet();
			for (String name : set) {
				JsonValue subValue = subObject.get(name);
				JsonValue newValue = createClone(subValue);
				builder.add(name, newValue);
			}
			return builder.build();
		} else if (source instanceof JsonArray) {
			JsonArrayBuilder builder = Json.createArrayBuilder();
			JsonArray array = (JsonArray) source;
			array.forEach((element) -> {
				JsonValue newValue = createClone(element);
				builder.add(newValue);
			});
			return builder.build();
		} else {
			return createSimple(source);
		}
	}

	public static JsonValue createSimple(JsonValue source) {
		if (source instanceof JsonNumber) {
			JsonNumber number = (JsonNumber) source;
			Number value = number.numberValue();
			if (value instanceof Integer) {
				return Json.createValue(value.intValue());
			} else {
				return Json.createValue(value.floatValue());
			}
		} else if (source instanceof JsonString) {
			JsonString value = (JsonString) source;
			String string = value.getString();
			return Json.createValue(string);
		} else if (source.getValueType() == ValueType.TRUE) {
			return JsonValue.TRUE;
		} else if (source.getValueType() == ValueType.FALSE) {
			return JsonValue.FALSE;
		} else {
			return JsonValue.NULL;
		}
	}

	protected void addCopyValue(JsonObjectBuilder builder, JsonObject original, String name) {
		JsonValue value = original.get(name);
		JsonValue newValue = createClone(value);
		builder.add(name, newValue);
	}

	protected JsonObjectBuilder createEmptyObject() {
		JsonObjectBuilder subBuilder = Json.createObjectBuilder();
		return subBuilder;
	}

	protected void addCopyAllFieldExcludes(JsonObjectBuilder builder, JsonObject original, String... excludes) {
		Set<String> set = original.keySet();
		for (String name : set) {
			boolean excluded = false;
			for (String exclude : excludes) {
				if (name.equals(exclude)) {
					excluded = true;
					break;
				}
			}
			if (!excluded) {
				addCopyValue(builder, original, name);
			}
		}
	}

}
