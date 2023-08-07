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

import java.util.Collection;

public abstract class EList<E> extends EHolder implements Iterable<E> {

	public EList(EObject owner, EFeature feature) {
		super(owner, feature);
	}

	public abstract E get(int index);

	public abstract E set(int index, E element);

	public abstract boolean contains(Object o);

	public abstract int indexOf(Object object);

	public abstract boolean isEmpty();

	public abstract void add(E elemenet);

	public abstract void add(int index, E elemenet);

	public abstract E remove(int index);

	public abstract void remove(Object element);

	public abstract void clear();

	public abstract void addAll(Collection<? extends E> source);

	public abstract void removeRange(int start, int end);

	public abstract void insertRange(Collection<? extends E> source, int start);

	public abstract void move(E element, int index);

	public abstract int size();

	public abstract Object[] toArray();

	public abstract void repopulate(Collection<? extends E> source);

}
