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

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class BaseOutsetList<T extends Outset> implements OutsetList<T> {

	protected List<T> list = new ArrayList<>();

	@Override
	public void add(T child, int index) {
		list.add(index, child);
	}

	@Override
	public int indexOf(T child) {
		return list.indexOf(child);
	}

	@Override
	public void move(T child, int index) {
		list.remove(child);
		list.add(index, child);
	}

	@Override
	public T get(int index) {
		return list.get(index);
	}

	@Override
	public int size() {
		return list.size();
	}

	@Override
	public boolean remove(T child) {
		return list.remove(child);
	}

	@Override
	public Iterator<T> iterator() {
		return list.iterator();
	}

}
