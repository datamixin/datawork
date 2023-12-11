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
package com.andia.mixin.padang.garut.converters;

import com.andia.mixin.padang.garut.DataminerBrief;
import com.andia.mixin.padang.garut.DataminerValue;
import com.andia.mixin.padang.garut.values.GarutBrief;
import com.google.protobuf.AbstractMessage;

public class BriefConverter implements ValueConverter {

	private static BriefConverter instance;

	private BriefConverter() {

	}

	public static BriefConverter getInstance() {
		if (instance == null) {
			instance = new BriefConverter();
		}
		return instance;
	}

	@Override
	public Object fromValue(DataminerValue value) {
		DataminerBrief object = value.getBrief();
		return createBrief(object);
	}

	private GarutBrief createBrief(DataminerBrief object) {
		return new GarutBrief(object);
	}

	@Override
	public Object fromProtobuf(AbstractMessage value) {
		DataminerBrief object = (DataminerBrief) value;
		return createBrief(object);
	}

}
