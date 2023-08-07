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

public abstract class FeatureMark extends Lean {

	private FeaturePath path;
	private String name;

	protected FeatureMark(Class<?> beanClass) {
		super(beanClass);
	}

	protected FeatureMark(Class<?> beanClass, FeaturePath path, String name) {
		this(beanClass);
		this.path = path;
		this.name = name;
	}

	public void setPath(FeaturePath path) {
		this.path = path;
	}

	public FeaturePath getPath() {
		return path;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	@Override
	public String toString() {
		String qualified = path == null ? "null path" : this.path.toQualified();
		return qualified + ":" + name;
	}

}
