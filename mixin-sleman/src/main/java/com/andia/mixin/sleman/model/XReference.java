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
package com.andia.mixin.sleman.model;

import com.andia.mixin.model.EAttribute;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.sleman.api.SReference;
import com.andia.mixin.sleman.base.ExpressionParser;

public class XReference extends XPointer implements SReference {

	public static String XCLASSNAME = Sleman.getEClassName("XReference");

	public static EAttribute FEATURE_NAME = new EAttribute("name", EAttribute.STRING);

	private String name;

	public XReference() {
		super(Sleman.createEClass(XReference.XCLASSNAME), new EFeature[] {
				XReference.FEATURE_NAME,
		});
	}

	@Override
	public String getName() {
		return this.name;
	}

	public void setName(String newName) {
		String oldName = this.name;
		this.name = newName;
		this.eSetNotify(FEATURE_NAME, oldName, newName);
	}

	@Override
	public String toLiteral() {
		String name = ExpressionParser.promoteBacktick(this.name);
		return name;
	}

	@Override
	public String toString() {
		return this.toLiteral();
	}

}
