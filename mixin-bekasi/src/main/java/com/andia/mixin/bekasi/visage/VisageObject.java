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
package com.andia.mixin.bekasi.visage;

import java.lang.reflect.Method;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;

import com.andia.mixin.util.MethodUtils;
import com.andia.mixin.value.MixinArray;
import com.andia.mixin.value.MixinList;
import com.andia.mixin.value.MixinObject;

public class VisageObject extends VisageValue implements MixinObject {

	private Map<String, VisageValue> fields = new LinkedHashMap<>();

	public VisageObject() {
		super(VisageObject.class);
	}

	public VisageObject(Object source) {
		this();
		init(source);
	}

	@Override
	public void init(Object source) {
		super.init(source);
		if (source instanceof MixinObject) {
			MixinObject resultObject = (MixinObject) source;
			readObject(resultObject);
		} else {
			readPlain(source);
		}
	}

	private void readObject(MixinObject object) {
		Collection<String> names = object.fieldNames();
		for (String name : names) {
			try {
				Object field = object.get(name);
				VisageValue value = convert(field);
				setField(name, value);
			} catch (Exception e) {
				setField(name, new VisageError(e));
			}
		}
	}

	private void readPlain(Object object) {
		Class<? extends Object> objectClass = object.getClass();
		for (Method method : objectClass.getDeclaredMethods()) {

			// Method ada parameter buat bean field accessor
			int parameterCount = method.getParameterCount();
			if (parameterCount > 0) {
				continue;
			}

			// Ambil field name jika 'get' atau 'is'
			String name = method.getName();
			String fieldName = MethodUtils.checkGetOrIsField(name);

			// Field name null berarti buat bean field
			if (fieldName != null) {
				try {
					Object result = method.invoke(object);
					setField(fieldName, result);
				} catch (Exception e) {
					setField(fieldName, new VisageError(e));
				}
			}

		}
	}

	public Map<String, VisageValue> getFields() {
		return fields;
	}

	public VisageValue getField(String name) {
		return fields.get(name);
	}

	public void setField(String name, VisageValue value) {
		fields.put(name, value);
	}

	public void setField(String name, Object object) {
		if (object instanceof VisageValue) {
			setField(name, (VisageValue) object);
		} else {
			VisageValue value = convert(object);
			setField(name, value);
		}
	}

	private VisageValue convert(Object object) {
		VisageValueFactory factory = VisageValueFactory.getInstance();
		VisageValue value = factory.create(object);
		return value;
	}

	@Override
	public Collection<String> fieldNames() {
		return fields.keySet();
	}

	@Override
	public int fieldCount() {
		return fields.size();
	}

	@Override
	public Object get(String name) {
		return fields.get(name);
	}

	@Override
	public Boolean getBoolean(String field) {
		return ((VisageLogical) fields.get(field)).getValue();
	}

	@Override
	public Integer getInteger(String field) {
		return ((VisageNumber) fields.get(field)).getValue().intValue();
	}

	@Override
	public Float getFloat(String field) {
		return ((VisageNumber) fields.get(field)).getValue().floatValue();
	}

	@Override
	public String getString(String field) {
		return ((VisageText) fields.get(field)).getValue();
	}

	@Override
	public MixinList getList(String field) {
		return (MixinList) fields.get(field);
	}

	@Override
	public MixinArray getArray(String field) {
		MixinList list = this.getList(field);
		return list.toArray();
	}

	@Override
	public VisageObject getObject(String field) {
		return (VisageObject) fields.get(field);
	}

	@Override
	public boolean isExists(String field) {
		return fields.containsKey(field);
	}

	@Override
	public String info() {
		return "{@class:Object, fields:" + fields.size() + "}";
	}

	@Override
	public String toString() {
		return "VisageObject(" + fields + ")";
	}

}
