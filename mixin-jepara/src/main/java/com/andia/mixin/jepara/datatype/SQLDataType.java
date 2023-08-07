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
package com.andia.mixin.jepara.datatype;

public class SQLDataType {

	public static final UUIDDataType UUID = new UUIDDataType();

	public static final TinyIntDataType TINYINT = new TinyIntDataType();

	public static final IntDataType INT = new IntDataType();

	public static final LongDataType LONG = new LongDataType();

	public static final CharDataType CHAR = new CharDataType();

	public static final VarcharDataType VARCHAR = new VarcharDataType();

	public static final VarcharDataType VARCHAR(int length) {
		return new VarcharDataType().length(length);
	}

	public static final TimestampDataType TIMESTAMP = new TimestampDataType();

	public static final ClobDataType CLOB = new ClobDataType();

	public static final BlobDataType BLOB = new BlobDataType();

	public static final BinaryDataType BINARY = new BinaryDataType();

}
