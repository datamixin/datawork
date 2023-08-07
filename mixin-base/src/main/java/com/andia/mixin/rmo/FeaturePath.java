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
import com.andia.mixin.util.ArrayUtils;

public class FeaturePath extends Lean {

	private FeatureKey[] keys = new FeatureKey[0];

	public FeaturePath() {
		super(FeaturePath.class);
	}

	public FeaturePath(FeatureKey... keys) {
		this();
		this.keys = keys;
	}

	public FeatureKey[] getKeys() {
		return keys;
	}

	public void setKeys(FeatureKey[] keys) {
		this.keys = keys;
	}

	public FeaturePath addPath(FeatureKey key) {
		this.keys = ArrayUtils.push(keys, key);
		return this;
	}

	public String toQualified() {
		String[] strings = new String[keys.length];
		for (int i = 0; i < strings.length; i++) {
			strings[i] = keys[i].toQualified();
		}
		return String.join("/", strings);
	}

	@Override
	public String toString() {
		return toQualified();
	}

}
