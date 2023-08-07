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
package com.andia.mixin.pariaman.jdbc;

import java.sql.Connection;
import java.sql.SQLException;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;
import javax.sql.DataSource;

import com.andia.mixin.pariaman.Preference;
import com.andia.mixin.pariaman.PreferenceException;

@ApplicationScoped
public class JdbcPreference implements Preference {

	private SettingTable table;

	@Inject
	public void setDataSource(@Named("preference") DataSource dataSource) throws SQLException {
		if (dataSource == null) {
			throw new IllegalArgumentException("The data source must not be null");
		}
		prepareTable(dataSource);
	}

	private void prepareTable(DataSource dataSource) throws SQLException {
		Connection connection = dataSource.getConnection();
		table = new SettingTable(connection);
	}

	@Override
	public synchronized void setSetting(String space, String key, String value) throws PreferenceException {
		if (table.selectValue(space, key) == null) {
			table.insertRecord(space, key, value);
		} else {
			table.updateValue(space, key, value);
		}
	}

	@Override
	public String getSetting(String space, String key) throws PreferenceException {
		return table.selectValue(space, key);
	}

}
