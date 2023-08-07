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

import java.util.HashMap;
import java.util.Map;

import com.andia.mixin.padang.garut.EvaluateExpression;
import com.andia.mixin.padang.garut.EvaluatePointer;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.sleman.model.XAlias;
import com.andia.mixin.sleman.model.XBinary;
import com.andia.mixin.sleman.model.XCall;
import com.andia.mixin.sleman.model.XConditional;
import com.andia.mixin.sleman.model.XForeach;
import com.andia.mixin.sleman.model.XLambda;
import com.andia.mixin.sleman.model.XLet;
import com.andia.mixin.sleman.model.XList;
import com.andia.mixin.sleman.model.XLogical;
import com.andia.mixin.sleman.model.XMember;
import com.andia.mixin.sleman.model.XNull;
import com.andia.mixin.sleman.model.XNumber;
import com.andia.mixin.sleman.model.XObject;
import com.andia.mixin.sleman.model.XPointer;
import com.andia.mixin.sleman.model.XReference;
import com.andia.mixin.sleman.model.XText;
import com.andia.mixin.sleman.model.XUnary;

public class ExpressionAdapterRegistry {

	private static ExpressionAdapterRegistry instance;

	private NullAdapter converter = new NullAdapter();
	private Map<Class<?>, ExpressionAdapter> classes = new HashMap<>();

	private ExpressionAdapterRegistry() {

		classes.put(XText.class, new TextAdapter());
		classes.put(XNumber.class, new NumberAdapter());
		classes.put(XLogical.class, new LogicalAdapter());
		classes.put(XList.class, new ListAdapter());
		classes.put(XObject.class, new ObjectAdapter());
		classes.put(XForeach.class, new ForeachAdapter());
		classes.put(XCall.class, new CallAdapter());
		classes.put(XAlias.class, new AliasAdapter());
		classes.put(XMember.class, new MemberAdapter());
		classes.put(XReference.class, new ReferenceAdapter());
		classes.put(XBinary.class, new BinaryAdapter());
		classes.put(XConditional.class, new ConditionalAdapter());
		classes.put(XUnary.class, new UnaryAdapter());
		classes.put(XLet.class, new LetAdapter());
		classes.put(XLambda.class, new LambdaAdapter());

	}

	public static ExpressionAdapterRegistry getInstance() {
		if (instance == null) {
			instance = new ExpressionAdapterRegistry();
		}
		return instance;
	}

	public EvaluateExpression toExpression(SExpression expression) {
		if (expression == null || expression instanceof XNull) {
			return converter.toExpression(expression);
		}
		ExpressionAdapter adapter = getAdapter(expression);
		EvaluateExpression value = adapter.toExpression(expression);
		return value;
	}

	private ExpressionAdapter getAdapter(SExpression expression) {
		Class<?> oClass = expression.getClass();
		ExpressionAdapter converter = null;
		for (Class<?> cClass : classes.keySet()) {
			if (cClass.isAssignableFrom(oClass)) {
				converter = classes.get(cClass);
			}
		}
		return converter;
	}

	public EvaluatePointer toPointer(XPointer expression) {
		PointerAdapter adapter = (PointerAdapter) getAdapter(expression);
		EvaluatePointer value = adapter.toPointer(expression);
		return value;
	}

}
