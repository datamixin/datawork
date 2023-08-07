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
package com.andia.mixin.sleman;

public class ParserException extends Exception {

	private static final long serialVersionUID = 7297324302300172063L;

	private String literal;
	private int index;

	public ParserException(String message, String literal, int index) {
		super(message);
		this.literal = literal;
		this.index = index;
	}

	public String getLiteral() {
		return literal;
	}

	public int getIndex() {
		return index;
	}

}
