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
import com.andia.mixin.padang.garut.EvaluateNumber;
import com.andia.mixin.padang.garut.EvaluateNumber.Builder;
import com.andia.mixin.sleman.model.XNumber;

public class NumberAdapter extends BaseAdapter {

	@Override
	public EvaluateExpression toExpression(Object object) {

		XNumber number = (XNumber) object;
		Builder numberBuilder = EvaluateNumber.newBuilder();

		Number value = number.getValue();
		if (value instanceof Integer) {
			numberBuilder.setInt32(value.intValue());
		} else if (value instanceof Long) {
			numberBuilder.setInt64(value.longValue());
		} else if (value instanceof Float) {
			numberBuilder.setFloat(value.floatValue());
		} else {
			numberBuilder.setDouble(value.doubleValue());
		}

		EvaluateNumber evaluateNumber = numberBuilder.build();
		EvaluateExpression.Builder expressionBuilder = EvaluateExpression.newBuilder();
		expressionBuilder.setNumber(evaluateNumber);
		return expressionBuilder.build();

	}

}
