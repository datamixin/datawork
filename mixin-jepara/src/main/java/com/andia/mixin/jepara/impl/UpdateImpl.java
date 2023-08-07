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

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.andia.mixin.jepara.Clause;
import com.andia.mixin.jepara.Configuration;
import com.andia.mixin.jepara.Name;
import com.andia.mixin.jepara.QueryField;
import com.andia.mixin.jepara.QueryParam;
import com.andia.mixin.jepara.QueryValue;
import com.andia.mixin.jepara.SelectColumn;
import com.andia.mixin.jepara.Update;

public class UpdateImpl extends DMLQueryImpl implements Update {

	private Name table;
	private Map<Name, Clause> setValues = new LinkedHashMap<>();

	public UpdateImpl(Configuration configuration, Name table) {
		super(configuration);
		this.table = table;

	}

	@Override
	public Update set(String column, SelectColumn value) {
		setValues.put(name(column), value);
		return this;
	}

	@Override
	public Update set(String column, QueryValue value) {
		setValues.put(name(column), value);
		return this;
	}

	@Override
	public Update set(String column, QueryField field) {
		setValues.put(name(column), field);
		return this;
	}

	@Override
	protected void collectPreWhereParams(List<QueryParam> params) {
		for (Object value : setValues.values()) {
			if (value instanceof QueryParam) {
				params.add((QueryParam) value);
			} else if (value instanceof QueryField) {
				QueryField field = (QueryField) value;
				field.collectParams(params);
			}
		}
	}

	@Override
	public String getLiteral() {
		return newBuilder("UPDATE")
				.space()
				.add(table)
				.space()
				.add("SET")
				.space()
				.comma(setValues, " = ")
				.space()
				.add(where())
				.build();
	}

}
