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

import java.util.UUID;
import java.util.regex.Pattern;

public class UUIDUtils {

	private static String format = "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[34][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}";
	private static Pattern pattern = Pattern.compile(format);

	public static boolean isUUID(String string) {
		if (string == null) {
			return false;
		}
		return pattern.matcher(string).matches();
	}

	public static boolean isUUID(Object object) {
		if (object == null) {
			return false;
		} else if (object instanceof UUID) {
			return true;
		} else {
			String string = String.valueOf(object);
			return pattern.matcher(string).matches();
		}
	}

	public static UUID fromObject(Object object) {
		if (object == null) {
			throw new IllegalArgumentException("Invalid UUID: " + null);
		} else if (object instanceof UUID) {
			return (UUID) object;
		} else {
			String string = String.valueOf(object);
			return UUID.fromString(string);
		}
	}
}
