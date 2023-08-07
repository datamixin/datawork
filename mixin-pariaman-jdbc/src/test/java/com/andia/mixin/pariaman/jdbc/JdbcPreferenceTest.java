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

import static org.junit.Assert.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.sql.SQLException;

import javax.sql.DataSource;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import com.andia.mixin.pariaman.PreferenceException;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class JdbcPreferenceTest {

	private static JdbcPreference preference;
	private static String userSpace = "user_space";
	private static String prefKey = "pref_key";
	private static String prefValue = "pref_value";

	@BeforeAll
	public static void beforeAll() throws SQLException {
		MockJdbcDatabase database = new MockJdbcDatabase(JdbcPreferenceTest.class);
		DataSource dataSource = database.getDataSource();
		preference = new JdbcPreference();
		preference.setDataSource(dataSource);
	}

	@Test
	@Order(00)
	public void testFailInit() {
		assertThrows(IllegalArgumentException.class, () -> {
			JdbcPreference repository = new JdbcPreference();
			repository.setDataSource(null);
		});
	}

	@Test
	@Order(10)
	public void testSetValue() throws PreferenceException {
		preference.setSetting(userSpace, prefKey, prefValue);
	}

	@Test
	@Order(20)
	public void testGetValue() throws PreferenceException {
		String stored = preference.getSetting(userSpace, prefKey);
		assertEquals(stored, prefValue);
	}

}
