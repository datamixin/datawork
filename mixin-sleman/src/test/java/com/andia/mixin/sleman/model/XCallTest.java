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

import com.andia.mixin.model.EList;
import com.andia.mixin.sleman.api.SPointer;

public class XCallTest {

	@Test
	public void testCall() {

		XReference function = XTestUtil.createReference("function");
		XReference x = XTestUtil.createReference("x");
		XReference y = XTestUtil.createReference("y");

		XCall call = new XCall();
		call.setCallee(function);
		EList<XArgument> arguments = call.getArguments();
		arguments.add(XTestUtil.createArgument(x));
		arguments.add(XTestUtil.createArgument(y));

		SPointer callee = call.getCallee();
		assertEquals(function, callee);

		String literal = "function(x, y)";
		assertEquals(literal, call.toLiteral());
		assertEquals(literal, call.toString());

	}
}
