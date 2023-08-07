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

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;

public class MapProminerRecord implements ProminerRecord {

	private long recordId;
	private Map<String, Object> values = new LinkedHashMap<>();

	public MapProminerRecord(Map<String, Object> values) {
		this.values = values;
	}

	public MapProminerRecord(long recordId) {
		this.recordId = recordId;
	}

	@Override
	public long getRecordId() {
		return recordId;
	}

	@Override
	public int columnCount() {
		return values.size();
	}

	@Override
	public Collection<String> columnNames() {
		return values.keySet();
	}

	@Override
	public Object getValue(String name) {
		return values.get(name);
	}

	public void setValue(String name, Object value) {
		values.put(name, value);
	}

}
