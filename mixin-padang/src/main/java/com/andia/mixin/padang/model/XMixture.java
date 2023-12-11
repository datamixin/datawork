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

public class XMixture extends XPart {

	public static String XCLASSNAME = Padang.getEClassName("XMixture");

	public static EAttribute FEATURE_LAYOUT = new EAttribute("layout", EAttribute.STRING);
	public static EReference FEATURE_PARTS = new EReference("parts", XPart.class);
	public static EAttribute FEATURE_WEIGHTS = new EAttribute("weights", EAttribute.STRING);

	private String layout = null;
	private EList<XPart> parts = new BasicEList<XPart>(this, XMixture.FEATURE_PARTS);
	private String weights = null;

	public XMixture() {
		super(Padang.createEClass(XCLASSNAME), new EFeature[] {
				FEATURE_LAYOUT,
				FEATURE_PARTS,
				FEATURE_WEIGHTS,
		});
	}

	public String getLayout() {
		return this.layout;
	}

	public void setLayout(String newLayout) {
		String oldLayout = this.layout;
		this.layout = newLayout;
		this.eSetNotify(FEATURE_LAYOUT, oldLayout, newLayout);
	}

	public EList<XPart> getParts() {
		return this.parts;
	}

	public String getWeights() {
		return this.weights;
	}

	public void setWeights(String newWeights) {
		String oldWeights = this.weights;
		this.weights = newWeights;
		this.eSetNotify(FEATURE_WEIGHTS, oldWeights, newWeights);
	}
}
