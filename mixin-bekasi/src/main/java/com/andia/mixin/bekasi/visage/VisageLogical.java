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

public class VisageLogical extends VisageConstant {

	private Boolean value;

	public VisageLogical() {
		super(VisageLogical.class);
	}

	public VisageLogical(boolean value) {
		this();
		init(value);
	}

	@Override
	public void init(Object source) {
		super.init(source);
		this.value = (Boolean) source;
	}

	public void init(Boolean value) {
		this.value = value;
	}

	public Boolean getValue() {
		return value;
	}

	@Override
	public String info() {
		return "{@class:Logical, value:'" + value + "'}";
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof VisageLogical) {
			VisageLogical logical = (VisageLogical) obj;
			return value.equals(logical.value);
		}
		return false;
	}

	@Override
	public String toString() {
		return "VisageLogical(" + value + ")";
	}

}
