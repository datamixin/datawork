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
package com.andia.mixin.rmo;

import java.util.HashMap;
import java.util.Map;

public abstract class Rectification {

	private String type;
	private Map<String, Object> data = new HashMap<>();

	public Rectification(String type) {
		this.type = type;
	}

	public String getType() {
		return type;
	}

	public void setData(String name, Object value) {
		this.data.put(name, value);
	}

	public Object getData(String name) {
		return this.data.get(name);
	}

}
