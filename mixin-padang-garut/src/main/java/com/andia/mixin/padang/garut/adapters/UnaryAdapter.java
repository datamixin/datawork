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

import com.andia.mixin.padang.garut.EvaluateUnary;
import com.andia.mixin.padang.garut.EvaluateExpression;
import com.andia.mixin.padang.garut.EvaluateUnary.Builder;
import com.andia.mixin.sleman.model.XUnary;
import com.andia.mixin.sleman.model.XExpression;

public class UnaryAdapter extends BaseAdapter {

	@Override
	public EvaluateExpression toExpression(Object object) {

		XUnary unary = (XUnary) object;
		Builder unaryBuilder = EvaluateUnary.newBuilder();
		ExpressionAdapterRegistry registry = ExpressionAdapterRegistry.getInstance();

		XExpression argument = unary.getArgument();
		EvaluateExpression argumentExpression = registry.toExpression(argument);
		unaryBuilder.setArgument(argumentExpression);

		String operator = unary.getOperator();
		unaryBuilder.setOperator(operator);

		EvaluateUnary evaluateUnary = unaryBuilder.build();
		EvaluateExpression.Builder expressionBuilder = EvaluateExpression.newBuilder();
		expressionBuilder.setUnary(evaluateUnary);
		return expressionBuilder.build();

	}

}
