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

public class MethodUtils {

	public static String checkDoField(String prefix, String name) {
		if (name.startsWith(prefix) && name.length() > prefix.length()) {
			int index = prefix.length();
			char ch = name.charAt(index);
			if (Character.isUpperCase(ch)) {
				return Character.toLowerCase(ch) + name.substring(index + 1);
			}
		}
		return null;
	}

	public static String checkGetOrIsField(String methodName) {
		String fieldName = MethodUtils.checkDoField("get", methodName);
		if (fieldName == null) {
			fieldName = MethodUtils.checkDoField("is", methodName);
		}
		return fieldName;
	}

	public static String checkSetField(String methodName) {
		return MethodUtils.checkDoField("set", methodName);
	}

	public static boolean isExistsSetField(String methodName, String fieldName) {
		String checkSet = checkSetField(methodName);
		if (checkSet != null) {
			return checkSet.equals(fieldName);
		} else {
			return false;
		}
	}

}
