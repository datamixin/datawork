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
import com.andia.mixin.model.BasicEMap;
import com.andia.mixin.model.BasicEObject;
import com.andia.mixin.model.EAttribute;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EList;
import com.andia.mixin.model.EMap;
import com.andia.mixin.model.EReference;

public class XGraphic extends BasicEObject {

	public static String XCLASSNAME = Padang.getEClassName("XGraphic");

	public static EAttribute FEATURE_RENDERER = new EAttribute("renderer", EAttribute.STRING);
	public static EAttribute FEATURE_EVALUATES = new EAttribute("evaluates", EAttribute.STRING);
	public static EAttribute FEATURE_FORMATION = new EAttribute("formation", EAttribute.STRING);
	public static EReference FEATURE_VARIABLES = new EReference("variables", XVariable.class);

	private String renderer = null;
	private EMap<String> evaluates = new BasicEMap<String>(this, XGraphic.FEATURE_EVALUATES);
	private String formation = null;
	private EList<XVariable> variables = new BasicEList<XVariable>(this, XGraphic.FEATURE_VARIABLES);

	public XGraphic() {
		super(Padang.createEClass(XCLASSNAME), new EFeature[] {
				XGraphic.FEATURE_RENDERER,
				XGraphic.FEATURE_EVALUATES,
				XGraphic.FEATURE_FORMATION,
				XGraphic.FEATURE_VARIABLES,
		});
	}

	public String getRenderer() {
		return this.renderer;
	}

	public void setRenderer(String newRenderer) {
		String oldRenderer = this.renderer;
		this.renderer = newRenderer;
		this.eSetNotify(FEATURE_RENDERER, oldRenderer, newRenderer);
	}

	public EMap<String> getEvaluates() {
		return evaluates;
	}

	public String getFormation() {
		return this.formation;
	}

	public void setFormation(String newFormation) {
		String oldFormation = this.formation;
		this.formation = newFormation;
		this.eSetNotify(FEATURE_FORMATION, oldFormation, newFormation);
	}

	public EList<XVariable> getVariables() {
		return variables;
	}

}
