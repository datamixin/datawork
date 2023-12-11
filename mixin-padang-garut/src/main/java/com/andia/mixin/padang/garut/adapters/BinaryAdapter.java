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
package com.andia.mixin.padang.garut.adapters;

import com.andia.mixin.padang.garut.EvaluateBinary;
import com.andia.mixin.padang.garut.EvaluateBinary.Builder;
import com.andia.mixin.padang.garut.EvaluateExpression;
import com.andia.mixin.sleman.model.XBinary;
import com.andia.mixin.sleman.model.XExpression;

public class BinaryAdapter extends BaseAdapter {

	@Override
	public EvaluateExpression toExpression(Object object) {

		XBinary binary = (XBinary) object;
		Builder binaryBuilder = EvaluateBinary.newBuilder();
		ExpressionAdapterRegistry registry = ExpressionAdapterRegistry.getInstance();

		XExpression left = binary.getLeft();
		EvaluateExpression leftExpression = registry.toExpression(left);
		binaryBuilder.setLeft(leftExpression);

		XExpression right = binary.getRight();
		EvaluateExpression rightExpression = registry.toExpression(right);
		binaryBuilder.setRight(rightExpression);

		String operator = binary.getOperator();
		binaryBuilder.setOperator(operator);

		EvaluateBinary evaluateBinary = binaryBuilder.build();
		EvaluateExpression.Builder expressionBuilder = EvaluateExpression.newBuilder();
		expressionBuilder.setBinary(evaluateBinary);
		return expressionBuilder.build();

	}

}
