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
package com.andia.mixin.bekasi.webface.converters;

import javax.ws.rs.ext.ParamConverter;

import com.andia.mixin.model.EObject;
import com.andia.mixin.model.EObjectSerde;
import com.andia.mixin.model.EObjectSerdeException;
import com.andia.mixin.model.EPackage;

public final class EObjectJsonParamConverter implements ParamConverter<EObject> {

	private final EObjectSerde<EObject> serde;

	public EObjectJsonParamConverter(EPackage packages) {
		serde = new EObjectSerde<>(packages);
	}

	@Override
	public EObject fromString(String json) {
		try {
			return serde.deserialize(json);
		} catch (EObjectSerdeException e) {
			throw new RuntimeException("Fail deserializing from json", e);
		}
	}

	@Override
	public String toString(EObject object) {
		try {
			return serde.serialize(object);
		} catch (EObjectSerdeException e) {
			throw new RuntimeException("Fail serializing to json", e);
		}
	}

	public EObjectSerde<EObject> getSerde() {
		return serde;
	}

}