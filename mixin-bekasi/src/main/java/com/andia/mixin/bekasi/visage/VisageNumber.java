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

import com.andia.mixin.util.Date;
import com.andia.mixin.util.DateTime;
import com.andia.mixin.util.Elapsed;
import com.andia.mixin.util.Time;
import com.andia.mixin.util.Timestamp;

public class VisageNumber extends VisageConstant {

	private Number value;
	private String subtype;

	public VisageNumber() {
		super(VisageNumber.class);
	}

	public VisageNumber(Number value) {
		this();
		init(value);
	}

	@Override
	public void init(Object source) {
		super.init(source);
		subtype = getSubtype(source);
		if (source instanceof Number) {
			value = (Number) source;
		} else if (source instanceof Date) {
			Date timestamp = (Date) source;
			value = timestamp.getTime();
		} else if (source instanceof Time) {
			Time timestamp = (Time) source;
			value = timestamp.getTime();
		} else if (source instanceof DateTime) {
			DateTime timestamp = (DateTime) source;
			value = timestamp.getTime();
		} else if (source instanceof Timestamp) {
			Timestamp timestamp = (Timestamp) source;
			value = timestamp.getTime();
		} else if (source instanceof Elapsed) {
			Elapsed elapsed = (Elapsed) source;
			value = elapsed.getTime();
		}
	}

	private String getSubtype(Object value) {
		Class<? extends Object> valueClass = value.getClass();
		String simpleName = valueClass.getSimpleName();
		return simpleName.toUpperCase();
	}

	public Number getValue() {
		return value;
	}

	public String getSubtype() {
		return subtype;
	}

	@Override
	public String info() {
		return "{@class:Number, subtype:'" + subtype + "', value:" + value + "}";
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof VisageNumber) {
			VisageNumber number = (VisageNumber) obj;
			return value.equals(number.value);
		}
		return false;
	}

	@Override
	public String toString() {
		return "VisageNumber(" + subtype + ": " + value + ")";
	}

}
