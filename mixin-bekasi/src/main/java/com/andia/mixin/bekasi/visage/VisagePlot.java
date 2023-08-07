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
package com.andia.mixin.bekasi.visage;

import com.andia.mixin.value.MixinBrief;

public class VisagePlot extends VisageValue {

	private String type;
	private Object spec;

	public VisagePlot() {
		super(VisagePlot.class);
	}

	@Override
	public void init(Object source) {
		this.init((MixinBrief) source);
	}

	public void init(MixinBrief brief) {
		type = brief.getType();
		spec = brief.getValue();
	}

	public String getType() {
		return type;
	}

	public Object getSpec() {
		return spec;
	}

	@Override
	public String info() {
		return "{@Plot, type:'" + type + "'}";
	}

}
