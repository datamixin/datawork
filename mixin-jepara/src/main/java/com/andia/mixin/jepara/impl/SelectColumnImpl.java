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
package com.andia.mixin.jepara.impl;

import com.andia.mixin.jepara.OrderColumn;
import com.andia.mixin.jepara.OrderColumn.Type;
import com.andia.mixin.jepara.SelectColumn;

public class SelectColumnImpl implements SelectColumn {

	private String table;
	private String name;

	public SelectColumnImpl(String name) {
		this.name = name;
	}

	public SelectColumnImpl(String table, String name) {
		this.table = table;
		this.name = name;
	}

	public OrderColumn asc() {
		return new OrderColumnImpl(name, Type.ASC);
	}

	public OrderColumn desc() {
		return new OrderColumnImpl(name, Type.DESC);
	}

	@Override
	public String getLiteral() {
		return table == null ? name : table + "." + name;
	}

}
