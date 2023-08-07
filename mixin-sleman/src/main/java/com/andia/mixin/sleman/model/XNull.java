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

import com.andia.mixin.model.EFeature;
import com.andia.mixin.sleman.api.SNull;

public class XNull extends XConstant implements SNull {

	public static String XCLASSNAME = Sleman.getEClassName("XNull");

	public XNull() {
		super(Sleman.createEClass(XCLASSNAME), new EFeature[] {

		});
	}

	@Override
	public String toLiteral() {
		return "null";
	}

	@Override
	public String toString() {
		return toLiteral();
	}

	@Override
	public Object getValue() {
		return null;
	}
}
