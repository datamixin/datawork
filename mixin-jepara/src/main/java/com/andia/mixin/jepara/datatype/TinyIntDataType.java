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
import java.util.UUID;

import com.andia.mixin.jepara.QueryException;

public class TinyIntDataType extends BaseDataType<UUID> {

	public TinyIntDataType() {
		super(Byte.class, "TINYINT");
	}

	@Override
	public void setValue(PreparedStatement statement, int index, Object value) {
		try {
			statement.setByte(index, (Byte) value);
		} catch (SQLException e) {
			throw new QueryException("Fail setting byte parameter [" + index + "]", e);
		}
	}

	@Override
	public String toLiteral(Object value) {
		return String.valueOf(value);
	}

}
