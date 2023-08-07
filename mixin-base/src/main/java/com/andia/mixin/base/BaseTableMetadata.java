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
package com.andia.mixin.base;

import com.andia.mixin.value.MixinTableMetadata;

public abstract class BaseTableMetadata implements MixinTableMetadata {

	private int recordCount = 0;
	private int partRecordCount = UNDETERMINED;
	private int[] orderedColumns = null;

	public BaseTableMetadata() {

	}

	public BaseTableMetadata(MixinTableMetadata metadata) {
		recordCount = metadata.getRecordCount();
		partRecordCount = metadata.getPartRecordCount();
		orderedColumns = metadata.getOrderedColumns();
	}

	@Override
	public int getRecordCount() {
		return recordCount;
	}

	public void setRecordCount(int recordCount) {
		this.recordCount = recordCount;
	}

	@Override
	public int[] getOrderedColumns() {
		return orderedColumns == null ? NO_ORDERED_COLUMNS : orderedColumns;
	}

	public void setOrderedColumns(int... orderedColumns) {
		this.orderedColumns = orderedColumns;
	}

	@Override
	public int getPartRecordCount() {
		return partRecordCount;
	}

	public void setPartRecordCount(int partRecordCount) {
		this.partRecordCount = partRecordCount;
	}

}
