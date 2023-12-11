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

import com.andia.mixin.value.MixinColumn;
import com.andia.mixin.value.MixinType;

public abstract class BaseColumn implements MixinColumn {

	private Object key;
	private String type;

	public BaseColumn() {

	}

	public BaseColumn(String key, Class<?> type) {
		this(key, MixinType.getType(type).name());
	}

	public BaseColumn(String key, String type) {
		this.key = key;
		this.type = type;
	}

	public BaseColumn(String name) {
		this(name, String.class);
	}

	public BaseColumn(MixinColumn column) {
		this.key = column.getKey();
		this.type = column.getType();
	}

	public void setKey(String key) {
		this.key = key;
	}

	@Override
	public Object getKey() {
		return key;
	}

	public void setType(Class<?> columnClass) {
		this.type = MixinType.getType(columnClass).name();
	}

	@Override
	public String getType() {
		return type;
	}

}
