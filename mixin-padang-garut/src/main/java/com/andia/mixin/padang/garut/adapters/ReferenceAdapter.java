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

import com.andia.mixin.padang.garut.EvaluateReference;
import com.andia.mixin.padang.garut.EvaluateExpression;
import com.andia.mixin.padang.garut.EvaluatePointer;
import com.andia.mixin.padang.garut.EvaluateReference.Builder;
import com.andia.mixin.sleman.model.XReference;

public class ReferenceAdapter extends BaseAdapter implements PointerAdapter {

	@Override
	public EvaluateExpression toExpression(Object object) {
		EvaluateReference evaluateReference = createReference(object);
		EvaluateExpression.Builder expressionBuilder = EvaluateExpression.newBuilder();
		expressionBuilder.setReference(evaluateReference);
		return expressionBuilder.build();
	}

	private EvaluateReference createReference(Object object) {
		XReference reference = (XReference) object;
		String name = reference.getName();
		Builder referenceBuilder = EvaluateReference.newBuilder();
		referenceBuilder.setName(name);
		EvaluateReference evaluateReference = referenceBuilder.build();
		return evaluateReference;
	}

	@Override
	public EvaluatePointer toPointer(Object object) {
		EvaluateReference evaluateReference = createReference(object);
		EvaluatePointer.Builder pointerBuilder = EvaluatePointer.newBuilder();
		pointerBuilder.setReference(evaluateReference);
		return pointerBuilder.build();
	}

}
