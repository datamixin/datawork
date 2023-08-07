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

import com.andia.mixin.model.BasicEMap;
import com.andia.mixin.model.BasicEObject;
import com.andia.mixin.model.EAttribute;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EMap;

public class XInput extends BasicEObject {

	public static String XCLASSNAME = Padang.getEClassName("XInput");

	public static EAttribute FEATURE_NAME = new EAttribute("name", EAttribute.STRING);
	public static EAttribute FEATURE_VALUE = new EAttribute("value", EAttribute.STRING);
	public static EAttribute FEATURE_FOREPART = new EAttribute("forepart", EAttribute.STRING);
	public static EAttribute FEATURE_PROPERTIES = new EAttribute("properties", EAttribute.STRING);

	private String name = null;
	private String value = null;
	private String forepart = null;
	private EMap<String> properties = new BasicEMap<String>(this, XFacet.FEATURE_PROPERTIES);

	public XInput() {
		super(Padang.createEClass(XCLASSNAME), new EFeature[] {
				XInput.FEATURE_NAME,
				XInput.FEATURE_VALUE,
				XInput.FEATURE_FOREPART,
				XInput.FEATURE_PROPERTIES
		});
	}

	public String getName() {
		return this.name;
	}

	public void setName(String newName) {
		String oldName = this.name;
		this.name = newName;
		this.eSetNotify(XInput.FEATURE_NAME, oldName, newName);
	}

	public String getValue() {
		return this.value;
	}

	public void setValue(String newValue) {
		String oldValue = this.value;
		this.value = newValue;
		this.eSetNotify(XInput.FEATURE_VALUE, oldValue, newValue);
	}

	public String getForepart() {
		return this.forepart;
	}

	public void setForepart(String newForepart) {
		String oldForepart = this.forepart;
		this.forepart = newForepart;
		this.eSetNotify(XInput.FEATURE_FOREPART, oldForepart, newForepart);
	}

	public EMap<String> getProperties() {
		return properties;
	}
}
