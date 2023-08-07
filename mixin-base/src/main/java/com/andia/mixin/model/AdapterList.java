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

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Object penampung khusus daftar adapter untuk mendukung fungsi EObject
 */
public class AdapterList implements Iterable<Adapter> {

	private List<Adapter> adapters = new ArrayList<>();

	public Adapter get(int index) {
		return this.adapters.get(index);
	}

	public int indexOf(Adapter adapter) {
		return this.adapters.indexOf(adapter);
	}

	public boolean add(Adapter adapter) {
		if (this.indexOf(adapter) == -1) {
			this.adapters.add(adapter);
			return true;
		} else {
			return false;
		}
	}

	public boolean remove(Adapter adapter) {
		int index = this.indexOf(adapter);
		if (index != -1) {
			this.adapters.remove(index);
			return true;
		} else {
			return false;
		}
	}

	public int size() {
		return this.adapters.size();
	}

	@Override
	public Iterator<Adapter> iterator() {
		return this.adapters.iterator();
	}

}
