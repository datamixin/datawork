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
package com.andia.mixin.bekasi.visage;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.andia.mixin.value.MixinColumn;
import com.andia.mixin.value.MixinRecord;
import com.andia.mixin.value.MixinRecordSet;
import com.andia.mixin.value.MixinTable;
import com.andia.mixin.value.MixinTableMetadata;

public class VisageTable extends VisageValue implements MixinTable {

	private VisageTableMetadata metadata = new VisageTableMetadata();
	private List<VisageColumn> columns = new ArrayList<>();
	private List<VisageRecord> records = new ArrayList<>();

	public VisageTable() {
		super(VisageTable.class);
	}

	public VisageTable(VisageColumn... columns) {
		this();
		for (VisageColumn column : columns) {
			this.columns.add(column);
		}
	}

	public VisageTable(MixinTable table) {
		this();
		init(table);
	}

	@Override
	public void init(Object source) {
		super.init(source);
		MixinTable table = (MixinTable) source;
		readMetadata(table);
		readColumns(table);
		readRecords(table);
	}

	private void readMetadata(MixinTable table) {
		MixinTableMetadata metadata = table.getMetadata();
		this.metadata = new VisageTableMetadata(metadata);
	}

	private void readColumns(MixinTable table) {
		for (int i = 0; i < table.columnCount(); i++) {
			MixinColumn valueColumn = table.getColumn(i);
			VisageColumn resultColumn = new VisageColumn(valueColumn);
			columns.add(resultColumn);
		}
		this.metadata.setColumns(columns.toArray(new VisageColumn[0]));
	}

	private void readRecords(MixinTable table) {
		MixinRecordSet recordSet = table.recordSet();
		while (recordSet.next()) {
			MixinRecord record = recordSet.getRecord();
			int length = record.length();
			Object[] values = new Object[length];
			VisageValueFactory factory = VisageValueFactory.getInstance();
			for (int i = 0; i < values.length; i++) {
				Object object = record.get(i);
				if (object != null) {
					Class<? extends Object> valueClass = object.getClass();
					if (valueClass.isPrimitive() ||
							valueClass == Boolean.class ||
							valueClass == Character.class ||
							valueClass == Byte.class ||
							valueClass == Short.class ||
							valueClass == Integer.class ||
							valueClass == Long.class ||
							valueClass == Float.class ||
							valueClass == Double.class) {
						values[i] = object;
					} else {
						values[i] = factory.create(object);
					}
				}
			}
			VisageRecord resultRecord = new VisageRecord(columns, values);
			records.add(resultRecord);
		}
	}

	public List<VisageColumn> getColumns() {
		return columns;
	}

	@Override
	public int columnCount() {
		return columns.size();
	}

	@Override
	public VisageColumn getColumn(int index) {
		return columns.get(index);
	}

	@Override
	public MixinTableMetadata getMetadata() {
		return metadata;
	}

	@Override
	public MixinRecordSet recordSet() {
		Iterator<VisageRecord> iterator = records.iterator();
		return new VisageRecordSet(iterator);
	}

	public List<VisageRecord> getRecords() {
		return records;
	}

	public int recordCount() {
		return records.size();
	}

	public VisageRecord getRecord(int index) {
		return records.get(index);
	}

	@Override
	public String info() {
		return "{@class:Table, columns: " + columns.size() + ", records: " + records.size() + "}";
	}

	public void addColumn(VisageColumn column) {
		columns.add(column);
	}

	public void addRecord(Object... values) {
		VisageRecord record = new VisageRecord(columns, values);
		records.add(record);
	}

}
