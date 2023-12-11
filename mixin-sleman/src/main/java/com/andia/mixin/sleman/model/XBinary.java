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

import com.andia.mixin.model.EAttribute;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EReference;
import com.andia.mixin.sleman.api.SBinary;

public class XBinary extends XEvaluation implements SBinary {

	public static String XCLASSNAME = Sleman.getEClassName("XBinary");

	public static EReference FEATURE_LEFT = new EReference("left", XExpression.class);
	public static EReference FEATURE_RIGHT = new EReference("right", XExpression.class);
	public static EAttribute FEATURE_OPERATOR = new EAttribute("operator", EAttribute.STRING);

	private XExpression left = null;
	private XExpression right = null;
	private String operator = null;

	public XBinary() {
		super(Sleman.createEClass(XBinary.XCLASSNAME), new EFeature[] {
				XBinary.FEATURE_LEFT,
				XBinary.FEATURE_RIGHT,
				XBinary.FEATURE_OPERATOR
		});
	}

	@Override
	public XExpression getLeft() {
		return this.left;
	}

	public void setLeft(XExpression newLeft) {
		XExpression oldLeft = this.left;
		this.left = newLeft;
		this.eSetNotify(FEATURE_LEFT, oldLeft, newLeft);
	}

	@Override
	public XExpression getRight() {
		return this.right;
	}

	public void setRight(XExpression newRight) {
		XExpression oldRight = this.right;
		this.right = newRight;
		this.eSetNotify(FEATURE_RIGHT, oldRight, newRight);
	}

	@Override
	public String getOperator() {
		return this.operator;
	}

	public void setOperator(String newOperator) {
		String oldOperator = this.operator;
		this.operator = newOperator;
		this.eSetNotify(FEATURE_OPERATOR, oldOperator, newOperator);
	}

	@Override
	public String toLiteral() {
		boolean group = isGroup();
		String literal = group ? "(" : "";
		literal += this.left.toString();
		literal += " ";
		literal += this.operator;
		literal += " ";
		literal += this.right.toString();
		literal += group ? ")" : "";
		return literal;
	}

	@Override
	public String toString() {
		return this.toLiteral();
	}
}
