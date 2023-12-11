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

import com.andia.mixin.model.BasicEObject;
import com.andia.mixin.model.EAttribute;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EReference;

public class XViewset extends BasicEObject {

	public static String XCLASSNAME = Padang.getEClassName("XViewset");

	public static EReference FEATURE_MIXTURE = new EReference("mixture", XMixture.class);
	public static EAttribute FEATURE_SELECTION = new EAttribute("selection", EAttribute.STRING);

	private XMixture mixture = null;
	private String selection = null;

	public XViewset() {
		super(Padang.createEClass(XCLASSNAME), new EFeature[] {
				XViewset.FEATURE_MIXTURE,
				XViewset.FEATURE_SELECTION,
		});
	}

	public XMixture getMixture() {
		return mixture;
	}

	public void setMixture(XMixture newMixture) {
		XMixture oldMixture = this.mixture;
		this.mixture = newMixture;
		this.eSetNotify(XViewset.FEATURE_MIXTURE, oldMixture, newMixture);
	}

	public String getSelection() {
		return this.selection;
	}

	public void setSelection(String newSelection) {
		String oldSelection = this.selection;
		this.selection = newSelection;
		this.eSetNotify(XViewset.FEATURE_SELECTION, oldSelection, newSelection);
	}

}
