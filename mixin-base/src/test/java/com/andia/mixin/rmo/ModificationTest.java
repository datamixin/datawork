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
package com.andia.mixin.rmo;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class ModificationTest {

	private static int type = 0;
	private static String oldValue = "oldValue";
	private static String newValue = "newValue";
	private static FeaturePath path = new FeaturePath();
	private static Modification modification = new Modification(path, type, oldValue, newValue);

	@Test
	public void testGetPath() {
		assertEquals(path, modification.getPath());
	}

	@Test
	public void testGetType() {
		assertEquals(type, modification.getType());
	}

	@Test
	public void testGetOldValue() {
		assertEquals(oldValue, modification.getOldValue());
	}

	@Test
	public void testGetNewValue() {
		assertEquals(newValue, modification.getNewValue());
	}

	@Test
	public void testToString() {
		assertEquals("Modification{path='', type=0, oldValue=oldValue, newValue=newValue}", modification.toString());
	}
}
