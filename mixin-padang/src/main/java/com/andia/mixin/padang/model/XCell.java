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

import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EReference;

public class XCell extends XPart {

	public static String XCLASSNAME = Padang.getEClassName("XCell");

	public static EReference FEATURE_FACET = new EReference("facet", XFacet.class);

	private XFacet facet = null;

	public XCell() {
		super(Padang.createEClass(XCLASSNAME), new EFeature[] {
				FEATURE_FACET
		});
	}

	public XFacet getFacet() {
		return this.facet;
	}

	public void setFacet(XFacet newFacet) {
		XFacet oldFacet = this.facet;
		this.facet = newFacet;
		this.eSetNotify(FEATURE_FACET, oldFacet, newFacet);
	}

}