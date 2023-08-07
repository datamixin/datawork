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
import com.andia.mixin.model.EClass;
import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.EList;
import com.andia.mixin.model.EReference;
import com.andia.mixin.util.ArrayUtils;

public abstract class XReceipt extends XForesee {

	public static EReference FEATURE_INPUTS = new EReference("inputs", XInput.class);

	private EList<XInput> inputs = new BasicEList<XInput>(this, XReceipt.FEATURE_INPUTS);

	public XReceipt(EClass xClass, EFeature[] features) {
		super(xClass, ArrayUtils.push(new EFeature[] {
				XReceipt.FEATURE_INPUTS,
		}, features));
	}

	public EList<XInput> getInputs() {
		return this.inputs;
	}

}
