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

import com.andia.mixin.value.MixinFunction;
import com.andia.mixin.value.MixinFunction.Type;

public class VisageFunction extends VisageValue {

	private Type type;
	private String literal;

	public VisageFunction() {
		super(VisageFunction.class);
	}

	@Override
	public void init(Object source) {
		super.init(source);
		MixinFunction function = (MixinFunction) source;
		this.type = function.getType();
		this.literal = function.getLiteral();
	}

	public Type getType() {
		return type;
	}

	public String getLiteral() {
		return literal;
	}

	@Override
	public String info() {
		return "{@class:Function, type:'" + type + "'}";
	}

	@Override
	public String toString() {
		return "VisageFunction(" + type + ": " + literal + ")";
	}

}
