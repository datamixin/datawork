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

import com.andia.mixin.padang.garut.EvaluateAlias;
import com.andia.mixin.padang.garut.EvaluateAlias.Builder;
import com.andia.mixin.padang.garut.EvaluateExpression;
import com.andia.mixin.padang.garut.EvaluatePointer;
import com.andia.mixin.sleman.model.XAlias;

public class AliasAdapter extends BaseAdapter implements PointerAdapter {

	@Override
	public EvaluateExpression toExpression(Object object) {
		EvaluateAlias evaluateAlias = createAlias(object);
		EvaluateExpression.Builder expressionBuilder = EvaluateExpression.newBuilder();
		expressionBuilder.setAlias(evaluateAlias);
		return expressionBuilder.build();
	}

	private EvaluateAlias createAlias(Object object) {
		XAlias alias = (XAlias) object;
		String name = alias.getName();
		Builder aliasBuilder = EvaluateAlias.newBuilder();
		aliasBuilder.setName(name);
		EvaluateAlias evaluateAlias = aliasBuilder.build();
		return evaluateAlias;
	}

	@Override
	public EvaluatePointer toPointer(Object object) {
		EvaluateAlias evaluateAlias = createAlias(object);
		EvaluatePointer.Builder pointerBuilder = EvaluatePointer.newBuilder();
		pointerBuilder.setAlias(evaluateAlias);
		return pointerBuilder.build();
	}

}
