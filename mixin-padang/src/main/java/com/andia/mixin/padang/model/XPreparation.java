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
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EList;
import com.andia.mixin.model.EReference;

public class XPreparation extends XSource {

	public static String XCLASSNAME = Padang.getEClassName("XPreparation");

	public static EReference FEATURE_DISPLAY = new EReference("display", XDisplay.class);
	public static EReference FEATURE_MUTATIONS = new EReference("mutations", XMutation.class);

	private XDisplay display = null;
	private EList<XMutation> mutations = new BasicEList<XMutation>(this, XPreparation.FEATURE_MUTATIONS);

	public XPreparation() {
		super(Padang.createEClass(XCLASSNAME), new EFeature[] {
				XPreparation.FEATURE_DISPLAY,
				XPreparation.FEATURE_MUTATIONS,
		});
	}

	public XDisplay getDisplay() {
		return display;
	}

	public void setDisplay(XDisplay newDisplay) {
		XDisplay oldDisplay = this.display;
		this.display = newDisplay;
		this.eSetNotify(XPreparation.FEATURE_DISPLAY, oldDisplay, newDisplay);
	}

	public EList<XMutation> getMutations() {
		return mutations;
	}

}
