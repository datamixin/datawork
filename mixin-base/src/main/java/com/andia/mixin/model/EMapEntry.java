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

import java.util.Map.Entry;

public class EMapEntry<V> implements Entry<String, V> {

	private String key;
	private V value;

	private EObject owner;
	private EFeature feature;
	private String featureClassName;

	EMapEntry(String key, V value, EObject owner, EFeature feature, String featureClassName) {
		this.key = key;
		this.value = value;
		this.owner = owner;
		this.feature = feature;
		this.featureClassName = featureClassName;
	}

	public EObject eOwner() {
		return this.owner;
	}

	public EFeature eFeature() {
		return this.feature;
	}

	public String getFeatureClassName() {
		return this.featureClassName;
	}

	@Override
	public String getKey() {
		return this.key;
	}

	@Override
	public V getValue() {
		return this.value;
	}

	@Override
	public V setValue(V value) {
		return this.value = value;
	}
}
