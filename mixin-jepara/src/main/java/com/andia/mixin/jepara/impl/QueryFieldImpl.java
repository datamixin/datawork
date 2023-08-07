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

import static com.andia.mixin.jepara.impl.DSL.nullName;

import java.util.ArrayList;
import java.util.List;

import com.andia.mixin.jepara.ChainClause;
import com.andia.mixin.jepara.Clause;
import com.andia.mixin.jepara.DMLQuery;
import com.andia.mixin.jepara.Name;
import com.andia.mixin.jepara.QueryField;
import com.andia.mixin.jepara.QueryParam;
import com.andia.mixin.jepara.QueryValue;

public class QueryFieldImpl implements QueryField {

	private Name table;
	private Name column;
	private List<ChainClause> chainClauses = new ArrayList<>();

	public QueryFieldImpl(Name column) {
		this.column = column;
	}

	public QueryFieldImpl(Name table, Name column) {
		this.table = table;
		this.column = column;
	}

	private boolean addChain(String chain, Clause clause) {
		ChainClause chainClause = new ChainClauseImpl(chain, clause);
		return chainClauses.add(chainClause);
	}

	@Override
	public QueryField isNull() {
		addChain("IS", nullName());
		return this;
	}

	@Override
	public QueryField isNotNull() {
		addChain("IS NOT", nullName());
		return this;
	}

	@Override
	public QueryField in(DMLQuery query) {
		addChain("IN", query);
		return this;
	}

	@Override
	public QueryField equal(DMLQuery query) {
		addChain("=", query);
		return this;
	}

	@Override
	public QueryField equal(QueryParam param) {
		addChain("=", param);
		return this;
	}

	@Override
	public QueryField equal(QueryValue value) {
		addChain("=", value);
		return this;
	}

	@Override
	public QueryField equal(QueryField field) {
		addChain("=", field);
		return this;
	}

	@Override
	public QueryField like(QueryParam param) {
		addChain("LIKE", param);
		return this;
	}

	@Override
	public QueryField greaterThen(QueryParam param) {
		addChain(">", param);
		return this;
	}

	@Override
	public QueryField greaterThenEquals(QueryParam param) {
		addChain(">=", param);
		return this;
	}

	@Override
	public QueryField greaterThenEquals(QueryValue value) {
		addChain(">=", value);
		return this;
	}

	@Override
	public QueryField lessThen(QueryParam param) {
		addChain("<", param);
		return this;
	}

	@Override
	public QueryField lessThen(QueryValue value) {
		addChain("<", value);
		return this;
	}

	@Override
	public QueryField lessThenEquals(QueryParam param) {
		addChain("<=", param);
		return this;
	}

	@Override
	public QueryField lessThenEquals(QueryValue value) {
		addChain("<=", value);
		return this;
	}

	@Override
	public QueryField and(QueryField field) {
		addChain("AND", field);
		return this;
	}

	@Override
	public QueryField or(QueryField field) {
		addChain("OR", field);
		return this;
	}

	@Override
	public QueryField plus(QueryField field) {
		addChain("+", field);
		return this;
	}

	@Override
	public QueryField plus(QueryValue value) {
		addChain("+", value);
		return this;
	}

	@Override
	public QueryField minus(QueryField field) {
		addChain("-", field);
		return this;
	}

	@Override
	public void collectParams(List<QueryParam> params) {

		for (ChainClause chainClause : chainClauses) {

			Clause clause = chainClause.getClause();

			if (clause instanceof QueryParam) {

				params.add((QueryParam) clause);

			} else if (clause instanceof QueryField) {

				QueryField field = (QueryField) clause;
				field.collectParams(params);

			} else if (clause instanceof DMLQueryImpl) {

				DMLQueryImpl query = (DMLQueryImpl) clause;
				List<QueryParam> subParams = query.getParams();
				for (QueryParam subParam : subParams) {
					params.add(subParam);
				}
			}
		}
	}

	@Override
	public String getLiteral() {
		String tableColumn = column.getLiteral();
		if (table != null) {
			String tableLiteral = table.getLiteral();
			tableColumn = tableLiteral + "." + tableColumn;
		}
		return new LiteralBuilder().add(tableColumn)
				.series(chainClauses)
				.build();
	}

}
