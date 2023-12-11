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

public class XLetTest {

	@Test
	public void testLet() {

		XReference object = XTestUtil.createReference("object");
		XReference internal = XTestUtil.createReference("x");

		XUnary unary = new XUnary();
		unary.setOperator("!");
		unary.setArgument(XTestUtil.createReference("x"));

		XAssignment x = XTestUtil.createAssignment("x", object);
		XAssignment y = XTestUtil.createAssignment("y", internal);
		XAssignment z = XTestUtil.createAssignment("z", unary);
		XReference output = XTestUtil.createReference("z");

		XLet let = new XLet();
		EList<XAssignment> assignments = let.getVariables();
		assignments.add(x);
		assignments.add(y);
		assignments.add(z);
		let.setResult(output);

		assertEquals(output, let.getResult());

		String literal = "let x = object, y = x, z = !x in z";
		assertEquals(literal, let.toLiteral());
		assertEquals(literal, let.toString());

	}
}
