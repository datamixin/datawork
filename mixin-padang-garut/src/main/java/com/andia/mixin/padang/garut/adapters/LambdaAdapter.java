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
import com.andia.mixin.padang.garut.EvaluateExpression;
import com.andia.mixin.padang.garut.EvaluateIdentifier;
import com.andia.mixin.padang.garut.EvaluateLambda;
import com.andia.mixin.padang.garut.EvaluateLambda.Builder;
import com.andia.mixin.sleman.model.XExpression;
import com.andia.mixin.sleman.model.XIdentifier;
import com.andia.mixin.sleman.model.XLambda;

public class LambdaAdapter extends BaseAdapter {

	@Override
	public EvaluateExpression toExpression(Object object) {

		XLambda lambda = (XLambda) object;
		Builder lambdaBuilder = EvaluateLambda.newBuilder();
		ExpressionAdapterRegistry registry = ExpressionAdapterRegistry.getInstance();

		EList<XIdentifier> parameters = lambda.getParameters();
		for (XIdentifier parameter : parameters) {
			EvaluateIdentifier evaluateIdentifier = createIdentifier(parameter);
			lambdaBuilder.addParameter(evaluateIdentifier);
		}

		XExpression expression = lambda.getExpression();
		EvaluateExpression expressionExpression = registry.toExpression(expression);
		lambdaBuilder.setExpression(expressionExpression);

		EvaluateLambda evaluateLambda = lambdaBuilder.build();
		EvaluateExpression.Builder expressionBuilder = EvaluateExpression.newBuilder();
		expressionBuilder.setLambda(evaluateLambda);
		return expressionBuilder.build();

	}

}
