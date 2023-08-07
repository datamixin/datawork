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
import com.andia.mixin.padang.garut.EvaluateArgument;
import com.andia.mixin.padang.garut.EvaluateAssignment;
import com.andia.mixin.padang.garut.EvaluateCall;
import com.andia.mixin.padang.garut.EvaluateCall.Builder;
import com.andia.mixin.padang.garut.EvaluateExpression;
import com.andia.mixin.padang.garut.EvaluateIdentifier;
import com.andia.mixin.padang.garut.EvaluatePointer;
import com.andia.mixin.sleman.model.XArgument;
import com.andia.mixin.sleman.model.XAssignment;
import com.andia.mixin.sleman.model.XCall;
import com.andia.mixin.sleman.model.XExpression;
import com.andia.mixin.sleman.model.XIdentifier;
import com.andia.mixin.sleman.model.XPointer;

public class CallAdapter extends BaseAdapter {

	@Override
	public EvaluateExpression toExpression(Object object) {

		XCall call = (XCall) object;
		Builder callBuilder = EvaluateCall.newBuilder();
		ExpressionAdapterRegistry registry = ExpressionAdapterRegistry.getInstance();

		XPointer callee = call.getCallee();
		EvaluatePointer pointer = registry.toPointer(callee);
		callBuilder.setCallee(pointer);

		EList<XArgument> arguments = call.getArguments();
		for (XArgument argument : arguments) {
			EvaluateArgument.Builder argumentBuilder = EvaluateArgument.newBuilder();
			XExpression value = argument.getExpression();
			EvaluateExpression expression = registry.toExpression(value);
			if (argument instanceof XAssignment) {
				XAssignment assignment = (XAssignment) argument;
				XIdentifier identifier = assignment.getName();
				String name = identifier.getName();
				EvaluateIdentifier.Builder identifierBuilder = EvaluateIdentifier.newBuilder();
				identifierBuilder.setName(name);
				EvaluateAssignment.Builder assignmentBuilder = EvaluateAssignment.newBuilder();
				assignmentBuilder.setName(identifierBuilder);
				assignmentBuilder.setExpression(expression);
				argumentBuilder.setAssignment(assignmentBuilder);
			} else {
				argumentBuilder.setExpression(expression);
			}
			callBuilder.addArgument(argumentBuilder);
		}

		EvaluateCall evaluateCall = callBuilder.build();
		EvaluateExpression.Builder expressionBuilder = EvaluateExpression.newBuilder();
		expressionBuilder.setCall(evaluateCall);
		return expressionBuilder.build();

	}

}
