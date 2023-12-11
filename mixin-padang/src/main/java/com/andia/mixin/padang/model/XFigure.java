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

import com.andia.mixin.model.EAttribute;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EReference;

public class XFigure extends XFacet {

	public static String XCLASSNAME = Padang.getEClassName("XFigure");

	public static EAttribute FEATURE_NAME = new EAttribute("name", EAttribute.STRING);
	public static EReference FEATURE_GRAPHIC = new EReference("graphic", XGraphic.class);

	private String name = null;
	private XGraphic graphic = null;

	public XFigure() {
		super(Padang.createEClass(XCLASSNAME), new EFeature[] {
				XFigure.FEATURE_NAME,
				XFigure.FEATURE_GRAPHIC,
		});
	}

	public String getName() {
		return this.name;
	}

	public void setName(String newName) {
		String oldName = this.name;
		this.name = newName;
		this.eSetNotify(FEATURE_NAME, oldName, newName);
	}

	public XGraphic getGraphic() {
		return graphic;
	}

	public void setGraphic(XGraphic newGraphic) {
		XGraphic oldGraphic = this.graphic;
		this.graphic = newGraphic;
		this.eSetNotify(XFigure.FEATURE_GRAPHIC, oldGraphic, newGraphic);
	}

}
