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

import java.util.List;

import com.andia.mixin.jepara.InsertValues;
import com.andia.mixin.jepara.PreparedQuery;
import com.andia.mixin.jepara.QueryParam;
import com.andia.mixin.jepara.QueryValue;

public class InsertValuesImpl extends QueryImpl implements InsertValues {

	private QueryValue[] values;
	private InsertIntoImpl insertInto;

	public InsertValuesImpl(InsertIntoImpl insertInto, QueryValue[] values) {
		super(insertInto.configuration);
		this.insertInto = insertInto;
		this.values = values;
	}

	@Override
	public void collectParams(List<QueryParam> params) {
		for (QueryValue value : values) {
			if (value instanceof QueryParam) {
				params.add((QueryParam) value);
			}
		}
	}

	@Override
	public PreparedQuery prepare() {
		return insertInto.prepare();
	}

	@Override
	public String getLiteral() {
		return newBuilder("VALUES")
				.space()
				.openClose(values)
				.build();
	}

}
