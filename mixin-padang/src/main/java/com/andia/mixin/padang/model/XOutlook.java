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

public class XOutlook extends XForesee {

	public static String XCLASSNAME = Padang.getEClassName("XOutlook");

	public static EReference FEATURE_VIEWSET = new EReference("viewset", XViewset.class);

	private XViewset viewset = null;

	public XOutlook() {
		super(Padang.createEClass(XCLASSNAME), new EFeature[] {
				XOutlook.FEATURE_VIEWSET,
		});
	}

	public XViewset getViewset() {
		return viewset;
	}

	public void setViewset(XViewset newViewset) {
		XViewset oldViewset = this.viewset;
		this.viewset = newViewset;
		this.eSetNotify(XOutlook.FEATURE_VIEWSET, oldViewset, newViewset);
	}

}
