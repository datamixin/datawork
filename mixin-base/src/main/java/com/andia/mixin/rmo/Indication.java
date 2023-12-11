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
package com.andia.mixin.rmo;

import com.andia.mixin.Lean;

public class Indication extends Lean {

	private String key;
	private FeaturePath path;
	private Lean[] values;

	public Indication(FeaturePath path, String key, Lean... values) {
		super(Indication.class);
		this.path = path;
		this.key = key;
		this.values = values;
	}

	public FeaturePath getPath() {
		return path;
	}

	public String getKey() {
		return key;
	}

	public Lean[] getValues() {
		return values;
	}

}
