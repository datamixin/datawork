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
package com.andia.mixin.base;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.andia.mixin.Options;
import com.andia.mixin.value.MixinTable;

public class MapOptions implements Options {

	protected Map<String, Object> options = new LinkedHashMap<>();

	public MapOptions() {
	}

	public MapOptions(Map<String, Object> map) {
		options.putAll(map);
	}

	public MapOptions(Options options) {
		Collection<String> names = options.getNames();
		for (String name : names) {
			Object value = options.getValue(name);
			this.options.put(name, value);
		}
	}

	public void setValue(String name, Object value) {
		this.options.put(name, value);
	}

	public void removeValue(String name) {
		options.remove(name);
	}

	@Override
	public Collection<String> getNames() {
		return options.keySet();
	}

	@Override
	public Object getValue(String name) {
		return options.get(name);
	}

	@Override
	public boolean containsName(String name) {
		return options.containsKey(name);
	}

	@Override
	public String getString(String name) {
		Object value = getValue(name);
		return (String) value;
	}

	@Override
	public Boolean getBoolean(String name) {
		Object value = getValue(name);
		return (Boolean) value;
	}

	@Override
	public Integer getInteger(String name) {
		Object value = getValue(name);
		return (Integer) value;
	}

	@Override
	public Float getFloat(String name) {
		Object value = getValue(name);
		return (Float) value;
	}

	@Override
	@SuppressWarnings("unchecked")
	public <T> List<T> getList(String name) {
		Object value = getValue(name);
		return (List<T>) value;
	}

	@Override
	@SuppressWarnings("unchecked")
	public <T> Map<String, T> getMap(String name) {
		Object value = getValue(name);
		return (Map<String, T>) value;
	}

	public MixinTable getTable(String name) {
		Object value = getValue(name);
		return (MixinTable) value;
	}

	@Override
	public String toString() {
		return options.toString();
	}

}
