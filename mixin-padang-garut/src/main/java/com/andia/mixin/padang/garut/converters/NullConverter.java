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

import com.andia.mixin.padang.garut.DataminerValue;
import com.google.protobuf.AbstractMessage;

public class NullConverter implements ValueConverter {

	private static NullConverter instance;

	private NullConverter() {

	}

	public static NullConverter getInstance() {
		if (instance == null) {
			instance = new NullConverter();
		}
		return instance;
	}

	@Override
	public Object fromValue(DataminerValue value) {
		return null;
	}

	@Override
	public Object fromProtobuf(AbstractMessage value) {
		throw new UnsupportedOperationException();
	}

}
