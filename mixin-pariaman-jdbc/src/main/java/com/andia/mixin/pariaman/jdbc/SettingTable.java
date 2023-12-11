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
package com.andia.mixin.pariaman.jdbc;

import static com.andia.mixin.jepara.impl.DSL.column;
import static com.andia.mixin.jepara.impl.DSL.field;
import static com.andia.mixin.jepara.impl.DSL.param;
import static com.andia.mixin.jepara.impl.DSL.primaryKey;
import static com.andia.mixin.pariaman.jdbc.SettingRecord.PREF_KEY;
import static com.andia.mixin.pariaman.jdbc.SettingRecord.SETTING;
import static com.andia.mixin.pariaman.jdbc.SettingRecord.USER_SPACE;
import static com.andia.mixin.pariaman.jdbc.SettingRecord.PREF_VALUE;

import java.sql.Clob;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.rowset.serial.SerialClob;
import javax.sql.rowset.serial.SerialException;

import com.andia.mixin.jepara.DSLContext;
import com.andia.mixin.jepara.PreparedQuery;
import com.andia.mixin.jepara.Query;
import com.andia.mixin.jepara.QueryException;
import com.andia.mixin.jepara.QueryField;
import com.andia.mixin.jepara.SQLDialect;
import com.andia.mixin.jepara.Settings;
import com.andia.mixin.jepara.datatype.SQLDataType;
import com.andia.mixin.jepara.impl.DSL;
import com.andia.mixin.pariaman.PreferenceException;

public class SettingTable {

	private DSLContext context;

	private PreparedQuery insertRecord;
	private PreparedQuery updateValue;
	private PreparedQuery selectValue;

	public SettingTable(Connection connection) {

		// DSL Context
		prepareContext(connection);

		// Table and Index
		// Table and Index
		if (!isTableExists(connection)) {
			prepareTable();
		}

		// Prepared statements
		prepareInsertRecord();
		prepareSelectValue();
		prepareUpdateValue();
		prepareSelectValue();
	}

	// ========================================================================
	// PRIVATE METHOD
	// ========================================================================

	private void prepareContext(Connection connection) {
		Settings settings = new Settings();
		context = DSL.using(connection, SQLDialect.SQL92, settings);
	}

	private boolean isTableExists(Connection connection) {
		try {
			DatabaseMetaData dbmeta = connection.getMetaData();
			ResultSet resultSet = dbmeta.getTables(null, null, SETTING.toUpperCase(), null);
			while (resultSet.next()) {
				return true;
			}
			return false;
		} catch (SQLException e) {
			throw new QueryException("Fail check table exists");
		}
	}

	private void prepareTable() {
		Query query = context
				.createTable(SETTING)
				.column(USER_SPACE, SQLDataType.VARCHAR(32))
				.column(PREF_KEY, SQLDataType.VARCHAR(32))
				.column(PREF_VALUE, SQLDataType.CLOB)
				.constraints(primaryKey(USER_SPACE, PREF_KEY));
		query.execute();
	}

	private void prepareInsertRecord() {
		insertRecord = context
				.insertInto(SETTING)
				.columns(USER_SPACE, PREF_KEY, PREF_VALUE)
				.values(
						param(USER_SPACE, SQLDataType.VARCHAR),
						param(PREF_KEY, SQLDataType.VARCHAR),
						param(PREF_VALUE, SQLDataType.CLOB))
				.prepare();
	}

	private QueryField spaceKey() {
		return field(USER_SPACE).equal(param(USER_SPACE, SQLDataType.VARCHAR))
				.and(field(PREF_KEY).equal(param(PREF_KEY, SQLDataType.VARCHAR)));
	}

	private void prepareSelectValue() {
		selectValue = context
				.select(column(PREF_VALUE))
				.from(SETTING)
				.where(spaceKey())
				.prepare();
	}

	private void prepareUpdateValue() {
		updateValue = context
				.update(SETTING)
				.set(PREF_VALUE, param(PREF_VALUE, SQLDataType.CLOB))
				.where(spaceKey())
				.prepare();
	}

	// ========================================================================
	// PUBLIC METHOD
	// ========================================================================

	public boolean insertRecord(String space, String key, String value) throws PreferenceException {
		try {
			return insertRecord
					.bind(USER_SPACE, space)
					.bind(PREF_KEY, key)
					.bind(PREF_VALUE, asClob(value))
					.executeUpdate() == 1;
		} catch (Exception e) {
			throw new PreferenceException("Fail insert value " + space + ":" + key, e);
		}
	}

	public String selectValue(String space, String key) throws PreferenceException {
		try {

			// Ambil content dalam bentuk clob
			Clob clob = selectValue
					.bind(USER_SPACE, space)
					.bind(PREF_KEY, key)
					.fetchOne(Clob.class);

			if (clob == null) {
				return null;
			}

			// Convert clob menjadi string
			long length = clob.length();
			return clob.getSubString(1L, (int) length);

		} catch (Exception e) {
			throw new PreferenceException("Fail select value " + space + ":" + key, e);
		}
	}

	public boolean updateValue(String space, String key, String value) throws PreferenceException {
		try {
			return updateValue.bind(USER_SPACE, space)
					.bind(PREF_KEY, key)
					.bind(PREF_VALUE, asClob(value))
					.executeUpdate() == 1;
		} catch (Exception e) {
			throw new PreferenceException("Fail update value " + space + ":" + key, e);
		}
	}

	private Clob asClob(String value) throws SerialException, SQLException {
		if (value != null) {
			char[] array = value.toCharArray();
			return new SerialClob(array);
		}
		return null;
	}
}
