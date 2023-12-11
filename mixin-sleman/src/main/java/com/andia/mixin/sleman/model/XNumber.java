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
package com.andia.mixin.sleman.model;

import com.andia.mixin.model.EAttribute;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.sleman.api.SNumber;

public class XNumber extends XConstant implements SNumber {

	public static String XCLASSNAME = Sleman.getEClassName("XNumber");

	public static EAttribute FEATURE_VALUE = new EAttribute("value", EAttribute.STRING);

	private Number value = null;

	public XNumber() {
		super(Sleman.createEClass(XCLASSNAME), new EFeature[] {
				FEATURE_VALUE
		});
	}

	public void setValue(Number newValue) {
		Number oldValue = this.value;
		this.value = newValue;
		this.eSetNotify(FEATURE_VALUE, oldValue, newValue);
	}

	@Override
	public Number getValue() {
		return value;
	}

	@Override
	public String toLiteral() {
		return value == null ? "" : value.toString();
	}

	@Override
	public String toString() {
		return toLiteral();
	}
}
