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
package com.andia.mixin.bekasi.manifest;

import java.util.Map;
import java.util.TreeMap;

import com.andia.mixin.Lean;

public class ManifestRegistry extends Lean {

	private Map<String, Manifest> manifestMap = new TreeMap<>();

	public ManifestRegistry() {
		super(ManifestRegistry.class);
	}

	public Map<String, Manifest> getManifestMap() {
		return manifestMap;
	}

	public void register(Manifest manifest) {
		String name = manifest.getName();
		manifestMap.put(name, manifest);
	}

}
