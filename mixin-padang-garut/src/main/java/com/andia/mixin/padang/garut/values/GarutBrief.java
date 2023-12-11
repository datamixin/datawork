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
package com.andia.mixin.padang.garut.values;

import com.andia.mixin.base.BaseBrief;
import com.andia.mixin.padang.garut.DataminerBrief;
import com.andia.mixin.padang.garut.DataminerValue;
import com.andia.mixin.padang.garut.converters.ValueConverterRegistry;
import com.andia.mixin.padang.garut.util.TypeUtils;
import com.andia.mixin.value.MixinType;

public class GarutBrief extends BaseBrief {

	public GarutBrief(DataminerBrief brief) {
		readType(brief);
		setSimple(brief.getSimple());
		setChildren(brief.getChildren());
		setPropose(brief.getPropose());
		setDigest(brief.getDigest());
		readValue(brief);
		setKey(brief.getKey());
	}

	private void readType(DataminerBrief brief) {
		String typeString = brief.getType();
		MixinType type = TypeUtils.getType(typeString);
		if (type == MixinType.ANY) {
			setType(typeString);
		} else {
			setType(type.name());
		}
	}

	private void readValue(DataminerBrief brief) {
		DataminerValue value = brief.getValue();
		ValueConverterRegistry factory = ValueConverterRegistry.getInstance();
		Object object = factory.toObject(value);
		setValue(object);
	}

}
