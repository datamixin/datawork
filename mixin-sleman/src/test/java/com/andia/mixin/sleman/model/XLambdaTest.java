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

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.andia.mixin.model.EList;

public class XLambdaTest {

	@Test
	public void testLambda() {

		XIdentifier x = XTestUtil.createIdentifier("x");
		XIdentifier y = XTestUtil.createIdentifier("y");

		List<XIdentifier> identifiers = Arrays.asList(x, y);
		XText text = XTestUtil.createText("name");

		XLambda lambda = new XLambda();
		EList<XIdentifier> parameters = lambda.getParameters();
		parameters.addAll(identifiers);
		lambda.setExpression(text);
		assertEquals(text, lambda.getExpression());

		String literal = "(x, y) -> 'name'";
		assertEquals(literal, lambda.toLiteral());
		assertEquals(literal, lambda.toString());

	}
}
