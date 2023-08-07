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

import com.andia.mixin.model.BasicEList;
import com.andia.mixin.model.BasicEObject;
import com.andia.mixin.model.EAttribute;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EList;
import com.andia.mixin.model.EReference;

public class XEstimator extends BasicEObject {

	public static String XCLASSNAME = Padang.getEClassName("XEstimator");

	public static EAttribute FEATURE_NAME = new EAttribute("name", EAttribute.STRING);
	public static EAttribute FEATURE_FORMULA = new EAttribute("formula", EAttribute.STRING);
	public static EReference FEATURE_OPTIONS = new EReference("options", XOption.class);

	private String name = null;
	private String formula = null;
	private EList<XOption> options = new BasicEList<XOption>(this, XMutation.FEATURE_OPTIONS);

	public XEstimator() {
		super(Padang.createEClass(XCLASSNAME), new EFeature[] {
				XEstimator.FEATURE_NAME,
				XEstimator.FEATURE_FORMULA,
				XGeneration.FEATURE_OPTIONS
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

	public EList<XOption> getOptions() {
		return this.options;
	}

}