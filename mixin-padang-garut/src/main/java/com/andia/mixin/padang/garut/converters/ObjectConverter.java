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

import com.andia.mixin.padang.garut.DataminerObject;
import com.andia.mixin.padang.garut.DataminerValue;
import com.andia.mixin.padang.garut.values.GarutObject;
import com.google.protobuf.AbstractMessage;

public class ObjectConverter implements ValueConverter {

	private static ObjectConverter instance;

	private ObjectConverter() {

	}

	public static ObjectConverter getInstance() {
		if (instance == null) {
			instance = new ObjectConverter();
		}
		return instance;
	}

	@Override
	public GarutObject fromValue(DataminerValue value) {
		DataminerObject object = value.getObject();
		return createObject(object);
	}

	public GarutObject createObject(DataminerObject object) {
		return new GarutObject(object);
	}

	@Override
	public GarutObject fromProtobuf(AbstractMessage value) {
		DataminerObject object = (DataminerObject) value;
		return createObject(object);
	}

}
