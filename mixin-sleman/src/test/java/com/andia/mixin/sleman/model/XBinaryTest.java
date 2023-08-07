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
package com.andia.mixin.sleman.model;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class XBinaryTest {

	@Test
	public void testBinary() {

		XReference left = XTestUtil.createReference("left");
		String operator = "+";
		XReference right = XTestUtil.createReference("right");

		XBinary binary = new XBinary();
		binary.setLeft(left);
		binary.setOperator(operator);
		binary.setRight(right);

		assertEquals(left, binary.getLeft());
		assertEquals(operator, binary.getOperator());
		assertEquals(right, binary.getRight());

		String literal = "left + right";
		assertEquals(literal, binary.toLiteral());
		assertEquals(literal, binary.toString());

	}
}
