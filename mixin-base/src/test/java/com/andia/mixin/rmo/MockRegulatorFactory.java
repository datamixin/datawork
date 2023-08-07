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
package com.andia.mixin.rmo;

import com.andia.mixin.model.MEdge;
import com.andia.mixin.model.MFlag;
import com.andia.mixin.model.MGraph;
import com.andia.mixin.model.MNode;
import com.andia.mixin.model.MValue;
import com.andia.mixin.regulator.EdgeRegulator;
import com.andia.mixin.regulator.FlagRegulator;
import com.andia.mixin.regulator.GraphRegulator;
import com.andia.mixin.regulator.NodeRegulator;
import com.andia.mixin.regulator.ValueRegulator;

public class MockRegulatorFactory extends BaseRegulatorFactory {

	public MockRegulatorFactory() {

		register(MGraph.XCLASSNAME, GraphRegulator.class);
		register(MNode.XCLASSNAME, NodeRegulator.class);
		register(MEdge.XCLASSNAME, EdgeRegulator.class);
		register(MValue.XCLASSNAME, ValueRegulator.class);
		register(MFlag.XCLASSNAME, FlagRegulator.class);

		registerList(MGraph.XCLASSNAME, MGraph.FEATURE_NODES, EListRegulator.class);
		registerList(MGraph.XCLASSNAME, MGraph.FEATURE_EDGES, EListRegulator.class);

	}

	public void clear() {
		regulators.clear();
	}
}
