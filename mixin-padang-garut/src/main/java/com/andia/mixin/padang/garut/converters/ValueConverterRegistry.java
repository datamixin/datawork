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
package com.andia.mixin.padang.garut.converters;

import java.util.HashMap;
import java.util.Map;

import com.andia.mixin.padang.garut.DataminerObject;
import com.andia.mixin.padang.garut.DataminerValue;
import com.andia.mixin.padang.garut.DataminerValue.ValueCase;

public class ValueConverterRegistry {

	private static ValueConverterRegistry instance;

	private Map<Class<?>, ValueConverter> classes = new HashMap<>();
	private Map<Integer, ValueConverter> cases = new HashMap<>();

	private ValueConverterRegistry() {
		cases.put(DataminerValue.NUMBER_FIELD_NUMBER, NumberConverter.getInstance());
		cases.put(DataminerValue.LOGICAL_FIELD_NUMBER, BooleanConverter.getInstance());
		cases.put(DataminerValue.TEXT_FIELD_NUMBER, StringConverter.getInstance());
		cases.put(DataminerValue.ERROR_FIELD_NUMBER, ErrorConverter.getInstance());
		cases.put(DataminerValue.LIST_FIELD_NUMBER, ListConverter.getInstance());
		cases.put(DataminerValue.OBJECT_FIELD_NUMBER, ObjectConverter.getInstance());
		cases.put(DataminerValue.TABLE_FIELD_NUMBER, TableConverter.getInstance());
		cases.put(DataminerValue.BRIEF_FIELD_NUMBER, BriefConverter.getInstance());
		cases.put(DataminerValue.NONE_FIELD_NUMBER, NullConverter.getInstance());
		cases.put(DataminerValue.PLOT_FIELD_NUMBER, PlotConverter.getInstance());
	}

	public static ValueConverterRegistry getInstance() {
		if (instance == null) {
			instance = new ValueConverterRegistry();
		}
		return instance;
	}

	public Object toObject(DataminerValue value) {
		ValueCase valueCase = value.getValueCase();
		int number = valueCase.getNumber();
		ValueConverter converter = cases.get(number);
		if (converter != null) {
			Object object = converter.fromValue(value);
			return object;
		} else {
			return null;
		}
	}

	public Object fromOneOf(DataminerObject value) {
		Class<?> vClass = value.getClass();
		ValueConverter converter = classes.get(vClass);
		Object object = converter.fromProtobuf(value);
		return object;
	}

}
