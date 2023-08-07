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
import com.andia.mixin.padang.garut.EvaluateMember;
import com.andia.mixin.padang.garut.EvaluateMember.Builder;
import com.andia.mixin.padang.garut.EvaluatePointer;
import com.andia.mixin.sleman.model.XExpression;
import com.andia.mixin.sleman.model.XMember;
import com.andia.mixin.sleman.model.XPointer;

public class MemberAdapter extends BaseAdapter implements PointerAdapter {

	@Override
	public EvaluateExpression toExpression(Object source) {

		EvaluateMember evaluateMember = createMember(source);
		EvaluateExpression.Builder expressionBuilder = EvaluateExpression.newBuilder();
		expressionBuilder.setMember(evaluateMember);
		return expressionBuilder.build();

	}

	private EvaluateMember createMember(Object source) {

		XMember member = (XMember) source;
		Builder memberBuilder = EvaluateMember.newBuilder();
		ExpressionAdapterRegistry registry = ExpressionAdapterRegistry.getInstance();

		XPointer object = member.getObject();
		EvaluatePointer objectPointer = registry.toPointer(object);
		memberBuilder.setObject(objectPointer);

		XExpression property = member.getProperty();
		EvaluateExpression propertyExpression = registry.toExpression(property);
		memberBuilder.setProperty(propertyExpression);

		EvaluateMember evaluateMember = memberBuilder.build();
		return evaluateMember;
	}

	@Override
	public EvaluatePointer toPointer(Object object) {
		EvaluateMember evaluateMember = createMember(object);
		EvaluatePointer.Builder pointerBuilder = EvaluatePointer.newBuilder();
		pointerBuilder.setMember(evaluateMember);
		return pointerBuilder.build();
	}

}
