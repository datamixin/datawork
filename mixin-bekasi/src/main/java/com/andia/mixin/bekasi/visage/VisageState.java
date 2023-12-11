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
package com.andia.mixin.bekasi.visage;

public final class VisageState extends VisageValue {

	private String type;
	private Object value;

	public VisageState() {
		super(VisageState.class);
	}

	public VisageState(String type, Object value) {
		this();
		this.type = type;
		this.value = value;
	}

	public String getType() {
		return type;
	}

	public Object getValue() {
		return value;
	}

	@Override
	public String info() {
		return "{@class:State, type:" + type + ", value:" + value + "}";
	}

}
