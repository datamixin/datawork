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
package com.andia.mixin.padang.garut.values;

import java.util.Iterator;
import java.util.List;

import com.andia.mixin.padang.garut.DataminerList;
import com.andia.mixin.padang.garut.DataminerValue;
import com.andia.mixin.padang.garut.converters.ValueConverterRegistry;
import com.andia.mixin.util.Timestamp;
import com.andia.mixin.value.MixinArray;
import com.andia.mixin.value.MixinList;
import com.andia.mixin.value.MixinListMetadata;

public class GarutList implements MixinList, MixinArray {

	private final GarutListMetadata metadata = new GarutListMetadata();
	private final DataminerList list;

	public GarutList(DataminerList list) {
		this.list = list;
	}

	@Override
	public Iterator<Object> iterator() {
		List<DataminerValue> elementList = list.getElementList();
		Iterator<DataminerValue> iterator = elementList.iterator();
		return new Iterator<Object>() {

			@Override
			public boolean hasNext() {
				return iterator.hasNext();
			}

			@Override
			public Object next() {
				DataminerValue next = iterator.next();
				Object object = getObject(next);
				return object;
			}

		};
	}

	private Object getObject(DataminerValue next) {
		ValueConverterRegistry factory = ValueConverterRegistry.getInstance();
		Object object = factory.toObject(next);
		return object;
	}

	@Override
	public String getElementType() {
		String type = list.getType();
		return type;
	}

	@Override
	public MixinArray toArray() {
		return this;
	}

	@Override
	public MixinListMetadata getMetadata() {
		return metadata;
	}

	@Override
	public int size() {
		return list.getElementCount();
	}

	@Override
	public Object get(int index) {
		DataminerValue object = list.getElement(index);
		Object value = getObject(object);
		if (value instanceof Timestamp) {
			return ((Timestamp) value).getTime();
		} else {
			return value;
		}
	}

	@Override
	public int indexOf(Object element) {
		List<DataminerValue> elementlist = list.getElementList();
		return elementlist.indexOf(element);
	}

}
