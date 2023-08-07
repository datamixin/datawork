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
package com.andia.mixin.padang.dumai;

import java.util.HashMap;
import java.util.Map;

import com.andia.mixin.padang.dumai.Prominer.Type;

public class ColumnTypeMapping {

	private static ColumnTypeMapping instance;

	private Map<String, Type> types = new HashMap<>();

	private ColumnTypeMapping() {
		types.put("TEXT", Prominer.Type.STRING);
		types.put("NUMBER", Prominer.Type.INTEGER);
		types.put("LOGICAL", Prominer.Type.BOOLEAN);
		types.put("BYTES", Prominer.Type.BYTES);
	}

	public static ColumnTypeMapping getInstance() {
		if (instance == null) {
			instance = new ColumnTypeMapping();
		}
		return instance;
	}

	public Type getType(String type) {
		return types.get(type);
	}

}
