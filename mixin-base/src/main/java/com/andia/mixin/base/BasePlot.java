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
package com.andia.mixin.base;

import com.andia.mixin.value.MixinPlot;
import com.andia.mixin.value.MixinType;

public abstract class BasePlot implements MixinPlot {

	private String type;
	private Object spec;

	public BasePlot() {

	}

	public BasePlot(Class<?> type, boolean simple, String source, String digest, String key, Object value) {
		this(MixinType.getType(type).name(), simple, source, digest, key, value);
	}

	public BasePlot(String type, boolean simple, String source, String digest, String key, Object value) {
		this.type = type;
		this.spec = value;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Override
	public String getType() {
		return type;
	}

	public void setSpec(Object spec) {
		this.spec = spec;
	}

	@Override
	public Object getSpec() {
		return spec;
	}

}
