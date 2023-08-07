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

import com.andia.mixin.padang.garut.EvaluateForeach;
import com.andia.mixin.padang.garut.EvaluateExpression;
import com.andia.mixin.padang.garut.EvaluateForeach.Builder;
import com.andia.mixin.sleman.model.XForeach;
import com.andia.mixin.sleman.model.XExpression;

public class ForeachAdapter extends BaseAdapter {

	@Override
	public EvaluateExpression toExpression(Object object) {

		XForeach foreach = (XForeach) object;
		Builder foreachBuilder = EvaluateForeach.newBuilder();
		ExpressionAdapterRegistry registry = ExpressionAdapterRegistry.getInstance();

		XExpression expression = foreach.getExpression();
		EvaluateExpression expressionExpression = registry.toExpression(expression);
		foreachBuilder.setExpression(expressionExpression);

		EvaluateForeach evaluateForeach = foreachBuilder.build();
		EvaluateExpression.Builder expressionBuilder = EvaluateExpression.newBuilder();
		expressionBuilder.setForeach(evaluateForeach);
		return expressionBuilder.build();

	}

}
