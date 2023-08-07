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
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

public class BasicEMap<V> extends EMap<V> {

	private Map<String, V> map = new LinkedHashMap<>();

	public BasicEMap(EObject owner, EFeature feature) {
		super(owner, feature);
	}

	@Override
	public boolean containsKey(Object key) {
		return this.map.containsKey(key);
	}

	@Override
	public V get(Object key) {
		return this.map.get(key);
	}

	@Override
	public V put(String key, V value) {
		this.deleteFromContainer(value);
		this.map.put(key, value);
		V oldElement = this.map.get(key);
		this.owner.notify(Notification.SET, this.feature, oldElement, value, -1, key);
		return value;
	}

	@Override
	public void putAll(Map<? extends String, ? extends V> source) {
		Set<? extends String> keys = source.keySet();
		for (String key : keys) {
			V oldElement = this.map.get(key);
			V value = source.get(key);
			this.deleteFromContainer(value);
			this.map.put(key, value);
			this.owner.notify(Notification.SET, this.feature, oldElement, value, -1, key);
		}
	}

	@Override
	public Set<String> keySet() {
		return this.map.keySet();
	}

	@Override
	public Set<Entry<String, V>> entrySet() {
		return this.map.entrySet();
	}

	private void deleteFromContainer(V value) {
		if (value instanceof EObject) {
			EObject eObject = (EObject) value;
			EUtils.remove(eObject);
		}
	}

	@Override
	public V remove(Object key) {
		V value = this.map.get(key);
		if (value != null) {
			this.owner.notify(Notification.REMOVE, this.feature, value, null, -1, (String) key);
		}
		return value;
	}

	@Override
	public int size() {
		return this.map.size();
	}

	@Override
	public void clear() {
		Map<String, V> removes = this.doClear();
		this.owner.notify(Notification.REMOVE_MANY, this.feature, removes, null, -1, null);
	}

	private Map<String, V> doClear() {
		Map<String, V> removes = new LinkedHashMap<>();
		for (String key : this.map.keySet()) {
			V v = this.map.get(key);
			removes.put(key, v);
		}
		return removes;
	}

	@Override
	public boolean removeValue(V value) {
		Set<String> keys = this.keySet();
		for (String key : keys) {
			V val = this.map.get(key);
			if (val == value) {
				remove(key);
				return true;
			}
		}
		return false;
	}

	@Override
	public boolean isEmpty() {
		return this.map.isEmpty();
	}

	@Override
	public boolean containsValue(Object value) {
		return this.map.containsKey(value);
	}

	@Override
	public Collection<V> values() {
		return this.map.values();
	}

	@Override
	public void repopulate(Map<String, ? extends V> source) {
		Map<String, V> doClear = this.doClear();
		Set<String> keys = source.keySet();
		for (String key : keys) {
			V value = source.get(key);
			this.deleteFromContainer(value);
			this.map.put(key, value);
		}
		this.owner.notify(Notification.REPLACE_MANY, this.feature, doClear, source, -1, null);
	}

	@Override
	public String toString() {
		return this.map.toString();
	}

}
