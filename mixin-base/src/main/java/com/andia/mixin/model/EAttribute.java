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
package com.andia.mixin.model;

public class EAttribute extends EFeature {

	public final static String STRING = "String";
	public final static String NUMBER = "Number";
	public final static String BOOLEAN = "Boolean";

	private String type = null;

	public EAttribute(String id, String type) {
		super(id);
		this.type = type;
	}

	public String getType() {
		return this.type;
	}

}
