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
package com.andia.mixin.bekasi.reformer;

import java.util.Collection;
import java.util.Map;
import java.util.TreeMap;

public class ReformerRegistry {

	private TreeMap<Integer, Reformer> reformers = new TreeMap<>();

	protected void register(Reformer reformer) {
		int version = reformer.getVersion();
		reformers.put(version, reformer);
	}

	public int getLatestVersion() {
		Integer key = reformers.lastKey();
		return key.intValue();
	}

	public Collection<Reformer> getReformerSequence(int version) {
		int latestVersion = getLatestVersion();
		Map<Integer, Reformer> subMap = reformers.subMap(version, false, latestVersion, true);
		return subMap.values();
	}

	public int getVersions() {
		return reformers.size();
	}

}
