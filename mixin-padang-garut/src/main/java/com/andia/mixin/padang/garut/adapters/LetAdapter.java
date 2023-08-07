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
package com.andia.mixin.padang.garut.adapters;

import com.andia.mixin.model.EList;
import com.andia.mixin.padang.garut.EvaluateAssignment;
import com.andia.mixin.padang.garut.EvaluateExpression;
import com.andia.mixin.padang.garut.EvaluateIdentifier;
import com.andia.mixin.padang.garut.EvaluateLet;
import com.andia.mixin.padang.garut.EvaluateLet.Builder;
import com.andia.mixin.sleman.model.XAssignment;
import com.andia.mixin.sleman.model.XExpression;
import com.andia.mixin.sleman.model.XIdentifier;
import com.andia.mixin.sleman.model.XLet;

public class LetAdapter extends BaseAdapter {

	@Override
	public EvaluateExpression toExpression(Object object) {

		XLet let = (XLet) object;
		Builder letBuilder = EvaluateLet.newBuilder();
		ExpressionAdapterRegistry registry = ExpressionAdapterRegistry.getInstance();

		EList<XAssignment> variables = let.getVariables();
		for (XAssignment variable : variables) {

			EvaluateAssignment.Builder assignmentBuilder = EvaluateAssignment.newBuilder();

			XIdentifier nameIdentifier = variable.getName();
			EvaluateIdentifier identifier = createIdentifier(nameIdentifier);
			assignmentBuilder.setName(identifier);

			XExpression expression = variable.getExpression();
			EvaluateExpression expressionExpression = registry.toExpression(expression);
			assignmentBuilder.setExpression(expressionExpression);

			EvaluateAssignment assignment = assignmentBuilder.build();
			letBuilder.addVariable(assignment);
		}

		XExpression result = let.getResult();
		EvaluateExpression expressionExpression = registry.toExpression(result);
		letBuilder.setResult(expressionExpression);

		EvaluateLet evaluateLet = letBuilder.build();
		EvaluateExpression.Builder expressionBuilder = EvaluateExpression.newBuilder();
		expressionBuilder.setLet(evaluateLet);
		return expressionBuilder.build();

	}

}
