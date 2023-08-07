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

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.andia.mixin.model.BasicEList;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EList;
import com.andia.mixin.model.EReference;
import com.andia.mixin.sleman.api.SAssignment;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.sleman.api.SIdentifier;
import com.andia.mixin.sleman.api.SLet;

public class XLet extends XEvaluation implements SLet {

	public static String XCLASSNAME = Sleman.getEClassName("XLet");

	public static EReference FEATURE_VARIABLES = new EReference("variables", XAssignment.class);
	public static EReference FEATURE_RESULT = new EReference("result", XExpression.class);

	private EList<XAssignment> variables = new BasicEList<XAssignment>(this, XLet.FEATURE_VARIABLES);
	private XExpression result = null;

	public XLet() {
		super(Sleman.createEClass(XLet.XCLASSNAME), new EFeature[] {
				XLet.FEATURE_VARIABLES,
				XLet.FEATURE_RESULT,
		});
	}

	public EList<XAssignment> getVariables() {
		return this.variables;
	}

	@Override
	public XExpression getResult() {
		return this.result;
	}

	public void setResult(XExpression newResult) {
		XExpression oldResult = this.result;
		this.result = newResult;
		this.eSetNotify(FEATURE_RESULT, oldResult, newResult);
	}

	@Override
	public SExpression getAssignment(String name) {
		for (XAssignment assignment : this.variables) {
			XIdentifier identifier = assignment.getName();
			if (identifier.getName().equals(name)) {
				return assignment.getExpression();
			}
		}
		return null;
	}

	@Override
	public int assignmentSize() {
		return this.variables.size();
	}

	@Override
	public Collection<String> assignmentNames() {
		List<String> names = new ArrayList<>();
		for (XAssignment assignment : this.variables) {
			XIdentifier identifier = assignment.getName();
			String name = identifier.getName();
			names.add(name);
		}
		return names;
	}

	@Override
	public String toLiteral() {
		String literal = "let ";
		for (int i = 0; i < variables.size(); i++) {
			SAssignment assignment = this.variables.get(i);
			SIdentifier identifier = assignment.getName();
			String name = identifier.getName();
			SExpression expression = assignment.getExpression();
			literal += name + " = " + expression.toLiteral();
			if (i < variables.size() - 1) {
				literal += ", ";
			}
		}
		literal += " in " + this.result.toLiteral();
		return literal;
	}

	@Override
	public String toString() {
		return this.toLiteral();
	}

}
