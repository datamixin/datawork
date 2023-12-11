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

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.andia.mixin.jepara.Configuration;
import com.andia.mixin.jepara.DMLQuery;
import com.andia.mixin.jepara.DataType;
import com.andia.mixin.jepara.OrderColumn;
import com.andia.mixin.jepara.PreparedQuery;
import com.andia.mixin.jepara.QueryException;
import com.andia.mixin.jepara.QueryField;
import com.andia.mixin.jepara.QueryParam;

public abstract class DMLQueryImpl extends QueryImpl implements DMLQuery {

	private QueryField field = null;
	private OrderColumn[] orders = null;

	public DMLQueryImpl(Configuration configuration) {
		super(configuration);
	}

	@Override
	public PreparedQuery prepare() {
		Map<String, DataTypeMapping> mappings = buildParamMappings();
		String literal = getLiteral();
		try {
			Connection connection = getConnection();
			PreparedStatement statement = connection.prepareStatement(literal);
			return new PreparedQueryImpl(statement, mappings);
		} catch (SQLException e) {
			throw new QueryException("Fail prepare statement " + literal, e);
		}
	}

	@Override
	public DMLQuery where(QueryField field) {
		this.field = field;
		return this;
	}

	private Map<String, DataTypeMapping> buildParamMappings() {

		List<QueryParam> params = getParams();

		// Build params sequence
		Map<String, DataTypeMapping> mappings = new LinkedHashMap<>();
		for (QueryParam param : params) {
			String name = param.getName();
			DataType<?> type = param.getType();
			int index = mappings.size() + 1;
			DataTypeMapping mapping = new DataTypeMapping(type, index);
			mappings.put(name, mapping);
		}
		return mappings;
	}

	protected List<QueryParam> getParams() {
		List<QueryParam> params = new ArrayList<>();
		collectPreWhereParams(params);
		collectInWhereParam(params);
		return params;
	}

	protected void collectPreWhereParams(List<QueryParam> params) {

	}

	protected void collectInWhereParam(List<QueryParam> params) {
		if (field != null) {
			field.collectParams(params);
		}
	}

	protected String where() {
		if (field == null) {
			return BLANK;
		} else {
			return newBuilder("WHERE")
					.space()
					.add(field)
					.build();
		}
	}

	protected String orderBy() {
		if (orders == null) {
			return BLANK;
		} else {
			return newBuilder("ORDER BY")
					.space()
					.comma(orders)
					.build();
		}
	}

	@Override
	public DMLQuery orderBy(OrderColumn... columns) {
		orders = columns;
		return this;
	}

}
