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

import java.sql.Connection;

import com.andia.mixin.jepara.Configuration;
import com.andia.mixin.jepara.Constraint;
import com.andia.mixin.jepara.DSLContext;
import com.andia.mixin.jepara.DataType;
import com.andia.mixin.jepara.Name;
import com.andia.mixin.jepara.QueryField;
import com.andia.mixin.jepara.QueryParam;
import com.andia.mixin.jepara.QueryValue;
import com.andia.mixin.jepara.SQLDialect;
import com.andia.mixin.jepara.SelectColumn;
import com.andia.mixin.jepara.Settings;
import com.andia.mixin.jepara.datatype.SQLDataType;

public class DSL {

	public static DSLContext using(Connection connection, SQLDialect dialect, Settings settings) {
		Configuration configuration = new DefaultConfiguration(connection, dialect, settings);
		return new DefaultDSLContext(configuration);
	}

	public static Name nullName() {
		return new NameImpl("NULL");
	}

	public static Name name(String name) {
		return new NameImpl(name);
	}

	public static Name[] names(String... strings) {
		Name[] names = new Name[strings.length];
		for (int i = 0; i < strings.length; i++) {
			names[i] = name(strings[i]);
		}
		return names;
	}

	public static Constraint primaryKey(String... names) {
		return new PrimaryKeyConstraint(names(names));
	}

	public static SelectColumn column(String name) {
		return new SelectColumnImpl(name);
	}

	public static QueryField field(String column) {
		return new QueryFieldImpl(name(column));
	}

	public static QueryField field(String table, String column) {
		return new QueryFieldImpl(name(table), name(column));
	}

	public static QueryValue value(Object value) {
		return new QueryValueImpl(value, SQLDataType.VARCHAR);
	}

	public static QueryValue valueNull(DataType<?> type) {
		return new QueryValueImpl(null, type);
	}

	public static QueryValue value(Object value, DataType<?> type) {
		return new QueryValueImpl(value, type);
	}

	public static QueryParam param(String name) {
		return new QueryParamImpl(name, SQLDataType.VARCHAR);
	}

	public static QueryParam param(String name, DataType<?> type) {
		return new QueryParamImpl(name, type);
	}

}
