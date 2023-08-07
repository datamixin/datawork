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
package com.andia.mixin.padang.garut.values;

import java.util.Map;

import com.andia.mixin.padang.garut.DataminerRow;
import com.andia.mixin.padang.garut.DataminerValue;
import com.andia.mixin.padang.garut.converters.ValueConverterRegistry;
import com.andia.mixin.util.Timestamp;
import com.andia.mixin.value.MixinRecord;

public class GarutRecord implements MixinRecord {

	private Map<String, Integer> columns;
	private DataminerRow row;

	public GarutRecord(Map<String, Integer> columns, DataminerRow row) {
		this.columns = columns;
		this.row = row;
	}

	@Override
	public int length() {
		return row.getValueCount();
	}

	@Override
	public Object get(int column) {
		ValueConverterRegistry factory = ValueConverterRegistry.getInstance();
		DataminerValue value = row.getValue(column);
		Object object = factory.toObject(value);
		if (object instanceof Timestamp) {
			return ((Timestamp) object).getTime();
		} else {
			return object;
		}
	}

	@Override
	public Object get(String column) {
		Integer index = columns.get(column);
		Object value = get(index);
		return value;
	}

	@Override
	public boolean isExists(String column) {
		return columns.containsKey(column);
	}

}
