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
package com.andia.mixin.bekasi.visage;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

import com.andia.mixin.Lean;
import com.andia.mixin.value.MixinList;
import com.andia.mixin.value.MixinListMetadata;
import com.andia.mixin.value.MixinType;
import com.fasterxml.jackson.annotation.JsonProperty;

public class VisageList extends VisageValue implements Iterable<Lean> {

	private VisageListMetadata metadata = new VisageListMetadata();
	private String itemType = MixinType.MIXINOBJECT.name();

	@JsonProperty
	private List<Lean> values = new ArrayList<>();

	public VisageList() {
		super(VisageList.class);
	}

	public VisageList(Object list) {
		this();
		init(list);
	}

	@Override
	public void init(Object source) {
		super.init(source);
		if (source instanceof MixinList) {
			MixinList list = (MixinList) source;
			readMetadata(list);
			readList(list);
		} else if (source instanceof Object[]) {
			Object[] list = (Object[]) source;
			metadata.setPartElementCount(list.length);
			readList(list);
		} else {
			Collection<?> list = (Collection<?>) source;
			metadata.setPartElementCount(list.size());
			readCollection(list);
		}
	}

	private void readMetadata(MixinList list) {
		MixinListMetadata metadata = list.getMetadata();
		this.metadata = new VisageListMetadata(metadata);
	}

	private void readList(MixinList list) {
		itemType = list.getElementType();
		Iterator<?> iterator = list.iterator();
		while (iterator.hasNext()) {
			Object next = iterator.next();
			add(next);
		}
	}

	private void readCollection(Collection<?> collection) {
		for (Object object : collection) {
			add(object);
		}
	}

	private void readList(Object[] list) {
		for (Object object : list) {
			add(object);
		}
	}

	public VisageListMetadata getMetadata() {
		return metadata;
	}

	public String getItemType() {
		return itemType;
	}

	public List<Lean> getValues() {
		return values;
	}

	public Lean get(int index) {
		return values.get(index);
	}

	public void add(Lean value) {
		values.add(value);
	}

	public void add(Object... array) {
		for (Object element : array) {
			if (element instanceof Lean) {
				add((Lean) element);
			} else {
				VisageValueFactory factory = VisageValueFactory.getInstance();
				VisageValue value = factory.create(element);
				values.add(value);
			}
		}
	}

	public int size() {
		return values.size();
	}

	@Override
	public String info() {
		return "{@class:List, size:'" + values.size() + "'}";
	}

	@Override
	public Iterator<Lean> iterator() {
		return values.iterator();
	}

	public void clear() {
		values.clear();
	}

	@Override
	public String toString() {
		return "VisageList(" + values + ")";
	}

}
