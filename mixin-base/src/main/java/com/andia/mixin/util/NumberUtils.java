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

import java.util.List;

public class NumberUtils {

	private NumberUtils() {

	}

	public static int indexOf(List<?> elements, Object value) {
		if (value instanceof Number) {
			Number b = (Number) value;
			for (int i = 0; i < elements.size(); i++) {
				Object element = elements.get(i);
				if (element instanceof Number) {
					Number a = (Number) element;
					if (equals(b, a)) {
						return i;
					}
				}
			}
		}
		return -1;
	}

	public static boolean equals(Number b, Number a) {
		return Long.compare(a.longValue(), b.longValue()) == 0 &&
				Double.compare(a.doubleValue(), b.doubleValue()) == 0;
	}

}
