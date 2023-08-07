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
package com.andia.mixin.padang.garut.util;

import java.util.HashMap;
import java.util.Map;

import com.andia.mixin.value.MixinType;

public class TypeUtils {

	public final static Map<String, MixinType> NAME_TYPE = new HashMap<>();

	public final static String INT = "int";
	public final static String INT32 = "int32";
	public final static String INT64 = "int64";
	public final static String FLOAT32 = "float32";
	public final static String FLOAT64 = "float64";
	public final static String BOOL = "bool";
	public final static String BOOL_ = "bool_";
	public final static String STR = "str";
	public final static String STRING = "string";

	public final static String LIST = "list";
	public final static String OBJECT = "object";
	public final static String OBJECT_ = "object_";
	public final static String TABLE = "table";
	public final static String BYTES = "bytes";
	public final static String TIMESTAMP = "timestamp";
	public final static String DATETIME = "datetime";
	public final static String DATETIME64 = "datetime64";
	public final static String DATE = "date";

	static {
		NAME_TYPE.put(STR, MixinType.STRING);
		NAME_TYPE.put(STRING, MixinType.STRING);
		NAME_TYPE.put(BOOL, MixinType.BOOLEAN);
		NAME_TYPE.put(BOOL_, MixinType.BOOLEAN);
		NAME_TYPE.put(INT, MixinType.INT32);
		NAME_TYPE.put(INT32, MixinType.INT32);
		NAME_TYPE.put(INT64, MixinType.INT64);
		NAME_TYPE.put(FLOAT32, MixinType.FLOAT32);
		NAME_TYPE.put(FLOAT64, MixinType.FLOAT64);
		NAME_TYPE.put(DATE, MixinType.DATE);
		NAME_TYPE.put(TIMESTAMP, MixinType.TIMESTAMP);
		NAME_TYPE.put(DATETIME, MixinType.DATETIME);
		NAME_TYPE.put(DATETIME64, MixinType.DATETIME);

		NAME_TYPE.put(LIST, MixinType.MIXINLIST);
		NAME_TYPE.put(TABLE, MixinType.MIXINTABLE);
		NAME_TYPE.put(BYTES, MixinType.MIXINBYTES);
		NAME_TYPE.put(OBJECT, MixinType.MIXINOBJECT);
		NAME_TYPE.put(OBJECT_, MixinType.MIXINOBJECT);
	}

	public static MixinType getType(String type) {
		if (NAME_TYPE.containsKey(type)) {
			return NAME_TYPE.get(type);
		}
		return MixinType.ANY;
	}

}
