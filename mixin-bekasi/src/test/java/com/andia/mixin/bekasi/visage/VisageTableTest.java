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
package com.andia.mixin.bekasi.visage;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;

import com.andia.mixin.value.MixinColumn;
import com.andia.mixin.value.MixinColumnMetadata;
import com.andia.mixin.value.MixinRecord;
import com.andia.mixin.value.MixinRecordSet;
import com.andia.mixin.value.MixinTable;
import com.andia.mixin.value.MixinTableMetadata;
import com.andia.mixin.value.MixinType;

public class VisageTableTest {

	@Test
	public void test() {

		String key = "column-1";
		VisageColumn column = new VisageColumn(key);
		VisageTable table = new VisageTable();

		// Value column metadata
		MixinColumnMetadata firstMetadata = mock(MixinColumnMetadata.class);

		// Value column mock
		MixinColumn firstColumn = mock(MixinColumn.class);
		when(firstColumn.getKey()).thenReturn(key);
		when(firstColumn.getMetadata()).thenReturn(firstMetadata);
		when(firstColumn.getType()).thenReturn(MixinType.STRING.name());

		// Value record mock
		MixinRecord firstRecord = mock(MixinRecord.class);
		String value = "value";
		when(firstRecord.length()).thenReturn(1);
		when(firstRecord.get(0)).thenReturn(value);

		// Metadata mock
		MixinTableMetadata tableMetadata = mock(MixinTableMetadata.class);

		// Value table mock
		MixinTable valueTable = mock(MixinTable.class);
		when(valueTable.getMetadata()).thenReturn(tableMetadata);
		when(valueTable.columnCount()).thenReturn(1);
		when(valueTable.getColumn(0)).thenReturn(firstColumn);

		// RecordSet mock
		MixinRecordSet recordSet = mock(MixinRecordSet.class);
		when(valueTable.recordSet()).thenReturn(recordSet);
		when(recordSet.next()).thenReturn(true, false);
		when(recordSet.getRecord()).thenReturn(firstRecord);

		table.init(valueTable);

		assertEquals(1, table.columnCount());
		assertEquals(column.getKey(), table.getColumn(0).getKey());

		assertEquals(1, table.recordCount());
		VisageRecord row = table.getRecord(0);
		VisageText text = (VisageText) row.getValues()[0];
		assertEquals(value, text.getValue());

	}
}
