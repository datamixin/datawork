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

import com.andia.mixin.padang.garut.EvaluateConditional;
import com.andia.mixin.padang.garut.EvaluateExpression;
import com.andia.mixin.padang.garut.EvaluateConditional.Builder;
import com.andia.mixin.sleman.model.XConditional;
import com.andia.mixin.sleman.model.XExpression;

public class ConditionalAdapter extends BaseAdapter {

	@Override
	public EvaluateExpression toExpression(Object object) {

		XConditional conditional = (XConditional) object;
		Builder conditionalBuilder = EvaluateConditional.newBuilder();
		ExpressionAdapterRegistry registry = ExpressionAdapterRegistry.getInstance();

		XExpression logical = conditional.getLogical();
		EvaluateExpression logicalExpression = registry.toExpression(logical);
		conditionalBuilder.setLogical(logicalExpression);

		XExpression consequent = conditional.getConsequent();
		EvaluateExpression consequentExpression = registry.toExpression(consequent);
		conditionalBuilder.setConsequent(consequentExpression);

		XExpression alternate = conditional.getAlternate();
		EvaluateExpression alternateExpression = registry.toExpression(alternate);
		conditionalBuilder.setAlternate(alternateExpression);

		EvaluateConditional evaluateConditional = conditionalBuilder.build();
		EvaluateExpression.Builder expressionBuilder = EvaluateExpression.newBuilder();
		expressionBuilder.setConditional(evaluateConditional);
		return expressionBuilder.build();

	}

}
