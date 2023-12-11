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
package com.andia.mixin.jepara.impl;

import static com.andia.mixin.jepara.impl.DSL.names;

import java.util.List;

import com.andia.mixin.jepara.Configuration;
import com.andia.mixin.jepara.InsertInto;
import com.andia.mixin.jepara.InsertSelect;
import com.andia.mixin.jepara.InsertValues;
import com.andia.mixin.jepara.Name;
import com.andia.mixin.jepara.QueryParam;
import com.andia.mixin.jepara.QueryValue;
import com.andia.mixin.jepara.SelectValue;

public class InsertIntoImpl extends DMLQueryImpl implements InsertInto {

	private Name table;
	private Name[] columnNames;
	private InsertValues values;

	public InsertIntoImpl(Configuration configuration, Name table) {
		super(configuration);
		this.table = table;
	}

	@Override
	public InsertInto columns(String... columnNames) {
		this.columnNames = names(columnNames);
		return this;
	}

	@Override
	public InsertValues values(QueryValue... values) {
		this.values = new InsertValuesImpl(this, values);
		return this.values;
	}

	@Override
	public InsertSelect select(SelectValue... columns) {
		SelectImpl select = new SelectImpl(configuration, columns);
		this.values = new InsertSelectImpl(this, select);
		return (InsertSelect) values;
	}

	@Override
	protected void collectPreWhereParams(List<QueryParam> params) {
		this.values.collectParams(params);
	}

	@Override
	public String getLiteral() {
		return newBuilder("INSERT INTO")
				.space()
				.add(table)
				.space()
				.openClose(columnNames)
				.space()
				.add(values.getLiteral())
				.build();
	}

}
