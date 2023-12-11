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
package com.andia.mixin.util;

import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.Collection;
import java.util.Map;
import java.util.UUID;

import com.andia.mixin.value.MixinValue;

public class SizeCalculator {

	private boolean strict = true;

	public SizeCalculator() {

	}

	public SizeCalculator(boolean strict) {
		this.strict = strict;
	}

	public long calculate(Object payload) {
		if (payload == null) {
			return Byte.BYTES;
		} else if (payload instanceof MixinValue) {
			Class<?> valueClass = payload.getClass();
			long size = 0;
			for (Field field : valueClass.getDeclaredFields()) {
				try {
					int modifiers = field.getModifiers();
					if (Modifier.isPrivate(modifiers) && !Modifier.isStatic(modifiers)) {
						field.setAccessible(true);
						Object object = field.get(payload);
						field.setAccessible(false);
						size += calculate(object);
					}
				} catch (Exception e) {
					throw new RuntimeException("Cannot estimate size of " + field, e);
				}
			}
			return size;
		} else if (payload instanceof Collection) {
			int size = 0;
			Collection<?> collection = (Collection<?>) payload;
			for (Object item : collection) {
				size += calculate(item);
			}
			return size;
		} else if (payload instanceof Map) {
			int size = 0;
			Map<?, ?> map = (Map<?, ?>) payload;
			for (Object key : map.keySet()) {
				Object value = map.get(key);
				size += calculate(key);
				size += calculate(value);
			}
			return size;
		} else if (payload.getClass().isArray()) {
			int size = 0;
			int length = Array.getLength(payload);
			for (int i = 0; i < length; i++) {
				Object element = Array.get(payload, i);
				size += calculate(element);
			}
			return size;
		} else if (payload instanceof String) {
			String string = (String) payload;
			return string.length();
		} else if (payload instanceof UUID) {
			return Long.BYTES * 2;
		} else if (boolean.class.isInstance(payload) || Boolean.class.isInstance(payload)) {
			return Byte.BYTES;
		} else if (byte.class.isInstance(payload) || Byte.class.isInstance(payload)) {
			return Byte.BYTES;
		} else if (short.class.isInstance(payload) || Short.class.isInstance(payload)) {
			return Short.BYTES;
		} else if (int.class.isInstance(payload) || Integer.class.isInstance(payload)) {
			return Integer.BYTES;
		} else if (long.class.isInstance(payload) || Long.class.isInstance(payload)) {
			return Long.BYTES;
		} else if (float.class.isInstance(payload) || Float.class.isInstance(payload)) {
			return Float.BYTES;
		} else if (double.class.isInstance(payload) || Double.class.isInstance(payload)) {
			return Double.BYTES;
		} else if (char.class.isInstance(payload) || Character.class.isInstance(payload)) {
			return Character.BYTES;
		} else if (Enum.class.isInstance(payload)) {
			return Integer.BYTES;
		} else if (Timestamp.class.isInstance(payload)) {
			return Long.BYTES;
		} else {
			if (!strict) {
				return 0;
			} else {
				Class<?> payloadClass = payload.getClass();
				String className = payloadClass.getSimpleName();
				throw new RuntimeException("Cannot estimate size of " + className);
			}
		}
	}

}
