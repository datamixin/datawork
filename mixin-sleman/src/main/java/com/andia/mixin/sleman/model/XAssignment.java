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

import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EReference;
import com.andia.mixin.sleman.api.SAssignment;

public class XAssignment extends XArgument implements SAssignment {

	public static String XCLASSNAME = Sleman.getEClassName("XAssignment");

	public static EReference FEATURE_NAME = new EReference("name", XIdentifier.class);

	private XIdentifier name = null;

	public XAssignment() {
		super(Sleman.createEClass(XCLASSNAME), new EFeature[] {
				FEATURE_NAME,
		});
	}

	@Override
	public XIdentifier getName() {
		return this.name;
	}

	public void setName(XIdentifier newName) {
		XIdentifier oldName = this.name;
		this.name = newName;
		this.eSetNotify(FEATURE_NAME, oldName, newName);
	}

	@Override
	public String toString() {
		String string = super.toString();
		return this.name + "=" + string;
	}

}
