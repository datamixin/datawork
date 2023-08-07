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
package com.andia.mixin.bekasi.visage;

import java.lang.reflect.Array;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.andia.mixin.util.Date;
import com.andia.mixin.util.DateTime;
import com.andia.mixin.util.Elapsed;
import com.andia.mixin.util.Time;
import com.andia.mixin.util.Timestamp;
import com.andia.mixin.value.MixinBrief;
import com.andia.mixin.value.MixinBytes;
import com.andia.mixin.value.MixinError;
import com.andia.mixin.value.MixinFunction;
import com.andia.mixin.value.MixinList;
import com.andia.mixin.value.MixinObject;
import com.andia.mixin.value.MixinPlot;
import com.andia.mixin.value.MixinTable;
import com.andia.mixin.value.MixinText;
import com.andia.mixin.value.MixinType;

public class VisageValueFactory {

	private static VisageValueFactory instance;

	private Map<Class<?>, Class<? extends VisageValue>> map = new HashMap<>();

	private VisageValueFactory() {

		// Generic
		map.put(List.class, VisageList.class);
		map.put(String.class, VisageText.class);
		map.put(Byte.class, VisageNumber.class);
		map.put(Short.class, VisageNumber.class);
		map.put(Integer.class, VisageNumber.class);
		map.put(Long.class, VisageNumber.class);
		map.put(Float.class, VisageNumber.class);
		map.put(Double.class, VisageNumber.class);
		map.put(Date.class, VisageNumber.class);
		map.put(Time.class, VisageNumber.class);
		map.put(Elapsed.class, VisageNumber.class);
		map.put(DateTime.class, VisageNumber.class);
		map.put(Timestamp.class, VisageNumber.class);
		map.put(BigInteger.class, VisageNumber.class);
		map.put(BigDecimal.class, VisageNumber.class);
		map.put(Boolean.class, VisageLogical.class);
		map.put(Throwable.class, VisageError.class);

		// Value
		map.put(MixinType.class, VisageType.class);
		map.put(MixinList.class, VisageList.class);
		map.put(MixinText.class, VisageText.class);
		map.put(MixinPlot.class, VisagePlot.class);
		map.put(MixinBrief.class, VisageBrief.class);
		map.put(MixinTable.class, VisageTable.class);
		map.put(MixinError.class, VisageError.class);
		map.put(MixinBytes.class, VisageBytes.class);
		map.put(MixinObject.class, VisageObject.class);
		map.put(MixinFunction.class, VisageFunction.class);

	}

	public static VisageValueFactory getInstance() {
		if (instance == null) {
			instance = new VisageValueFactory();
		}
		return instance;
	}

	public VisageValue create(Object object) {

		if (object == null) {

			return new VisageNull();

		} else {

			Class<? extends Object> objectClass = object.getClass();
			if (object instanceof MixinType) {

				// Mixin type
				VisageType type = new VisageType();
				type.init(object);
				return type;

			} else if (map.containsKey(objectClass)) {

				// Regular java object dapat langsung di kenali
				return createVisageValue(object, objectClass);

			} else if (object instanceof Throwable) {

				// Exception langsung menjadi result error
				return new VisageError((Throwable) object);

			} else if (objectClass.isArray()) {

				// Array dijadikan list
				VisageList list = new VisageList();
				int length = Array.getLength(object);
				for (int i = 0; i < length; i++) {
					Object element = Array.get(object, i);
					VisageValue value = create(element);
					list.add(value);
				}
				return list;

			} else if (object instanceof Map) {

				Map<?, ?> map = (Map<?, ?>) object;
				VisageObject result = new VisageObject();
				for (Object key : map.keySet()) {
					Object value = map.get(key);
					Object converted = create(value);
					result.setField(key.toString(), converted);
				}
				return result;

			} else if (object instanceof Collection) {

				VisageList list = new VisageList();
				Collection<?> collection = (Collection<?>) object;
				for (Object element : collection) {
					VisageValue value = create(element);
					list.add(value);
				}
				return list;

			} else {

				// Cari semua interface yang dimiliki oleh object
				Class<?> currentClass = objectClass;
				while (currentClass != Object.class) {
					Class<?>[] interfaces = currentClass.getInterfaces();
					for (Class<?> iface : interfaces) {
						if (map.containsKey(iface)) {
							return createVisageValue(object, iface);
						}
					}
					currentClass = currentClass.getSuperclass();
				}

				// Selainnya jadikan result object
				VisageObject resultObject = new VisageObject();
				resultObject.init(object);
				return resultObject;
			}
		}

	}

	private VisageValue createVisageValue(Object object, Class<? extends Object> objectClass) {

		Class<? extends VisageValue> valueClass = map.get(objectClass);
		try {

			// Buat result value
			VisageValue value = valueClass.newInstance();
			value.init(object);

			return value;
		} catch (InstantiationException | IllegalAccessException e) {
			throw new VisageValueException("Fail create " + objectClass, e);
		}
	}

}
