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
package com.andia.mixin.jepara;

import java.util.List;

public interface QueryField extends Clause {

	public QueryField in(DMLQuery query);

	public QueryField isNull();

	public QueryField isNotNull();

	public QueryField equal(DMLQuery query);

	public QueryField equal(QueryParam param);

	public QueryField equal(QueryValue value);

	public QueryField equal(QueryField field);

	public QueryField like(QueryParam param);

	public QueryField greaterThenEquals(QueryParam param);

	public QueryField greaterThenEquals(QueryValue value);

	public QueryField greaterThen(QueryParam param);

	public QueryField lessThenEquals(QueryParam param);

	public QueryField lessThenEquals(QueryValue value);

	public QueryField lessThen(QueryParam param);

	public QueryField lessThen(QueryValue value);

	public QueryField and(QueryField field);

	public QueryField or(QueryField field);

	public QueryField plus(QueryField field);

	public QueryField plus(QueryValue value);

	public QueryField minus(QueryField field);

	public void collectParams(List<QueryParam> params);

}
