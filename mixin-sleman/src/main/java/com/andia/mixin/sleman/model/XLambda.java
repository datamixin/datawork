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

import java.util.ArrayList;
import java.util.List;

import com.andia.mixin.model.BasicEList;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EList;
import com.andia.mixin.model.EReference;
import com.andia.mixin.sleman.api.SIdentifier;
import com.andia.mixin.sleman.api.SLambda;

public class XLambda extends XEvaluation implements SLambda {

	public static String XCLASSNAME = Sleman.getEClassName("XLambda");

	public static EReference FEATURE_PARAMETERS = new EReference("parameters", XIdentifier.class);
	public static EReference FEATURE_EXPRESSION = new EReference("expression", XExpression.class);

	private EList<XIdentifier> parameters = new BasicEList<XIdentifier>(this, XLambda.FEATURE_PARAMETERS);
	private XExpression expression = null;

	public XLambda() {
		super(Sleman.createEClass(XLambda.XCLASSNAME), new EFeature[] {
				XLambda.FEATURE_PARAMETERS,
				XLambda.FEATURE_EXPRESSION,
		});
	}

	public EList<XIdentifier> getParameters() {
		return this.parameters;
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
	public List<String> parameterNames() {
		List<String> names = new ArrayList<>();
		for (XIdentifier identifier : this.parameters) {
			String name = identifier.getName();
			names.add(name);
		}
		return names;
	}

	@Override
	public int parameterSize() {
		return parameters.size();
	}

	@Override
	public String getParameter(int index) {
		XIdentifier identifier = this.parameters.get(index);
		return identifier.getName();
	}

	@Override
	public String toLiteral() {
		String literal = "(";
		for (int i = 0; i < this.parameters.size(); i++) {
			SIdentifier parameter = this.parameters.get(i);
			literal += parameter.getName();
			if (i < this.parameters.size() - 1) {
				literal += ", ";
			}
		}
		literal += ") -> " + this.expression.toLiteral();
		return literal;
	}

	@Override
	public String toString() {
		return this.toLiteral();
	}

}
