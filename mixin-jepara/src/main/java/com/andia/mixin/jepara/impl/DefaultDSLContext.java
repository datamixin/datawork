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

import static com.andia.mixin.jepara.impl.DSL.name;

import com.andia.mixin.jepara.Configuration;
import com.andia.mixin.jepara.CreateIndex;
import com.andia.mixin.jepara.CreateTable;
import com.andia.mixin.jepara.DSLContext;
import com.andia.mixin.jepara.DeleteFrom;
import com.andia.mixin.jepara.InsertInto;
import com.andia.mixin.jepara.Select;
import com.andia.mixin.jepara.SelectColumn;
import com.andia.mixin.jepara.Update;

public class DefaultDSLContext implements DSLContext {

	private Configuration configuration;

	public DefaultDSLContext(Configuration configuration) {
		this.configuration = configuration;
	}

	@Override
	public CreateTable createTable(String table) {
		return new CreateTableImpl(configuration, name(table));
	}

	@Override
	public CreateIndex createIndex(String name) {
		return new CreateIndexImpl(configuration, name(name));
	}

	@Override
	public Select select(SelectColumn... columns) {
		return new SelectImpl(configuration, columns);
	}

	@Override
	public InsertInto insertInto(String table) {
		return new InsertIntoImpl(configuration, name(table));
	}

	@Override
	public Update update(String table) {
		return new UpdateImpl(configuration, name(table));
	}

	@Override
	public DeleteFrom deleteFrom(String table) {
		return new DeleteFromImpl(configuration, name(table));
	}

}
