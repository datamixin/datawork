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
package com.andia.mixin.padang.model.reformer;

import java.util.Set;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;

import com.andia.mixin.bekasi.reformer.BaseReformer;
import com.andia.mixin.bekasi.reformer.Reformer;

public class V1SlemanToPadangReformer implements Reformer {

	@Override
	public int getVersion() {
		return 1;
	}

	@Override
	public void reform(JsonObject input, JsonObjectBuilder builder) {
		modifyEClass(input, builder);
	}

	private void modifyEClass(JsonObject original, JsonObjectBuilder builder) {
		Set<String> set = original.keySet();
		for (String name : set) {
			if (name.equals(ECLASS)) {
				String eClass = original.getString(ECLASS);
				String[] split = eClass.split(COLON);
				String eClassType = PadangReformer.PADANG + COLON + split[1];
				builder.add(ECLASS, eClassType);
			} else {
				JsonValue subValue = original.get(name);
				JsonValue newValue = createModifiedEClass(subValue);
				builder.add(name, newValue);
			}
		}
	}

	private JsonValue createModifiedEClass(JsonValue subValue) {
		if (subValue instanceof JsonObject) {
			JsonObjectBuilder subBuilder = Json.createObjectBuilder();
			JsonObject subObject = (JsonObject) subValue;
			modifyEClass(subObject, subBuilder);
			return subBuilder.build();
		} else if (subValue instanceof JsonArray) {
			JsonArrayBuilder builder = Json.createArrayBuilder();
			JsonArray array = (JsonArray) subValue;
			array.forEach((element) -> {
				JsonValue newValue = createModifiedEClass(element);
				builder.add(newValue);
			});
			return builder.build();
		} else {
			return BaseReformer.createSimple(subValue);
		}
	}

}
