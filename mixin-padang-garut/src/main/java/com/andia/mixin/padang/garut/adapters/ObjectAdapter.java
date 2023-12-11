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

import com.andia.mixin.model.EList;
import com.andia.mixin.padang.garut.EvaluateAssignment;
import com.andia.mixin.padang.garut.EvaluateExpression;
import com.andia.mixin.padang.garut.EvaluateIdentifier;
import com.andia.mixin.padang.garut.EvaluateObject;
import com.andia.mixin.padang.garut.EvaluateObject.Builder;
import com.andia.mixin.sleman.model.XAssignment;
import com.andia.mixin.sleman.model.XExpression;
import com.andia.mixin.sleman.model.XIdentifier;
import com.andia.mixin.sleman.model.XObject;

public class ObjectAdapter extends BaseAdapter {

	@Override
	public EvaluateExpression toExpression(Object source) {

		XObject object = (XObject) source;
		Builder objectBuilder = EvaluateObject.newBuilder();
		ExpressionAdapterRegistry registry = ExpressionAdapterRegistry.getInstance();

		EList<XAssignment> fields = object.getFields();
		for (XAssignment field : fields) {

			EvaluateAssignment.Builder assignmentBuilder = EvaluateAssignment.newBuilder();

			XIdentifier nameIdentifier = field.getName();
			EvaluateIdentifier identifier = createIdentifier(nameIdentifier);
			assignmentBuilder.setName(identifier);

			XExpression expression = field.getExpression();
			EvaluateExpression expressionExpression = registry.toExpression(expression);
			assignmentBuilder.setExpression(expressionExpression);

			EvaluateAssignment assignment = assignmentBuilder.build();
			objectBuilder.addField(assignment);
		}

		EvaluateObject evaluateObject = objectBuilder.build();
		EvaluateExpression.Builder expressionBuilder = EvaluateExpression.newBuilder();
		expressionBuilder.setObject(evaluateObject);
		return expressionBuilder.build();

	}

}
