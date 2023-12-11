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
package com.andia.mixin.padang.regulator;

import com.andia.mixin.model.EList;
import com.andia.mixin.padang.model.XDisplay;
import com.andia.mixin.padang.model.XMutation;
import com.andia.mixin.padang.outset.DisplayOutset;
import com.andia.mixin.rmo.EObjectRegulator;
import com.andia.mixin.util.ArrayUtils;

public abstract class DisplayRegulator extends EObjectRegulator {

	@Override
	public XDisplay getModel() {
		return (XDisplay) super.getModel();
	}

	@Override
	public DisplayOutset getOutset() {
		return (DisplayOutset) super.getOutset();
	}

	@Override
	protected Object[] getModelChildren() {
		XDisplay model = getModel();
		EList<XMutation> mutations = model.getMutations();
		Object[] children = super.getModelChildren();
		return ArrayUtils.push(children, mutations);
	}

}
