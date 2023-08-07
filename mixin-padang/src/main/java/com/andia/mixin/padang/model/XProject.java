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

public class XProject extends BasicEObject {

	public static String XCLASSNAME = Padang.getEClassName("XProject");

	public static EAttribute FEATURE_VERSION = new EAttribute("version", EAttribute.NUMBER);
	public static EReference FEATURE_SHEETS = new EReference("sheets", XSheet.class);
	public static EAttribute FEATURE_SELECTION = new EAttribute("selection", EAttribute.STRING);
	public static EAttribute FEATURE_PROPERTIES = new EAttribute("properties", EAttribute.STRING);

	private int version = 2;
	private EList<XSheet> sheets = new BasicEList<XSheet>(this, XProject.FEATURE_SHEETS);
	private String selection = null;
	private EMap<String> properties = new BasicEMap<String>(this, XProject.FEATURE_PROPERTIES);

	public XProject() {
		super(Padang.createEClass(XCLASSNAME), new EFeature[] {
				XProject.FEATURE_VERSION,
				XProject.FEATURE_SHEETS,
				XProject.FEATURE_SELECTION,
				XProject.FEATURE_PROPERTIES,
		});
	}

	public int getVersion() {
		return this.version;
	}

	public void setVersion(int newVersion) {
		int oldVersion = this.version;
		this.version = newVersion;
		this.eSetNotify(XProject.FEATURE_VERSION, oldVersion, newVersion);
	}

	public EList<XSheet> getSheets() {
		return this.sheets;
	}

	public String getSelection() {
		return this.selection;
	}

	public void setSelection(String newSelection) {
		String oldSelection = this.selection;
		this.selection = newSelection;
		this.eSetNotify(XProject.FEATURE_SELECTION, oldSelection, newSelection);
	}

	public EMap<String> getProperties() {
		return properties;
	}

}
