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

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;

import com.andia.mixin.Measurable;
import com.andia.mixin.value.MixinArray;
import com.andia.mixin.value.MixinList;
import com.andia.mixin.value.MixinObject;
import com.andia.mixin.value.MixinText;
import com.andia.mixin.value.MixinValueException;

public abstract class BaseObject extends BaseValue implements MixinObject, Measurable {

	private Map<String, Object> fields = new LinkedHashMap<>();

	@Override
	public Collection<String> fieldNames() {
		return fields.keySet();
	}

	@Override
	public boolean isExists(String name) {
		return fields.containsKey(name);
	}

	@Override
	public int fieldCount() {
		return fields.size();
	}

	@Override
	public Object get(String name) {
		return fields.get(name);
	}

	public void set(String name, Object field) {
		fields.put(name, field);
	}

	public Collection<Object> fieldValues() {
		return fields.values();
	}

	@Override
	public Boolean getBoolean(String name) {
		Object object = fields.get(name);
		if (object instanceof Boolean) {
			return (Boolean) object;
		} else {
			throw new MixinValueException("Expected '" + name + "' field as logical or boolean");
		}
	}

	@Override
	public Float getFloat(String name) {
		Object object = fields.get(name);
		if (object instanceof Float) {
			return (Float) object;
		} else if (object instanceof Number) {
			return ((Number) object).floatValue();
		} else {
			throw new MixinValueException("Expected '" + name + "' field as float or number");
		}
	}

	@Override
	public Integer getInteger(String name) {
		Object object = fields.get(name);
		if (object instanceof Integer) {
			return (Integer) object;
		} else if (object instanceof Number) {
			return ((Number) object).intValue();
		} else {
			throw new MixinValueException("Expected '" + name + "' field as integer or number");
		}
	}

	@Override
	public String getString(String name) {
		Object object = fields.get(name);
		if (object instanceof String) {
			return (String) object;
		} else if (object instanceof MixinText) {
			MixinText text = (MixinText) object;
			return text.getValue();
		} else {
			throw new MixinValueException("Expected '" + name + "' field as string");
		}
	}

	@Override
	public MixinList getList(String name) {
		Object object = fields.get(name);
		if (object instanceof MixinList) {
			return (MixinList) object;
		} else {
			throw new MixinValueException("Expected '" + name + "' field as list");
		}
	}

	@Override
	public MixinArray getArray(String field) {
		MixinList list = this.getList(field);
		return list.toArray();
	}

	@Override
	public MixinObject getObject(String name) {
		Object object = fields.get(name);
		if (object instanceof MixinObject) {
			return (MixinObject) object;
		} else {
			throw new MixinValueException("Expected '" + name + "' field as object");
		}
	}

}
