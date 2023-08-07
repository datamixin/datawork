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

import com.andia.mixin.padang.garut.EvaluateExpression;
import com.andia.mixin.padang.garut.EvaluateLogical;
import com.andia.mixin.padang.garut.EvaluateLogical.Builder;
import com.andia.mixin.sleman.model.XLogical;

public class LogicalAdapter extends BaseAdapter {

	@Override
	public EvaluateExpression toExpression(Object object) {

		XLogical logical = (XLogical) object;
		Builder logicalBuilder = EvaluateLogical.newBuilder();

		Boolean value = logical.getValue();
		logicalBuilder.setValue(value);

		EvaluateLogical evaluateLogical = logicalBuilder.build();
		EvaluateExpression.Builder expressionBuilder = EvaluateExpression.newBuilder();
		expressionBuilder.setLogical(evaluateLogical);
		return expressionBuilder.build();

	}

}
