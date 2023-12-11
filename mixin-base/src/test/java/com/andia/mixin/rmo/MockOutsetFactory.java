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
package com.andia.mixin.rmo;

import com.andia.mixin.model.EFeature;
import com.andia.mixin.model.MEdge;
import com.andia.mixin.model.MFlag;
import com.andia.mixin.model.MGraph;
import com.andia.mixin.model.MNode;
import com.andia.mixin.model.MValue;
import com.andia.mixin.outset.EdgeOutset;
import com.andia.mixin.outset.FlagOutset;
import com.andia.mixin.outset.GraphOutset;
import com.andia.mixin.outset.NodeOutset;
import com.andia.mixin.outset.ValueOutset;

public class MockOutsetFactory extends BaseOutsetFactory {

	public MockOutsetFactory() {

		register(MGraph.XCLASSNAME, GraphOutset.class);
		register(MNode.XCLASSNAME, NodeOutset.class);
		register(MEdge.XCLASSNAME, EdgeOutset.class);
		register(MValue.XCLASSNAME, ValueOutset.class);
		register(MFlag.XCLASSNAME, FlagOutset.class);

		registerList(MGraph.XCLASSNAME, MGraph.FEATURE_NODES, BaseOutsetList.class);
		registerList(MGraph.XCLASSNAME, MGraph.FEATURE_EDGES, BaseOutsetList.class);
	}

	public void clear() {
		outsets.clear();
	}

	public void remove(String className, EFeature feature) {
		String key = asFeatureKey(className, feature);
		outsets.remove(key);
	}

}
