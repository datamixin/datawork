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
package com.andia.mixin.sleman.model;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import com.andia.mixin.model.EList;

public class XListTest {

	@Test
	public void testList() {

		XList list = new XList();
		EList<XExpression> elements = list.getElements();
		elements.add(XTestUtil.createNumber(0));
		elements.add(XTestUtil.createNumber(1));

		String literal = "[0, 1]";
		assertEquals(literal, list.toLiteral());
		assertEquals(literal, list.toString());

	}

}
