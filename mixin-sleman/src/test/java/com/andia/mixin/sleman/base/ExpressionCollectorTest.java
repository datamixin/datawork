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
package com.andia.mixin.sleman.base;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import com.andia.mixin.sleman.ParserException;
import com.andia.mixin.sleman.api.SAlias;
import com.andia.mixin.sleman.api.SBinary;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.sleman.api.SLambda;
import com.andia.mixin.sleman.api.SLet;
import com.andia.mixin.sleman.api.SList;
import com.andia.mixin.sleman.api.SLogical;
import com.andia.mixin.sleman.api.SMember;
import com.andia.mixin.sleman.api.SNumber;
import com.andia.mixin.sleman.api.SObject;
import com.andia.mixin.sleman.api.SPointer;
import com.andia.mixin.sleman.api.SReference;
import com.andia.mixin.sleman.api.SText;
import com.andia.mixin.sleman.api.SUnary;

public class ExpressionCollectorTest {

	@Test
	public void testCollect() throws ParserException {
		String literal = "let a=1,"
				+ "b=['Test'],"
				+ "c={age:false},"
				+ "d=() -> c,"
				+ "e=foreach $m,"
				+ "f=b+x.y.z,"
				+ "e=-n "
				+ "in d";
		ExpressionParser parser = new ExpressionParser(literal);
		SExpression expression = parser.getExpression();
		ExpressionCollector collector = ExpressionCollector.getInstance();

		assertEquals(1, collector.collect(SLet.class, expression).size());
		assertEquals(1, collector.collect(SList.class, expression).size());
		assertEquals(1, collector.collect(SObject.class, expression).size());
		assertEquals(1, collector.collect(SLambda.class, expression).size());
		assertEquals(1, collector.collect(SBinary.class, expression).size());
		assertEquals(1, collector.collect(SUnary.class, expression).size());
		assertEquals(1, collector.collect(SAlias.class, expression).size());
		assertEquals(1, collector.collect(SText.class, expression).size());
		assertEquals(1, collector.collect(SLogical.class, expression).size());
		assertEquals(1, collector.collect(SNumber.class, expression).size());

		// x.y.z, x.y
		assertEquals(2, collector.collect(SMember.class, expression).size());

		// x, n
		assertEquals(2, collector.collect(SReference.class, expression).size());

		// $m, x.y.z, x.y, x, n
		assertEquals(5, collector.collect(SPointer.class, expression).size());
	}

}
