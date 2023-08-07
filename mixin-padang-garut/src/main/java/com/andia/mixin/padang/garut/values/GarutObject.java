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
package com.andia.mixin.padang.garut.values;

import com.andia.mixin.base.BaseObject;
import com.andia.mixin.padang.garut.DataminerObject;
import com.andia.mixin.padang.garut.DataminerProperty;
import com.andia.mixin.padang.garut.DataminerValue;
import com.andia.mixin.padang.garut.converters.ValueConverterRegistry;

public class GarutObject extends BaseObject {

	public GarutObject(DataminerObject object) {
		int count = object.getPropertyCount();
		for (int i = 0; i < count; i++) {
			DataminerProperty property = object.getProperty(i);
			String key = property.getKey();
			DataminerValue value = property.getValue();
			ValueConverterRegistry factory = ValueConverterRegistry.getInstance();
			Object field = factory.toObject(value);
			super.set(key, field);
		}
	}

}
