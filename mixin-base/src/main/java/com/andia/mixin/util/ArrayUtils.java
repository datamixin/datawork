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

import java.util.Arrays;

public class ArrayUtils {

	private ArrayUtils() {

	}

	@SuppressWarnings("unchecked")
	public final static <T> T[] push(T[] array, T... elements) {
		int arrayLength = array.length;
		int elementsLength = elements.length;
		T[] result = Arrays.copyOf(array, arrayLength + elementsLength);
		for (int i = 0; i < elementsLength; i++) {
			result[arrayLength + i] = elements[i];
		}
		return result;
	}

	public final static int[] push(int[] array, int... elements) {
		int arrayLength = array.length;
		int elementsLength = elements.length;
		int[] result = Arrays.copyOf(array, arrayLength + elementsLength);
		for (int i = 0; i < elementsLength; i++) {
			result[arrayLength + i] = elements[i];
		}
		return result;
	}

	public final static <T> T[] slice(T[] array, int start) {
		T[] result = Arrays.copyOf(array, array.length - start);
		for (int i = 0; i < result.length; i++) {
			result[i] = array[i + start];
		}
		return result;
	}

	public final static <T> T[] slice(T[] array, int start, int end) {
		T[] result = Arrays.copyOf(array, end - start);
		for (int i = 0; i < result.length; i++) {
			result[i] = array[i + start];
		}
		return result;
	}

	public final static byte[] slice(byte[] array, int start, int end) {
		byte[] result = Arrays.copyOf(array, end - start);
		for (int i = 0; i < result.length; i++) {
			result[i] = array[i + start];
		}
		return result;
	}

	@SuppressWarnings("unchecked")
	public final static <T> T[] splice(T[] array, int index, int deletes, T... inserts) {

		// Hitung jumlah bagian setelah delete yang masih dipakai
		int arrayLength = array.length;
		int endIndex = Math.min(arrayLength, index + deletes);
		int left = arrayLength - endIndex;

		// Hitung jumlah panjang array baru
		int insertLength = inserts.length;
		Object[] result = Arrays.copyOf(array, index + insertLength + left);

		// Isi bagian insert
		for (int i = 0; i < insertLength; i++) {
			result[index + i] = inserts[i];
		}

		// Copy bagian tersisa
		for (int i = 0; i < left; i++) {
			result[index + insertLength + i] = array[endIndex + i];
		}

		Class<? extends Object[]> arrayType = array.getClass();
		Class<?> componentType = arrayType.getComponentType();
		for (int i = 0; i < result.length; i++) {
			result[i] = componentType.cast(result[i]);
		}

		return (T[]) result;
	}

}
