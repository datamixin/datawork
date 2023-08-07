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

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.sql.Clob;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;

import javax.sql.rowset.serial.SerialClob;

import com.andia.mixin.jepara.Column;
import com.andia.mixin.jepara.QueryException;
import com.andia.mixin.jepara.Record;

public class RecordReader<R> {

	private Class<? extends R> resultClass;

	public RecordReader(Class<? extends R> resultClass) {
		this.resultClass = resultClass;
	}

	@SuppressWarnings("unchecked")
	public R read(ResultSet resultSet) {
		try {
			if (Record.class.isAssignableFrom(resultClass)) {

				// Buat record baru
				R record = resultClass.newInstance();

				// Ambil metadata untuk membaca semua column dari record set
				ResultSetMetaData metaData = resultSet.getMetaData();
				int columnCount = metaData.getColumnCount();
				for (int i = 1; i <= columnCount; i++) {

					// Cari field dengan sesuai nama result column
					String columnName = metaData.getColumnName(i);
					Field columnField = null;
					for (Field field : resultClass.getDeclaredFields()) {

						// Static field tidak di sertakan
						String fieldName = field.getName();
						int modifiers = field.getModifiers();
						if (Modifier.isStatic(modifiers)) {
							continue;
						}

						// Ambil field jika nama field sesuai
						if (fieldName.equalsIgnoreCase(columnName)) {
							columnField = field;
							break;
						} else {
							if (field.isAnnotationPresent(Column.class)) {
								Column recordField = field.getAnnotation(Column.class);
								if (columnName.equalsIgnoreCase(recordField.name())) {
									columnField = field;
									break;
								}
							}
						}
					}

					// Setting value record field dari result set jika field ditemukan
					if (columnField != null) {
						Object object = resultSet.getObject(i);
						columnField.setAccessible(true);
						columnField.set(record, object);
					}
				}
				return record;

			} else {

				// Result class yang diberikan hanya dari column pertama-saja
				Object object = resultSet.getObject(1);
				if (object instanceof Clob) {
					Clob clob = (Clob) object;
					long length = clob.length();
					String string = clob.getSubString(1, (int) length);
					SerialClob serialClob = new SerialClob(clob);
					serialClob.setString(1, string);
					object = serialClob;
				}
				return (R) object;
			}
		} catch (Exception e) {
			throw new QueryException("Fail read result set record", e);
		}
	}

}
