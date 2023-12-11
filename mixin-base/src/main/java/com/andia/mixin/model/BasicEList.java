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
package com.andia.mixin.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

public class BasicEList<E> extends EList<E> {

	private List<E> elements = new ArrayList<>();

	public BasicEList(EObject owner, EFeature feature) {
		super(owner, feature);
	}

	@Override
	public boolean isEmpty() {
		return elements.isEmpty();
	}

	@Override
	public boolean contains(Object o) {
		return elements.contains(o);
	}

	@Override
	public E get(int index) {
		return this.elements.get(index);
	}

	@Override
	public E set(int index, E element) {
		this.deleteFromContainer(element);
		E oldElement = this.elements.get(index);
		this.elements.set(index, element);
		this.owner.notify(Notification.SET, this.feature, oldElement, element, index, null);
		return element;
	}

	private void deleteFromContainer(E element) {
		if (element instanceof EObject) {
			EObject eObject = (EObject) element;
			EUtils.remove(eObject);
		}
	}

	@Override
	public void add(E element) {
		this.deleteFromContainer(element);
		this.elements.add(element);
		int position = this.elements.size() - 1;
		this.owner.notify(Notification.ADD, this.feature, null, element, position, null);
	}

	@Override
	public void add(int index, E element) {

		this.deleteFromContainer(element);

		if (index == this.elements.size()) {

			// Lakukan penambahan di bagian akhir
			this.elements.add(element);
			this.owner.notify(Notification.ADD, this.feature, null, element, index, null);

		} else if (index >= 0 && index < this.elements.size()) {

			// Lakukan penambahan di index tersebut
			this.elements.add(index, element);
			this.owner.notify(Notification.ADD, this.feature, null, element, index, null);

		}
	}

	@Override
	public void remove(Object element) {
		int index = this.elements.indexOf(element);
		remove(index);
	}

	@Override
	public E remove(int index) {
		E removed = this.elements.remove(index);
		if (removed != null) {
			this.owner.notify(Notification.REMOVE, this.feature, removed, null, index, null);
		}
		return removed;
	}

	@Override
	public void move(E element, int index) {
		int position = this.elements.indexOf(element);
		if (position != -1) {
			E removed = this.elements.remove(position);
			this.elements.add(index > position ? index - 1 : index, removed);
			this.owner.notify(Notification.MOVE, this.feature, element, element, index, null);
		}
	}

	@Override
	public int indexOf(Object element) {
		return this.elements.indexOf(element);
	}

	@Override
	public int size() {
		return this.elements.size();
	}

	private List<E> doClear() {
		List<E> elements = new ArrayList<E>();
		elements.addAll(this.elements);
		this.elements.clear();
		return elements;
	}

	@Override
	public void addAll(Collection<? extends E> source) {
		doAddAll(source);
		this.owner.notify(Notification.ADD_MANY, this.feature, null, source, -1, null);
	}

	private void doAddAll(Collection<? extends E> source) {
		for (E element : source) {
			this.deleteFromContainer(element);
		}
		this.elements.addAll(source);
	}

	@Override
	public void insertRange(Collection<? extends E> source, int start) {
		for (E element : source) {
			this.deleteFromContainer(element);
		}
		this.elements.addAll(start, source);
		this.owner.notify(Notification.ADD_MANY, this.feature, null, source, start, null);
	}

	@Override
	public void removeRange(int start, int end) {
		List<E> removed = new ArrayList<>();
		for (int i = start; i < end; i++) {
			E e = this.elements.get(i);
			removed.add(e);
		}
		this.elements.removeAll(removed);
		this.owner.notify(Notification.REMOVE_MANY, this.feature, removed, null, start, null);
	}

	@Override
	public void clear() {
		List<E> elements = doClear();
		this.owner.notify(Notification.REMOVE_MANY, this.feature, elements, null, -1, null);
	}

	@Override
	public void repopulate(Collection<? extends E> source) {
		List<E> removes = doClear();
		this.elements.addAll(source);
		this.owner.notify(Notification.REPLACE_MANY, this.feature, removes, source, -1, null);
	}

	@Override
	public Iterator<E> iterator() {
		return this.elements.iterator();
	}

	@Override
	public Object[] toArray() {
		return this.elements.toArray();
	}

}
