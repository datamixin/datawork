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
package com.andia.mixin.value.function;

import java.io.Serializable;

import com.andia.mixin.value.MixinFunction;

public class LambdaFunction implements MixinFunction, Serializable {

	private static final long serialVersionUID = -6762631773489913081L;

	private String literal;

	public LambdaFunction(String literal) {
		this.literal = literal;
	}

	@Override
	public Type getType() {
		return Type.LAMBDA;
	}

	@Override
	public String getLiteral() {
		return literal;
	}

}
