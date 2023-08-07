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

import com.andia.mixin.padang.garut.DataminerColumn;
import com.andia.mixin.padang.garut.DataminerColumn.KeyCase;
import com.andia.mixin.padang.garut.util.TypeUtils;
import com.andia.mixin.value.MixinColumn;
import com.andia.mixin.value.MixinColumnMetadata;

public class GarutColumn implements MixinColumn {

	private DataminerColumn column;
	private MixinColumnMetadata metadata = new GarutColumnMetadata();

	public GarutColumn(DataminerColumn column) {
		this.column = column;
	}

	@Override
	public Object getKey() {
		KeyCase keyCase = column.getKeyCase();
		int number = keyCase.getNumber();
		if (number == DataminerColumn.NAME_FIELD_NUMBER) {
			return column.getName();
		} else {
			return column.getIndex();
		}
	}

	@Override
	public String getType() {
		String type = column.getType();
		return TypeUtils.getType(type).name();
	}

	@Override
	public MixinColumnMetadata getMetadata() {
		return metadata;
	}

}
