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

import com.andia.mixin.model.BasicEObject;
import com.andia.mixin.model.EAttribute;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EReference;

public class XSheet extends BasicEObject {

	public static String XCLASSNAME = Padang.getEClassName("XSheet");

	public static EAttribute FEATURE_NAME = new EAttribute("name", EAttribute.STRING);
	public static EReference FEATURE_FORESEE = new EReference("foresee", XForesee.class);

	private String name = null;
	private XForesee foresee = null;

	public XSheet() {
		super(Padang.createEClass(XCLASSNAME), new EFeature[] {
				XSheet.FEATURE_NAME,
				XSheet.FEATURE_FORESEE,
		});
	}

	public String getName() {
		return this.name;
	}

	public void setName(String newName) {
		String oldName = this.name;
		this.name = newName;
		this.eSetNotify(XSheet.FEATURE_NAME, oldName, newName);
	}

	public XForesee getForesee() {
		return foresee;
	}

	public void setForesee(XForesee newForesee) {
		XForesee oldForesee = this.foresee;
		this.foresee = newForesee;
		this.eSetNotify(XSheet.FEATURE_FORESEE, oldForesee, newForesee);
	}

}
