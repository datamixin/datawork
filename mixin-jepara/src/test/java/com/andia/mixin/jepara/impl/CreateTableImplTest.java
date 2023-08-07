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

import static com.andia.mixin.jepara.impl.DSL.name;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

import org.junit.jupiter.api.Test;

import com.andia.mixin.jepara.Configuration;
import com.andia.mixin.jepara.datatype.SQLDataType;

public class CreateTableImplTest {

	@Test
	public void test() {
		Configuration configuration = mock(Configuration.class);
		String literal = new CreateTableImpl(configuration, name("table"))
				.column("name", SQLDataType.VARCHAR)
				.column("age", SQLDataType.INT)
				.getLiteral();
		assertEquals("CREATE TABLE IF NOT EXISTS table (name VARCHAR, age INT)", literal);
	}
}
