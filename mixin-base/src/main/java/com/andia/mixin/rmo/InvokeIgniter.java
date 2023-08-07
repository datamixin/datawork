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
package com.andia.mixin.rmo;

import java.lang.reflect.Array;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class InvokeIgniter {

	private Object instance;

	public InvokeIgniter(Object instance) {
		this.instance = instance;
	}

	public Object ignite(String name, Object[] arguments) throws InvokeIgniterException {

		// Baca method dari outset
		Class<?> instanceClass = instance.getClass();
		Method[] methods = instanceClass.getMethods();
		for (Method method : methods) {

			// Hanya yang annotated @Inspect saja
			if (method.isAnnotationPresent(Invoke.class)) {

				// Ambil annotation
				Invoke annotation = method.getAnnotation(Invoke.class);
				String value = annotation.value();

				// Nama inspector yang sesuai
				if (name.equals(value)) {
					try {

						// Hanya untuk jumlah parameter yang sama
						Class<?>[] parameterTypes = method.getParameterTypes();
						if (parameterTypes.length != arguments.length) {
							throw new InvokeIgniterException("Parameter length mismatch");
						}

						// Argument harus di casting sesuai tipe parameter
						Object[] parameters = new Object[parameterTypes.length];
						for (int i = 0; i < parameters.length; i++) {

							// Array harus di buatkan tipe array dan casting per element
							Class<?> parameterType = parameterTypes[i];
							if (parameterType.isArray()) {

								// Casting argument ke array
								Object[] argArray = (Object[]) arguments[i];
								int length = argArray.length;

								// Siapkan tipe array yang sesuai
								Class<?> elementType = parameterType.getComponentType();
								Object parArray = Array.newInstance(elementType, length);
								for (int j = 0; j < length; j++) {

									// Casting array element sesuai tipe

									Object element = convert(elementType, argArray[j]);
									Array.set(parArray, j, element);

								}

								parameters[i] = parArray;

							} else {

								// Selain array langsung argument menjadi parameter
								parameters[i] = convert(parameterType, arguments[i]);
							}
						}

						// Berikan parameter yang sudah di casting
						Object result = method.invoke(instance, parameters);
						return result;

					} catch (IllegalAccessException | IllegalArgumentException | InvocationTargetException e) {
						String message = "Fail invoke method with annotation @Invoke(" + value + ")";
						throw new InvokeIgniterException(message, e);
					}
				}
			}
		}
		String message = "Missing method annotated with @Invoke(\"" + name + "\") in " + instanceClass;
		throw new InvokeIgniterException(message);

	}

	private Object convert(Class<?> parameterType, Object value) {
		if (value == null) {
			return null;
		}
		if (parameterType.isPrimitive()) {
			Class<? extends Object> valueClass = value.getClass();
			if (valueClass.isPrimitive()) {
				if (parameterType == long.class && valueClass == int.class) {
					return int.class.cast(value).longValue();
				}
			} else {
				if (parameterType == long.class && valueClass == Integer.class) {
					return Integer.class.cast(value).longValue();
				}
			}
		}
		return value;
	}

}
