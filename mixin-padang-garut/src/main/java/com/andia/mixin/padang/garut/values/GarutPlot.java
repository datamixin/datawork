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

import com.andia.mixin.base.BasePlot;
import com.andia.mixin.padang.garut.DataminerPlot;
import com.andia.mixin.padang.garut.DataminerValue;
import com.andia.mixin.padang.garut.converters.ValueConverterRegistry;

public class GarutPlot extends BasePlot {

	public GarutPlot(DataminerPlot brief) {
		readType(brief);
		readValue(brief);
	}

	private void readType(DataminerPlot brief) {
		String typeString = brief.getType();
		setType(typeString);
	}

	private void readValue(DataminerPlot plot) {
		DataminerValue value = plot.getSpec();
		ValueConverterRegistry factory = ValueConverterRegistry.getInstance();
		Object object = factory.toObject(value);
		setSpec(object);
	}

}
