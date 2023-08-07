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

import com.andia.mixin.Lean;

public final class Modification extends Lean {

	private FeaturePath path;
	private int type;
	private Object oldValue;
	private Object newValue;

	public Modification() {
		super(Modification.class);
	}

	public Modification(FeaturePath featurePath, int type, Object oldValue, Object newValue) {
		this();
		this.path = featurePath;
		this.type = type;
		this.oldValue = oldValue;
		this.newValue = newValue;
	}

	public Modification(FeaturePath path, int type) {
		this(path, type, null, null);
	}

	public void setPath(FeaturePath path) {
		this.path = path;
	}

	public FeaturePath getPath() {
		return path;
	}

	public void setType(int type) {
		this.type = type;
	}

	public int getType() {
		return type;
	}

	public void setOldValue(Object oldValue) {
		this.oldValue = oldValue;
	}

	public Object getOldValue() {
		return oldValue;
	}

	public void setNewValue(Object newValue) {
		this.newValue = newValue;
	}

	public Object getNewValue() {
		return newValue;
	}

	@Override
	public String toString() {
		return "Modification{path='" + path + "', type=" + type + ", "
				+ "oldValue=" + oldValue + ", newValue=" + newValue + "}";
	}
}
