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

import com.andia.mixin.model.BasicEList;
import com.andia.mixin.model.EAttribute;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EList;
import com.andia.mixin.model.EReference;

public class XBuilder extends XForesee {

	public static String XCLASSNAME = Padang.getEClassName("XBuilder");

	public static EAttribute FEATURE_REVISION = new EAttribute("revision", EAttribute.STRING);
	public static EAttribute FEATURE_STRUCTURE = new EAttribute("structure", EAttribute.STRING);
	public static EAttribute FEATURE_EXPLANATION = new EAttribute("explanation", EAttribute.STRING);
	public static EReference FEATURE_VARIABLES = new EReference("variables", XVariable.class);

	private String revision = null;
	private String structure = null;
	private String explanation = null;
	private EList<XVariable> variables = new BasicEList<XVariable>(this, XBuilder.FEATURE_VARIABLES);

	public XBuilder() {
		super(Padang.createEClass(XCLASSNAME), new EFeature[] {
				XBuilder.FEATURE_REVISION,
				XBuilder.FEATURE_STRUCTURE,
				XBuilder.FEATURE_EXPLANATION,
				XBuilder.FEATURE_VARIABLES,
		});
	}

	public String getRevision() {
		return this.revision;
	}

	public void setRevision(String newRevision) {
		String oldRevision = this.revision;
		this.revision = newRevision;
		this.eSetNotify(FEATURE_REVISION, oldRevision, newRevision);
	}

	public String getStructure() {
		return this.structure;
	}

	public void setStructure(String newStructure) {
		String oldStructure = this.structure;
		this.structure = newStructure;
		this.eSetNotify(FEATURE_STRUCTURE, oldStructure, newStructure);
	}

	public String getExplanation() {
		return this.explanation;
	}

	public void setExplanation(String newExplanation) {
		String oldExplanation = this.explanation;
		this.explanation = newExplanation;
		this.eSetNotify(FEATURE_EXPLANATION, oldExplanation, newExplanation);
	}

	public EList<XVariable> getVariables() {
		return variables;
	}

}
