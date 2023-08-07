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

public class XFilter extends BasicEObject {

	public static String XCLASSNAME = Padang.getEClassName("XReserve");

	public static EAttribute FEATURE_LAYOUT = new EAttribute("layout", EAttribute.STRING);
	public static EReference FEATURE_INPUTS = new EReference("inputs", XInput.class);

	private String layout = null;
	private EList<XInput> inputs = new BasicEList<XInput>(this, XFilter.FEATURE_INPUTS);

	public XFilter() {
		super(Padang.createEClass(XCLASSNAME), new EFeature[] {
				XFilter.FEATURE_LAYOUT,
				XFilter.FEATURE_INPUTS
		});
	}

	public String getLayout() {
		return this.layout;
	}

	public void setLayout(String newLayout) {
		String oldLayout = this.layout;
		this.layout = newLayout;
		this.eSetNotify(XFilter.FEATURE_LAYOUT, oldLayout, newLayout);
	}

	public EList<XInput> getInputs() {
		return this.inputs;
	}

}
