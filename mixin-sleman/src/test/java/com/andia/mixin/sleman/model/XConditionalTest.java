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

public class XConditionalTest {

	@Test
	public void testConditional() {

		XReference logical = XTestUtil.createReference("logical");
		XReference consequent = XTestUtil.createReference("consequent");
		XReference alternate = XTestUtil.createReference("alternate");

		XConditional conditional = new XConditional();
		conditional.setLogical(logical);
		conditional.setConsequent(consequent);
		conditional.setAlternate(alternate);

		assertEquals(logical, conditional.getLogical());
		assertEquals(consequent, conditional.getConsequent());
		assertEquals(alternate, conditional.getAlternate());

		String literal = "if logical then consequent else alternate";
		assertEquals(literal, conditional.toLiteral());
		assertEquals(literal, conditional.toString());

	}

}
