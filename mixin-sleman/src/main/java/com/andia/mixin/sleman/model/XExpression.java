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

import com.andia.mixin.model.BasicEObject;
import com.andia.mixin.model.EAttribute;
import com.andia.mixin.model.EClass;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.sleman.api.SExpression;
import com.andia.mixin.util.ArrayUtils;

public abstract class XExpression extends BasicEObject implements SExpression {

	public static EAttribute FEATURE_GROUP = new EAttribute("group", EAttribute.BOOLEAN);

	private boolean group = false;

	public XExpression(EClass eClass, EFeature[] features) {
		super(eClass, ArrayUtils.push(new EFeature[] {
				FEATURE_GROUP,
		}, features));
	}

	@Override
	public boolean isGroup() {
		return group;
	}

	public void setGroup(boolean newGroup) {
		boolean oldGroup = this.group;
		this.group = newGroup;
		this.eSetNotify(FEATURE_GROUP, oldGroup, newGroup);
	}

}
