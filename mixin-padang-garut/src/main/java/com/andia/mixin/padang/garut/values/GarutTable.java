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

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.andia.mixin.padang.garut.DataminerColumn;
import com.andia.mixin.padang.garut.DataminerRow;
import com.andia.mixin.padang.garut.DataminerTable;
import com.andia.mixin.value.MixinColumn;
import com.andia.mixin.value.MixinRecordSet;
import com.andia.mixin.value.MixinTable;
import com.andia.mixin.value.MixinTableMetadata;

public class GarutTable implements MixinTable {

	private GarutTableMetadata metadata = null;
	private DataminerTable table;

	public GarutTable(DataminerTable table) {
		this.table = table;
		this.metadata = new GarutTableMetadata(table);
	}

	@Override
	public int columnCount() {
		return table.getColumnCount();
	}

	@Override
	public MixinColumn getColumn(int index) {
		DataminerColumn column = table.getColumn(index);
		return new GarutColumn(column);
	}

	@Override
	public MixinTableMetadata getMetadata() {
		return metadata;
	}

	@Override
	public MixinRecordSet recordSet() {
		Map<String, Integer> columns = new HashMap<>();
		for (int i = 0; i < table.getColumnCount(); i++) {
			DataminerColumn column = table.getColumn(i);
			String name = column.getName();
			columns.put(name, i);
		}
		List<DataminerRow> rowList = table.getRecordList();
		Iterator<DataminerRow> iterator = rowList.iterator();
		return new GarutRecordSet(columns, iterator);
	}

}
