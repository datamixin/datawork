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
package com.andia.mixin.regulator;

import com.andia.mixin.model.MFlag;
import com.andia.mixin.model.MValue;
import com.andia.mixin.rmo.EObjectRegulator;

public class ValueRegulator extends EObjectRegulator {

	@Override
	public MValue getModel() {
		return (MValue) super.getModel();
	}

	@Override
	protected Object[] getModelChildren() {
		MValue model = getModel();
		MFlag flag = model.getFlag();
		return new Object[] { flag };
	}

}
