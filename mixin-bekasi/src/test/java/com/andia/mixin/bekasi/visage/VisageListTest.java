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
package com.andia.mixin.bekasi.visage;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Iterator;

import org.junit.jupiter.api.Test;

import com.andia.mixin.Lean;

public class VisageListTest {

	@Test
	public void test() {

		VisageList list = new VisageList();
		VisageText text = new VisageText();
		text.init("line");

		list.add(text);
		assertEquals(1, list.size());
		assertEquals(text, list.get(0));
		assertEquals("VisageList([" + text.toString() + "])", list.toString());

		list.clear();
		assertEquals(0, list.size());

		Iterator<Lean> iterator = list.iterator();
		assertEquals(false, iterator.hasNext());
	}
}
