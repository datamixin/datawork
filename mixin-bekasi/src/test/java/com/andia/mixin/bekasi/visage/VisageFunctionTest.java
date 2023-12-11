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

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.andia.mixin.value.MixinFunction;
import com.andia.mixin.value.MixinFunction.Type;

public class VisageFunctionTest {

	@Test
	public void test() {
		String literal = "(x) -> x";
		VisageFunction function = new VisageFunction();
		MixinFunction valueFunction = Mockito.mock(MixinFunction.class);
		Mockito.when(valueFunction.getType()).thenReturn(Type.LAMBDA);
		Mockito.when(valueFunction.getLiteral()).thenReturn(literal);
		function.init(valueFunction);
		assertEquals(Type.LAMBDA, function.getType());
		assertEquals(literal, function.getLiteral());
		assertEquals("VisageFunction(" + Type.LAMBDA + ": " + literal + ")", function.toString());
	}
}
