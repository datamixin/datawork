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
import com.andia.mixin.jepara.impl.LiteralBuilder;

public class VarcharDataType extends BaseDataType<UUID> {

	private int length = 0;

	public VarcharDataType() {
		super(String.class, "VARCHAR");
	}

	public VarcharDataType length(int length) {
		this.length = length;
		return this;
	}

	@Override
	public void setValue(PreparedStatement statement, int index, Object value) {
		try {
			statement.setString(index, (String) value);
		} catch (SQLException e) {
			throw new QueryException("Fail setting varchar parameter [" + index + "]", e);
		}
	}

	@Override
	public String toLiteral(Object value) {
		return "'" + String.valueOf(value) + "'";
	}

	@Override
	public String getLiteral() {
		LiteralBuilder buffer = new LiteralBuilder();
		buffer.add(typeName);
		if (length > 0) {
			buffer.open();
			buffer.add(length);
			buffer.close();
		}
		return buffer.build();
	}

}
