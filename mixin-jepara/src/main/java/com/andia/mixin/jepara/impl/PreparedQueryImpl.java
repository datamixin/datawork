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

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.andia.mixin.jepara.DataType;
import com.andia.mixin.jepara.PreparedQuery;
import com.andia.mixin.jepara.QueryException;

public class PreparedQueryImpl implements PreparedQuery {

	private PreparedStatement statement;
	private Map<String, DataTypeMapping> mappings;

	public PreparedQueryImpl(PreparedStatement statement, Map<String, DataTypeMapping> mappings) {
		this.statement = statement;
		this.mappings = mappings;
	}

	@Override
	public PreparedQuery bind(String param, Object value) {
		if (mappings.containsKey(param)) {
			DataTypeMapping mapping = mappings.get(param);
			int index = mapping.getIndex();
			DataType<?> type = mapping.getType();
			type.setValue(statement, index, value);
			return this;
		} else {
			throw new QueryException("Missing param named [" + param + "], availables " + mappings.keySet());
		}
	}

	@Override
	public int executeUpdate() {
		try {
			int update = statement.executeUpdate();
			return update;
		} catch (SQLException e) {
			throw new QueryException("Fail execute prepared statement", e);
		}
	}

	@Override
	public synchronized <R> R fetchOne(Class<? extends R> resultClass) {
		try (ResultSet resultSet = statement.executeQuery()) {
			while (resultSet.next()) {
				RecordReader<R> reader = new RecordReader<>(resultClass);
				R record = reader.read(resultSet);
				return record;
			}
			return null;
		} catch (SQLException e) {
			throw new QueryException("Fail fetch one result", e);
		}
	}

	@Override
	public synchronized <R> Collection<R> fetch(Class<? extends R> resultClass) {
		try (ResultSet resultSet = statement.executeQuery()) {
			List<R> records = new ArrayList<>();
			while (resultSet.next()) {
				RecordReader<R> reader = new RecordReader<>(resultClass);
				R record = reader.read(resultSet);
				records.add(record);
			}
			return records;
		} catch (Exception e) {
			throw new QueryException("Fail fetch one result", e);
		}
	}

}
