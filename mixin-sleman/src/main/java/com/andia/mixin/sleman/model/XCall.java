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

import com.andia.mixin.model.BasicEList;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EList;
import com.andia.mixin.model.EReference;
import com.andia.mixin.sleman.api.SCall;

public class XCall extends XEvaluation implements SCall {

	public static String XCLASSNAME = Sleman.getEClassName("XCall");

	public static EReference FEATURE_CALLEE = new EReference("callee", XPointer.class);
	public static EReference FEATURE_ARGUMENTS = new EReference("arguments", XArgument.class);

	private XPointer callee = null;
	private BasicEList<XArgument> arguments = new BasicEList<>(this, XCall.FEATURE_ARGUMENTS);

	public XCall() {
		super(Sleman.createEClass(XCall.XCLASSNAME), new EFeature[] {
				XCall.FEATURE_CALLEE,
				XCall.FEATURE_ARGUMENTS
		});

	}

	@Override
	public XPointer getCallee() {
		return this.callee;
	}

	public void setCallee(XPointer newCallee) {
		XPointer oldCallee = this.callee;
		this.callee = newCallee;
		this.eSetNotify(FEATURE_CALLEE, oldCallee, newCallee);
	}

	public EList<XArgument> getArguments() {
		return this.arguments;
	}

	@Override
	public int argumentSize() {
		return this.arguments.size();
	}

	@Override
	public XArgument getArgument(int index) {
		return this.arguments.get(index);
	}

	@Override
	public String toLiteral() {
		String literal = this.callee.toString();
		literal += "(";
		for (int i = 0; i < this.arguments.size(); i++) {
			XArgument argument = this.arguments.get(i);
			literal += argument.toString();
			if (i < this.arguments.size() - 1) {
				literal += ", ";
			}
		}
		literal += ")";
		return literal;
	}

	@Override
	public String toString() {
		return this.toLiteral();
	}

}
