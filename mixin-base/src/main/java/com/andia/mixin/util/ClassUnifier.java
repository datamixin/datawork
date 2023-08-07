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
import com.andia.mixin.value.MixinError;
import com.andia.mixin.value.MixinList;
import com.andia.mixin.value.MixinObject;
import com.andia.mixin.value.MixinTable;
import com.andia.mixin.value.MixinType;
import com.andia.mixin.value.MixinValue;

public class ClassUnifier {

	private Set<Class<?>> classes = new HashSet<>();
	private boolean hasError = false;
	private boolean hasNull = false;

	public void accept(Object result) {
		if (result == null) {
			hasNull = true;
			return;
		}
		if (result instanceof MixinError || result instanceof Throwable) {
			hasError = true;
			return;
		}
		Class<?> valueClass = result.getClass();
		if (!classes.contains(valueClass)) {
			classes.add(valueClass);
		}
	}

	public boolean isHasError() {
		return hasError;
	}

	public boolean isHasNull() {
		return hasNull;
	}

	public int classCount() {
		return classes.size();
	}

	public MixinType decideType() {
		Class<?> decideClass = decideClass();
		return MixinType.getType(decideClass);
	}

	public Class<?> decideClass() {
		int count = classes.size();
		if (count == 0) {
			return Object.class;
		} else if (count == 1) {
			Class<?> type = classes.iterator().next();
			if (MixinValue.class.isAssignableFrom(type) ||
					Number.class.isAssignableFrom(type) ||
					String.class.isAssignableFrom(type) ||
					Boolean.class.isAssignableFrom(type) ||
					Date.class.isAssignableFrom(type) ||
					Time.class.isAssignableFrom(type) ||
					Timestamp.class.isAssignableFrom(type) ||
					Elapsed.class.isAssignableFrom(type)) {
				return type;
			} else {
				return Object.class;
			}
		} else {
			int numbers = 0;
			int dates = 0;
			int datetimes = 0;
			int times = 0;
			int timestamps = 0;
			int lists = 0;
			int bytes = 0;
			int tables = 0;
			int objects = 0;
			for (Class<?> type : classes) {

				if (Number.class.isAssignableFrom(type)) {
					numbers++;

				} else if (Date.class.isAssignableFrom(type)) {
					dates++;

				} else if (DateTime.class.isAssignableFrom(type)) {
					datetimes++;

				} else if (Time.class.isAssignableFrom(type)) {
					times++;

				} else if (Timestamp.class.isAssignableFrom(type)) {
					timestamps++;

				} else if (MixinList.class.isAssignableFrom(type)) {
					lists++;

				} else if (MixinBytes.class.isAssignableFrom(type)) {
					bytes++;

				} else if (MixinTable.class.isAssignableFrom(type)) {
					tables++;

				} else if (MixinObject.class.isAssignableFrom(type)) {
					objects++;
				}
			}
			if (numbers == count) {

				return Number.class;

			} else if (dates == count) {

				return Date.class;

			} else if (datetimes == count) {

				return DateTime.class;

			} else if (times == count) {

				return Time.class;

			} else if (timestamps == count) {

				return Timestamp.class;

			} else if (lists == count) {

				return MixinList.class;

			} else if (bytes == count) {

				return MixinBytes.class;

			} else if (tables == count) {

				return MixinTable.class;

			} else if (objects == count) {

				return MixinObject.class;

			} else {
				return Object.class;
			}
		}
	}

	public Set<Class<?>> getClasses() {
		return classes;
	}

}
