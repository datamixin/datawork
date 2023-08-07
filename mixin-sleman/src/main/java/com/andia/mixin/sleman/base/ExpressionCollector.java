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
package com.andia.mixin.sleman.base;

import java.util.ArrayList;
import java.util.List;

import com.andia.mixin.model.EList;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.sleman.model.XArgument;
import com.andia.mixin.sleman.model.XAssignment;
import com.andia.mixin.sleman.model.XBinary;
import com.andia.mixin.sleman.model.XCall;
import com.andia.mixin.sleman.model.XExpression;
import com.andia.mixin.sleman.model.XForeach;
import com.andia.mixin.sleman.model.XIdentifier;
import com.andia.mixin.sleman.model.XLambda;
import com.andia.mixin.sleman.model.XLet;
import com.andia.mixin.sleman.model.XList;
import com.andia.mixin.sleman.model.XMember;
import com.andia.mixin.sleman.model.XObject;
import com.andia.mixin.sleman.model.XPointer;
import com.andia.mixin.sleman.model.XReference;
import com.andia.mixin.sleman.model.XUnary;

public class ExpressionCollector {

	private static ExpressionCollector instance;

	public static ExpressionCollector getInstance() {
		if (instance == null) {
			instance = new ExpressionCollector();
		}
		return instance;
	}

	private ExpressionCollector() {

	}

	@SuppressWarnings("unchecked")
	public <T> void collect(Class<T> type, List<T> instances, SExpression parent) {

		if (type.isInstance(parent)) {

			T instance = (T) parent;
			if (!instances.contains(instance)) {
				instances.add(instance);
			}

		}

		if (parent instanceof XObject) {

			XObject object = (XObject) parent;
			EList<XAssignment> fields = object.getFields();
			for (XAssignment assignment : fields) {
				XExpression expression = assignment.getExpression();
				collect(type, instances, expression);
			}

		} else if (parent instanceof XList) {

			XList list = (XList) parent;
			EList<XExpression> elements = list.getElements();
			for (XExpression expression : elements) {
				collect(type, instances, expression);
			}

		} else if (parent instanceof XCall) {

			XCall call = (XCall) parent;
			XPointer callee = call.getCallee();
			collect(type, instances, callee);
			EList<XArgument> arguments = call.getArguments();
			for (XArgument argument : arguments) {
				XExpression expression = argument.getExpression();
				collect(type, instances, expression);
			}

		} else if (parent instanceof XLet) {

			// Baca semua variable assignment di dalam let
			XLet let = (XLet) parent;

			// Pertama dari result
			XExpression result = let.getResult();
			collect(type, instances, result);

			// Berikutnya dari assignment
			EList<XAssignment> assignments = let.getVariables();
			for (XAssignment assignment : assignments) {

				// Kumpulkan semua pointer digunakan di expression
				XExpression expression = assignment.getExpression();
				collect(type, instances, expression);

			}

			// Looping ke semua variable untuk mengetahui apakah digunakan
			List<T> used = new ArrayList<>();
			for (XAssignment other : assignments) {

				XIdentifier identifier = other.getName();
				String assignmentName = identifier.getName();

				// Looping ke semua instance untuk mencari yang digunakan sebagai variable
				for (T instance : instances) {
					if (instance instanceof XReference) {

						// Hapus reference yang menggunakan variable let
						XReference reference = (XReference) instance;
						String referenceName = reference.getName();
						if (referenceName.equals(assignmentName)) {
							used.add(instance);
						}
					}
				}
			}

			// Hapus semua descending pointer yang menggunakan variable di let
			instances.removeAll(used);

		} else if (parent instanceof XForeach) {

			XForeach foreach = (XForeach) parent;
			XExpression expression = foreach.getExpression();
			collect(type, instances, expression);

		} else if (parent instanceof XLambda) {

			XLambda lambda = (XLambda) parent;
			XExpression expression = lambda.getExpression();
			collect(type, instances, expression);

		} else if (parent instanceof XMember) {

			XMember member = (XMember) parent;
			XExpression object = member.getObject();
			collect(type, instances, object);

		} else if (parent instanceof XBinary) {

			XBinary binary = (XBinary) parent;
			XExpression left = binary.getLeft();
			XExpression right = binary.getRight();
			collect(type, instances, left);
			collect(type, instances, right);

		} else if (parent instanceof XUnary) {

			XUnary unary = (XUnary) parent;
			XExpression argument = unary.getArgument();
			collect(type, instances, argument);

		}

	}

	public <T> List<T> collect(Class<T> eClass, SExpression expression) {
		List<T> instances = new ArrayList<>();
		collect(eClass, instances, expression);
		return instances;
	}
}
