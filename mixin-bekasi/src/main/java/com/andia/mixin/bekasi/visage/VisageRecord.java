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
import java.util.List;

import com.andia.mixin.Lean;
import com.andia.mixin.value.MixinRecord;

public class VisageRecord extends Lean implements MixinRecord {

	private List<VisageColumn> columns = new ArrayList<>();
	private Object[] values = new Object[0];

	public VisageRecord() {
		super(VisageRecord.class);
	}

	public VisageRecord(List<VisageColumn> columns, Object value) {
		this();
		this.columns = columns;
		this.values = new Object[] { value };
	}

	public VisageRecord(List<VisageColumn> columns, Object[] values) {
		this();
		this.columns = columns;
		this.values = values;
	}

	public Object[] getValues() {
		return values;
	}

	@Override
	public int length() {
		return values.length;
	}

	@Override
	public Object get(int column) {
		return values[column];
	}

	@Override
	public Object get(String column) {
		for (int i = 0; i < columns.size(); i++) {
			VisageColumn resultColumn = columns.get(i);
			if (resultColumn.getKey().equals(column)) {
				return values[i];
			}
		}
		return null;
	}

	@Override
	public boolean isExists(String column) {
		for (int i = 0; i < columns.size(); i++) {
			VisageColumn resultColumn = columns.get(i);
			if (resultColumn.getKey().equals(column)) {
				return true;
			}
		}
		return false;
	}

}
