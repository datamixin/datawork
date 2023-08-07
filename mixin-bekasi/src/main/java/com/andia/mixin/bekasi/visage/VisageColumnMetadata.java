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

import com.andia.mixin.value.MixinColumnMetadata;

public class VisageColumnMetadata extends VisageValue implements MixinColumnMetadata {

	private int valueCount;
	private int nullCount;
	private int errorCount;

	public VisageColumnMetadata() {
		super(VisageColumnMetadata.class);
	}

	public VisageColumnMetadata(MixinColumnMetadata metadata) {
		this();
		valueCount = metadata.getValueCount();
		nullCount = metadata.getNullCount();
		errorCount = metadata.getErrorCount();
	}

	@Override
	public int getValueCount() {
		return valueCount;
	}

	@Override
	public int getNullCount() {
		return nullCount;
	}

	@Override
	public int getErrorCount() {
		return errorCount;
	}

	@Override
	public String info() {
		return "{@class:Table, nullCount: " + nullCount + ", errorCount: " + errorCount + "}";
	}

}
