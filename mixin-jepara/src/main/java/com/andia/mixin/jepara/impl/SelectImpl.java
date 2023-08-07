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

import static com.andia.mixin.jepara.impl.DSL.name;

import java.util.List;

import com.andia.mixin.jepara.Configuration;
import com.andia.mixin.jepara.Name;
import com.andia.mixin.jepara.QueryParam;
import com.andia.mixin.jepara.Select;
import com.andia.mixin.jepara.SelectValue;

public class SelectImpl extends DMLQueryImpl implements Select {

	private Name[] tables;
	private SelectValue[] columns;

	public SelectImpl(Configuration configuration, SelectValue... columns) {
		super(configuration);
		this.columns = columns;
	}

	@Override
	public Select from(String table) {
		this.tables = new Name[] { name(table) };
		return this;
	}

	@Override
	public Select from(String... tables) {
		this.tables = new Name[tables.length];
		for (int i = 0; i < tables.length; i++) {
			this.tables[i] = name(tables[i]);
		}
		return this;
	}

	@Override
	protected void collectPreWhereParams(List<QueryParam> params) {
		for (SelectValue value : columns) {
			if (value instanceof QueryParam) {
				params.add((QueryParam) value);
			}
		}
	}

	@Override
	public String getLiteral() {
		return newBuilder("SELECT")
				.space()
				.comma(columns)
				.space()
				.add("FROM")
				.space()
				.comma(tables)
				.space()
				.add(where())
				.space()
				.add(orderBy())
				.build();
	}

}
