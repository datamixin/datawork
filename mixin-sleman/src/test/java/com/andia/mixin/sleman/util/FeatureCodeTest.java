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
package com.andia.mixin.sleman.util;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import com.andia.mixin.model.EList;
import com.andia.mixin.sleman.model.SlemanFactory;
import com.andia.mixin.sleman.model.XAssignment;
import com.andia.mixin.sleman.model.XExpression;
import com.andia.mixin.sleman.model.XForeach;
import com.andia.mixin.sleman.model.XIdentifier;
import com.andia.mixin.sleman.model.XLet;
import com.andia.mixin.sleman.model.XList;
import com.andia.mixin.sleman.model.XNumber;
import com.andia.mixin.sleman.model.XReference;

public class FeatureCodeTest {

	static SlemanFactory factory = SlemanFactory.eINSTANCE;

	@Test
	public void testGenerateLet() {

		XLet let = factory.createXLet();
		EList<XAssignment> variables = let.getVariables();

		XAssignment assignment = factory.createXAssignment();
		variables.add(assignment);

		XNumber number = factory.createXNumber();
		number.setValue(10);
		assignment.setExpression(number);

		XIdentifier identifier = factory.createXIdentifier();
		identifier.setName("x");
		assignment.setName(identifier);

		XReference reference = factory.createXReference();
		reference.setName("x");
		let.setResult(reference);

		FeatureCode code = new FeatureCode(number);
		assertEquals("1101", code.generate());

	}

	@Test
	public void generateForeach() {

		XList list = factory.createXList();
		EList<XExpression> elements = list.getElements();

		XForeach foreach = factory.createXForeach();
		XNumber number = factory.createXNumber();
		number.setValue(10);
		foreach.setExpression(number);
		elements.add(foreach);

		XExpression expression = foreach.getExpression();
		FeatureCode code = new FeatureCode(expression);
		assertEquals("1101", code.generate());
	}

}
