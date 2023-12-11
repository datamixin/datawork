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
import com.andia.mixin.padang.model.XMixture;
import com.andia.mixin.padang.model.XPart;
import com.andia.mixin.padang.outset.MixtureOutset;

public class MixtureRegulator extends PartRegulator {

	@Override
	public XMixture getModel() {
		return (XMixture) super.getModel();
	}

	@Override
	public MixtureOutset getOutset() {
		return (MixtureOutset) super.getOutset();
	}

	@Override
	protected Object[] getModelChildren() {
		XMixture model = getModel();
		EList<XPart> parts = model.getParts();
		return new Object[] { parts };
	}

}
