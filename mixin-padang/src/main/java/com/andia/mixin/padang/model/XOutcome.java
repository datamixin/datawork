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
package com.andia.mixin.padang.model;

import com.andia.mixin.model.EAttribute;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EReference;

public class XOutcome extends XFacet {

	public static String XCLASSNAME = Padang.getEClassName("XOutcome");

	public static EAttribute FEATURE_FRONTAGE = new EAttribute("frontage", EAttribute.STRING);
	public static EReference FEATURE_VARIABLE = new EReference("variable", XVariable.class);

	private String frontage = null;
	private XVariable variable = null;

	public XOutcome() {
		super(Padang.createEClass(XCLASSNAME), new EFeature[] {
				XOutcome.FEATURE_FRONTAGE,
				XOutcome.FEATURE_VARIABLE,
		});
	}

	public String getFrontage() {
		return this.frontage;
	}

	public void setFrontage(String newFrontage) {
		String oldFrontage = this.frontage;
		this.frontage = newFrontage;
		this.eSetNotify(FEATURE_FRONTAGE, oldFrontage, newFrontage);
	}

	public XVariable getVariable() {
		return this.variable;
	}

	public void setVariable(XVariable newVariable) {
		XVariable oldVariable = this.variable;
		this.variable = newVariable;
		this.eSetNotify(FEATURE_VARIABLE, oldVariable, newVariable);
	}

}
