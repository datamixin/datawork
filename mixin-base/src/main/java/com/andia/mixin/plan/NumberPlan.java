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
package com.andia.mixin.plan;

public class NumberPlan extends ConstantPlan {

	private Number defaultValue = 0;

	public NumberPlan() {
		super(NumberPlan.class);
	}

	public NumberPlan(Number defaultValue) {
		this();
		this.defaultValue = defaultValue;
	}

	public void setDefaultValue(Number defaultValue) {
		this.defaultValue = defaultValue;
	}

	@Override
	public Number getDefaultValue() {
		return defaultValue;
	}
}
