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
package com.andia.mixin.jepara.datatype;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;

import com.andia.mixin.jepara.QueryException;

public class TimestampDataType extends BaseDataType<Timestamp> {

	public TimestampDataType() {
		super(Timestamp.class, "TIMESTAMP");
	}

	@Override
	public void setValue(PreparedStatement statement, int index, Object value) {
		try {
			if (value instanceof Long) {
				value = new Timestamp((Long) value);
			}
			statement.setTimestamp(index, (Timestamp) value);
		} catch (SQLException e) {
			throw new QueryException("Fail setting timestamp parameter [" + index + "]", e);
		}
	}

	@Override
	public String toLiteral(Object value) {
		throw new UnsupportedOperationException("Cannot create literal for TIMESTAMP data type");
	}

}
