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
import java.sql.SQLException;
import java.sql.Statement;

import com.andia.mixin.jepara.Configuration;
import com.andia.mixin.jepara.Query;
import com.andia.mixin.jepara.QueryException;

public abstract class QueryImpl implements Query {

	protected final static String BLANK = " ";

	protected Configuration configuration;

	public QueryImpl(Configuration configuration) {
		this.configuration = configuration;
	}

	protected Connection getConnection() {
		Connection connection = configuration.getConnection();
		return connection;
	}

	@Override
	public int execute() {
		String literal = getLiteral();
		Connection connection = getConnection();
		try (Statement statement = connection.createStatement()) {
			return statement.executeUpdate(literal);
		} catch (SQLException e) {
			throw new QueryException("Fail execute " + literal, e);
		}
	}

	public LiteralBuilder newBuilder() {
		return new LiteralBuilder();
	}

	public LiteralBuilder newBuilder(String initial) {
		return newBuilder().add(initial);
	}
}
