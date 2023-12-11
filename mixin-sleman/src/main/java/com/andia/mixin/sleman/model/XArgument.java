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
package com.andia.mixin.sleman.model;

import com.andia.mixin.model.BasicEObject;
import com.andia.mixin.model.EClass;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EReference;
import com.andia.mixin.sleman.api.SArgument;
import com.andia.mixin.util.ArrayUtils;

public class XArgument extends BasicEObject implements SArgument {

	public static String XCLASSNAME = Sleman.getEClassName("XArgument");

	public static EReference FEATURE_EXPRESSION = new EReference("expression", XExpression.class);

	private XExpression expression = null;

	public XArgument(EClass eClass, EFeature[] features) {
		super(eClass, ArrayUtils.push(features,
				new EFeature[] {
						FEATURE_EXPRESSION,
				}));
	}

	public XArgument() {
		super(Sleman.createEClass(XCLASSNAME), new EFeature[] {
				FEATURE_EXPRESSION,
		});
	}

	@Override
	public XExpression getExpression() {
		return this.expression;
	}

	public void setExpression(XExpression newExpression) {
		XExpression oldExpression = this.expression;
		this.expression = newExpression;
		this.eSetNotify(FEATURE_EXPRESSION, oldExpression, newExpression);
	}

	@Override
	public String toString() {
		return this.expression.toString();
	}

}
