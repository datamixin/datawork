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

public class XGeneration extends XSource {

	public static String XCLASSNAME = Padang.getEClassName("XGeneration");

	public static EAttribute FEATURE_CREATION = new EAttribute("creation", EAttribute.STRING);
	public static EReference FEATURE_OPTIONS = new EReference("options", XOption.class);

	private String creation = null;
	private EList<XOption> options = new BasicEList<XOption>(this, XMutation.FEATURE_OPTIONS);

	public XGeneration() {
		super(Padang.createEClass(XCLASSNAME), new EFeature[] {
				XGeneration.FEATURE_CREATION,
				XGeneration.FEATURE_OPTIONS
		});
	}

	public String getCreation() {
		return this.creation;
	}

	public void setCreation(String newCreation) {
		String oldCreation = this.creation;
		this.creation = newCreation;
		this.eSetNotify(XGeneration.FEATURE_CREATION, oldCreation, newCreation);
	}

	public EList<XOption> getOptions() {
		return this.options;
	}

}
