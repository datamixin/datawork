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

import com.andia.mixin.value.MixinType;

public class VisageType extends VisageValue {

	private String name;

	public VisageType() {
		super(VisageType.class);
	}

	public VisageType(String string) {
		this();
		this.init(string);
	}

	@Override
	public void init(Object source) {
		super.init(source);
		if (source instanceof MixinType) {
			MixinType type = (MixinType) source;
			name = type.name();
		}
	}

	private void init(String source) {
		this.name = source;
	}

	public String getName() {
		return name;
	}

	@Override
	public String info() {
		int length = name.length();
		Object characters = name == null ? null : length;
		return "{@class:Type, name:" + characters + "}";
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof VisageType) {
			VisageType type = (VisageType) obj;
			return name.equals(type.name);
		}
		return false;
	}

	@Override
	public String toString() {
		return "VisageText(" + name + ")";
	}

}
