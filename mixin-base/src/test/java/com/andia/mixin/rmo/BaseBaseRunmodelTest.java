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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import com.andia.mixin.model.EList;
import com.andia.mixin.model.MEdge;
import com.andia.mixin.model.MGraph;
import com.andia.mixin.model.Notification;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class BaseBaseRunmodelTest {

	private static MockRunmodel runmodel = new MockRunmodel();
	private static MGraph graph = MockFactoryUtil.createMGraph();

	@Test
	@Order(00)
	public void testGetSetModel() {
		runmodel.setModel(graph);
		Object model = runmodel.getModel();
		assertEquals(graph, model);
	}

	@Test
	@Order(10)
	public void testModify() {
		int position = 0;
		FeaturePath path = getEdgePath(position);
		MEdge edge = MockFactoryUtil.createMEdge();
		Modification modification = new Modification(path, Notification.ADD, null, edge);
		runmodel.modify(modification);
		EList<MEdge> edges = graph.getEdges();
		assertEquals(1, edges.size());
	}

	private FeaturePath getEdgePath(int position) {
		ListFeatureKey key = new ListFeatureKey("edges", position);
		FeaturePath path = new FeaturePath(key);
		return path;
	}

	@Test
	@Order(20)
	public void testSetGetCapability() {
		runmodel.registerCapability(MockInterface.class, new MockObject());
		assertNotNull(runmodel.getCapability(MockInterface.class));
		assertNotNull(runmodel.getCapability(MockAbstract.class));
		assertNull(runmodel.getCapability(String.class));
	}

}
