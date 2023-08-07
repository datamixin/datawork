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

import com.andia.mixin.padang.garut.DataminerNumber;
import com.andia.mixin.padang.garut.DataminerNumber.ValueCase;
import com.andia.mixin.padang.garut.DataminerValue;
import com.andia.mixin.util.Date;
import com.andia.mixin.util.DateTime;
import com.andia.mixin.util.Timestamp;
import com.google.protobuf.AbstractMessage;

public class NumberConverter implements ValueConverter {

	private static NumberConverter instance;

	private NumberConverter() {

	}

	public static NumberConverter getInstance() {
		if (instance == null) {
			instance = new NumberConverter();
		}
		return instance;
	}

	@Override
	public Object fromValue(DataminerValue value) {
		DataminerNumber number = value.getNumber();
		ValueCase valueCase = number.getValueCase();
		int caseNumber = valueCase.getNumber();
		if (caseNumber == DataminerNumber.INT32_FIELD_NUMBER) {
			return number.getInt32();
		} else if (caseNumber == DataminerNumber.INT64_FIELD_NUMBER) {
			long int64 = number.getInt64();
			String subtype = number.getSubtype();
			if (subtype.equals("timestamp")) {
				return new Timestamp(int64);
			} else if (subtype.equals("datetime")) {
				return new DateTime(int64);
			} else if (subtype.equals("date")) {
				return new Date(int64);
			} else {
				return int64;
			}
		} else if (caseNumber == DataminerNumber.FLOAT_FIELD_NUMBER) {
			return number.getFloat();
		} else if (caseNumber == DataminerNumber.DOUBLE_FIELD_NUMBER) {
			return number.getDouble();
		} else {
			return 0.0;
		}
	}

	@Override
	public Object fromProtobuf(AbstractMessage value) {
		throw new UnsupportedOperationException();
	}

}
