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
package com.andia.mixin.padang.model;

import com.andia.mixin.model.BasicEMap;
import com.andia.mixin.model.BasicEObject;
import com.andia.mixin.model.EAttribute;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EMap;
import com.andia.mixin.model.EReference;

public class XVariable extends BasicEObject {

	public static String XCLASSNAME = Padang.getEClassName("XVariable");

	public static EAttribute FEATURE_NAME = new EAttribute("name", EAttribute.STRING);
	public static EAttribute FEATURE_FORMULA = new EAttribute("formula", EAttribute.STRING);
	public static EAttribute FEATURE_PROPERTIES = new EAttribute("properties", EAttribute.STRING);
	public static EReference FEATURE_PREPARATION = new EReference("preparation", XPreparation.class);

	private String name = null;
	private String formula = null;
	private EMap<String> properties = new BasicEMap<String>(this, XFacet.FEATURE_PROPERTIES);
	private XPreparation preparation = null;

	public XVariable() {
		super(Padang.createEClass(XCLASSNAME), new EFeature[] {
				XVariable.FEATURE_NAME,
				XVariable.FEATURE_FORMULA,
				XVariable.FEATURE_PROPERTIES,
				XVariable.FEATURE_PREPARATION,
		});
	}

	public String getName() {
		return this.name;
	}

	public void setName(String newName) {
		String oldName = this.name;
		this.name = newName;
		this.eSetNotify(FEATURE_NAME, oldName, newName);
	}

	public String getFormula() {
		return this.formula;
	}

	public void setFormula(String newFormula) {
		String oldFormula = this.formula;
		this.formula = newFormula;
		this.eSetNotify(FEATURE_FORMULA, oldFormula, newFormula);
	}

	public EMap<String> getProperties() {
		return properties;
	}

	public XPreparation getPreparation() {
		return preparation;
	}

	public void setPreparation(XPreparation newPreparation) {
		XPreparation oldPreparation = this.preparation;
		this.preparation = newPreparation;
		this.eSetNotify(XVariable.FEATURE_PREPARATION, oldPreparation, newPreparation);
	}

}