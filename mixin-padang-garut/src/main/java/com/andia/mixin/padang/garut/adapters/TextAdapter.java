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

import com.andia.mixin.padang.garut.EvaluateExpression;
import com.andia.mixin.padang.garut.EvaluateText;
import com.andia.mixin.padang.garut.EvaluateText.Builder;
import com.andia.mixin.sleman.model.XText;

public class TextAdapter extends BaseAdapter {

	@Override
	public EvaluateExpression toExpression(Object object) {

		XText text = (XText) object;
		Builder textBuilder = EvaluateText.newBuilder();

		String value = text.getValue();
		if (value != null) {
			textBuilder.setValue(value);
		}

		EvaluateText evaluateText = textBuilder.build();
		EvaluateExpression.Builder expressionBuilder = EvaluateExpression.newBuilder();
		expressionBuilder.setText(evaluateText);
		return expressionBuilder.build();

	}

}
