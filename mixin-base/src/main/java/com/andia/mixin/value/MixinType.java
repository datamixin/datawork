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
package com.andia.mixin.value;

import java.util.ArrayList;
import java.util.List;

import com.andia.mixin.util.ClassUnifier;

public enum MixinType {

	ANY(java.lang.Object.class),

	STRING(java.lang.String.class),

	BOOLEAN(java.lang.Boolean.class, boolean.class),

	INT32(java.lang.Integer.class, int.class),

	INT64(java.lang.Long.class, long.class),

	FLOAT32(java.lang.Float.class, float.class),

	FLOAT64(java.lang.Double.class, double.class),

	TIMESTAMP(com.andia.mixin.util.Timestamp.class, java.lang.Long.class, long.class),

	DATETIME(com.andia.mixin.util.DateTime.class, java.lang.Long.class, long.class),

	DATE(com.andia.mixin.util.Date.class, java.lang.Long.class, long.class),

	MIXINLIST(com.andia.mixin.value.MixinList.class),

	MIXINOBJECT(com.andia.mixin.value.MixinObject.class),

	MIXINTABLE(com.andia.mixin.value.MixinTable.class),

	MIXINFUNCTION(com.andia.mixin.value.MixinFunction.class),

	MIXINBYTES(com.andia.mixin.value.MixinBytes.class);

	public final Class<?> definedClass;

	private Class<?>[] acceptedClasses;

	private MixinType(Class<?> definedClass, Class<?>... acceptedClass) {
		this.definedClass = definedClass;
		this.acceptedClasses = acceptedClass;
	}

	public Class<?> determine(ClassUnifier type) {
		if (type.classCount() == 0) {
			return definedClass;
		}
		Class<?> decidedType = type.decideClass();
		if (decidedType == definedClass) {
			return definedClass;
		}
		for (Class<?> acceptedClass : acceptedClasses) {
			if (acceptedClass == decidedType) {
				return definedClass;
			}
		}
		return decidedType;
	}

	public static MixinType getType(String type) {
		List<String> types = getTypes();
		if (types.indexOf(type) > -1) {
			return MixinType.valueOf(type);
		}
		return null;
	}

	public static MixinType getType(Class<?> typeClass) {
		MixinType[] types = MixinType.values();
		for (MixinType type : types) {
			if (type.definedClass.isAssignableFrom(typeClass)) {
				return type;
			}
			for (Class<?> acceptedClass : type.acceptedClasses) {
				if (acceptedClass.isAssignableFrom(typeClass)) {
					return type;
				}
			}
		}
		return null;
	}

	public static List<String> getTypes() {
		List<String> types = new ArrayList<>();
		MixinType[] values = MixinType.values();
		for (MixinType type : values) {
			types.add(type.toString());
		}
		return types;
	}

	public boolean isIntegerNumber() {
		return definedClass == Byte.class
				|| definedClass == Short.class
				|| definedClass == Float.class
				|| definedClass == Double.class;
	}
}
