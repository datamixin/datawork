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
package com.andia.mixin.sleman.model;

import static java.lang.Character.isLetter;

import com.andia.mixin.model.EAttribute;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EReference;
import com.andia.mixin.sleman.api.SUnary;

public class XUnary extends XExpression implements SUnary {

	public static String XCLASSNAME = Sleman.getEClassName("XUnary");

	public static EAttribute FEATURE_OPERATOR = new EAttribute("operator", EAttribute.STRING);
	public static EReference FEATURE_ARGUMENT = new EReference("argument", XExpression.class);
	public static EAttribute FEATURE_PREFIX = new EAttribute("prefix", EAttribute.BOOLEAN);

	private String operator = null;
	private XExpression argument = null;
	private boolean prefix = true;

	public XUnary() {
		super(Sleman.createEClass(XUnary.XCLASSNAME), new EFeature[] {
				XUnary.FEATURE_OPERATOR,
				XUnary.FEATURE_ARGUMENT,
				XUnary.FEATURE_PREFIX,
		});
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
	public boolean isPrefix() {
		return this.prefix;
	}

	public void setPrefix(boolean newPrefix) {
		boolean oldPrefix = this.prefix;
		this.prefix = newPrefix;
		this.eSetNotify(FEATURE_PREFIX, oldPrefix, newPrefix);
	}

	@Override
	public XExpression getArgument() {
		return this.argument;
	}

	public void setArgument(XExpression newArgument) {
		XExpression oldArgument = this.argument;
		this.argument = newArgument;
		this.eSetNotify(FEATURE_OPERATOR, oldArgument, newArgument);
	}

	@Override
	public String toLiteral() {
		String literal = "";
		if (this.prefix) {
			literal += this.operator;
			literal = getLiteral(literal);
			literal += this.argument.toLiteral();
		} else {
			literal += this.argument.toLiteral();
			literal = getLiteral(literal);
			literal += this.operator;
		}
		return literal;
	}

	private String getLiteral(String literal) {
		int length = this.operator.length();
		char last = this.operator.charAt(length - 1);
		if (isLetter(last)) {
			literal += " ";
		}
		return literal;
	}

	@Override
	public String toString() {
		return this.toLiteral();
	}

}
