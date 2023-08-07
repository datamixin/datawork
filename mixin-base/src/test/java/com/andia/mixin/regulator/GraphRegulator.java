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
package com.andia.mixin.regulator;

import com.andia.mixin.model.Adapter;
import com.andia.mixin.model.ContentAdapter;
import com.andia.mixin.model.EList;
import com.andia.mixin.model.MEdge;
import com.andia.mixin.model.MGraph;
import com.andia.mixin.model.MNode;
import com.andia.mixin.model.MValue;
import com.andia.mixin.model.Notification;
import com.andia.mixin.outset.GraphOutset;
import com.andia.mixin.rmo.EObjectRegulator;

public class GraphRegulator extends EObjectRegulator {

	private ContentAdapter adapter = new GraphContentAdapter();

	@Override
	public MGraph getModel() {
		return (MGraph) super.getModel();
	}

	@Override
	public GraphOutset getOutset() {
		return (GraphOutset) super.getOutset();
	}

	@Override
	protected Object[] getModelChildren() {
		MGraph model = getModel();
		EList<MNode> nodes = model.getNodes();
		EList<MEdge> edges = model.getEdges();
		MValue mark = model.getMark();
		return new Object[] { nodes, edges, mark };
	}

	@Override
	protected Adapter[] getCustomAdapters() {
		return new Adapter[] { adapter };
	}

	static class GraphContentAdapter extends ContentAdapter {

		@Override
		public void notifyChanged(Notification notification) {

		}

	}
}
