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
package com.andia.mixin.padang.garut.values;

import java.util.Iterator;
import java.util.Map;

import com.andia.mixin.padang.garut.DataminerRow;
import com.andia.mixin.value.MixinRecord;
import com.andia.mixin.value.MixinRecordSet;

public class GarutRecordSet implements MixinRecordSet {

	private Map<String, Integer> columns;
	private Iterator<DataminerRow> iterator;

	public GarutRecordSet(Map<String, Integer> columns, Iterator<DataminerRow> iterator) {
		this.columns = columns;
		this.iterator = iterator;
	}

	@Override
	public boolean next() {
		return iterator.hasNext();
	}

	@Override
	public MixinRecord getRecord() {
		DataminerRow row = iterator.next();
		return new GarutRecord(columns, row);
	}

}
