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

import java.util.List;

import com.andia.mixin.jepara.DMLQuery;
import com.andia.mixin.jepara.InsertSelect;
import com.andia.mixin.jepara.PreparedQuery;
import com.andia.mixin.jepara.QueryField;
import com.andia.mixin.jepara.QueryParam;

public class InsertSelectImpl extends QueryImpl implements InsertSelect {

	private InsertIntoImpl insertInto;
	private SelectImpl select;

	public InsertSelectImpl(InsertIntoImpl insertInto, SelectImpl select) {
		super(insertInto.configuration);
		this.insertInto = insertInto;
		this.select = select;
	}

	@Override
	public InsertSelect from(String table) {
		select.from(table);
		return this;
	}

	@Override
	public DMLQuery where(QueryField field) {
		select.where(field);
		return insertInto;
	}

	@Override
	public void collectParams(List<QueryParam> params) {
		select.collectPreWhereParams(params);
		select.collectInWhereParam(params);
	}

	@Override
	public PreparedQuery prepare() {
		return insertInto.prepare();
	}

	@Override
	public String getLiteral() {
		return select.getLiteral();
	}

}
