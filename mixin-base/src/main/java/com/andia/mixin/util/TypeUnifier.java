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
package com.andia.mixin.util;

import java.util.HashSet;
import java.util.Set;

import com.andia.mixin.value.MixinBytes;
import com.andia.mixin.value.MixinList;
import com.andia.mixin.value.MixinObject;
import com.andia.mixin.value.MixinTable;
import com.andia.mixin.value.MixinType;
import com.andia.mixin.value.MixinValue;

public class TypeUnifier {

	private Set<MixinType> types = new HashSet<>();
	private boolean hasError = false;

	public void accept(MixinType type) {
		if (!types.contains(type)) {
			types.add(type);
		}
	}

	public boolean isHasError() {
		return hasError;
	}

	public int typeCount() {
		return types.size();
	}

	public MixinType decideType() {
		int count = types.size();
		if (count == 1) {
			MixinType type = types.iterator().next();
			Class<?> typeClass = type.definedClass;
			if (Number.class.isAssignableFrom(typeClass) ||
					String.class.isAssignableFrom(typeClass) ||
					Boolean.class.isAssignableFrom(typeClass) ||
					MixinValue.class.isAssignableFrom(typeClass) ||
					Date.class.isAssignableFrom(typeClass) ||
					Time.class.isAssignableFrom(typeClass) ||
					Timestamp.class.isAssignableFrom(typeClass) ||
					Elapsed.class.isAssignableFrom(typeClass)) {
				return type;
			} else {
				return MixinType.MIXINOBJECT;
			}
		} else {
			int ints = 0;
			int longs = 0;
			int floats = 0;
			int doubles = 0;
			int lists = 0;
			int bytes = 0;
			int tables = 0;
			int objects = 0;
			for (MixinType type : types) {

				Class<?> typeClass = type.definedClass;
				if (Integer.class.isAssignableFrom(typeClass)) {
					ints++;

				} else if (Long.class.isAssignableFrom(typeClass)) {
					longs++;

				} else if (Float.class.isAssignableFrom(typeClass)) {
					floats++;

				} else if (Double.class.isAssignableFrom(typeClass)) {
					doubles++;

				} else if (MixinList.class.isAssignableFrom(typeClass)) {
					lists++;

				} else if (MixinBytes.class.isAssignableFrom(typeClass)) {
					bytes++;

				} else if (MixinTable.class.isAssignableFrom(typeClass)) {
					tables++;

				} else if (MixinObject.class.isAssignableFrom(typeClass)) {
					objects++;
				}
			}
			if (ints == count) {
				return MixinType.INT32;

			} else if (longs == count) {

				return MixinType.INT64;

			} else if (floats == count) {

				return MixinType.FLOAT32;

			} else if (doubles == count) {

				return MixinType.FLOAT64;

			} else if (lists == count) {

				return MixinType.MIXINLIST;

			} else if (bytes == count) {

				return MixinType.MIXINBYTES;

			} else if (tables == count) {

				return MixinType.MIXINTABLE;

			} else if (objects == count) {

				return MixinType.MIXINOBJECT;

			} else {
				return MixinType.ANY;
			}
		}
	}

}
