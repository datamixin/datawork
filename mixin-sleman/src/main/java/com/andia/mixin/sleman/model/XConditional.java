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

import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EReference;
import com.andia.mixin.sleman.api.SConditional;

public class XConditional extends XEvaluation implements SConditional {

	public static String XCLASSNAME = Sleman.getEClassName("XConditional");

	public static EReference FEATURE_LOGICAL = new EReference("logical", XExpression.class);
	public static EReference FEATURE_CONSEQUENT = new EReference("consequent", XExpression.class);
	public static EReference FEATURE_ALTERNATE = new EReference("alternate", XExpression.class);

	private XExpression logical = null;
	private XExpression consequent = null;
	private XExpression alternate = null;

	public XConditional() {
		super(Sleman.createEClass(XConditional.XCLASSNAME), new EFeature[] {
				XConditional.FEATURE_LOGICAL,
				XConditional.FEATURE_CONSEQUENT,
				XConditional.FEATURE_ALTERNATE,
		});
	}

	@Override
	public XExpression getLogical() {
		return this.logical;
	}

	public void setLogical(XExpression newLogical) {
		XExpression oldLogical = this.logical;
		this.logical = newLogical;
		this.eSetNotify(FEATURE_LOGICAL, oldLogical, newLogical);
	}

	@Override
	public XExpression getConsequent() {
		return this.consequent;
	}

	public void setConsequent(XExpression newConsequent) {
		XExpression oldConsequent = this.consequent;
		this.consequent = newConsequent;
		this.eSetNotify(FEATURE_CONSEQUENT, oldConsequent, newConsequent);
	}

	@Override
	public XExpression getAlternate() {
		return this.alternate;
	}

	public void setAlternate(XExpression newAlternate) {
		XExpression oldAlternate = this.alternate;
		this.alternate = newAlternate;
		this.eSetNotify(FEATURE_ALTERNATE, oldAlternate, newAlternate);
	}

	@Override
	public String toLiteral() {
		String literal = "if ";
		literal += this.logical.toString();
		literal += " then ";
		literal += this.consequent.toString();
		literal += " else ";
		literal += this.alternate.toString();
		return literal;
	}

	@Override
	public String toString() {
		return this.toLiteral();
	}

}
