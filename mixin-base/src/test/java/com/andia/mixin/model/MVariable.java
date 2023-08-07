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
package com.andia.mixin.model;

public class MVariable extends MFacet {

	public static String XCLASSNAME = Mock.getEClassName("MVariable");

	public static EReference FEATURE_VALUE = new EReference("value", MValue.class);

	public MValue value = null;

	public MVariable() {
		super(Mock.createEClass(XCLASSNAME), new EFeature[] {
				FEATURE_VALUE
		});
	}

	public MValue getValue() {
		return value;
	}

	public void setValue(MValue newValue) {
		MValue oldValue = this.value;
		this.value = newValue;
		this.eSetNotify(FEATURE_VALUE, oldValue, newValue);
	}

}
