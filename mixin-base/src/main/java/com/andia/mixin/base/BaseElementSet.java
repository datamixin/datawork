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
package com.andia.mixin.base;

import java.util.Iterator;
import java.util.List;

import com.andia.mixin.value.MixinElementSet;

public class BaseElementSet implements MixinElementSet {

	private Iterator<?> iterator;

	public BaseElementSet(List<?> list) {
		iterator = list.iterator();
	}

	@Override
	public boolean next() {
		return iterator.hasNext();
	}

	@Override
	@SuppressWarnings("unchecked")
	public <T> T getElement() {
		return (T) iterator.next();
	}

}
