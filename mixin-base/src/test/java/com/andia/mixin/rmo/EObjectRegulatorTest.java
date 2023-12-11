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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import com.andia.mixin.model.EList;
import com.andia.mixin.model.MGraph;
import com.andia.mixin.model.MNode;
import com.andia.mixin.model.MValue;
import com.andia.mixin.outset.GraphOutset;
import com.andia.mixin.outset.MockAcceptor;
import com.andia.mixin.outset.UncreateOutset;
import com.andia.mixin.regulator.GraphRegulator;
import com.andia.mixin.regulator.MockRevision;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class EObjectRegulatorTest {

	private static MGraph model = MockFactoryUtil.createMGraph();
	private static MockRunmodel porter = new MockRunmodel();
	private static RootRegulator rootRegulator = new RootRegulator();
	private static Regulator regulator = new GraphRegulator();

	@BeforeAll
	public static void setup() {
		regulator.setModel(model);
		rootRegulator.setRunmodel(porter);
		rootRegulator.setContents(regulator);
	}

	@Test
	@Order(00)
	public void testGetModel() {
		assertEquals(model, regulator.getModel());
	}

	@Test
	@Order(10)
	public void testGetParent() {
		assertEquals(rootRegulator, regulator.getParent());
	}

	@Test
	@Order(20)
	public void testGetOutset() {
		assertTrue(regulator.getOutset() instanceof GraphOutset);
	}

	@Test
	@Order(30)
	public void testGetNodeList() {
		Regulator childRegulator = regulator.getChildRegulator(0);
		assertTrue(childRegulator instanceof EListRegulator);
	}

	@Test
	@Order(31)
	public void testGetNodeListAdd2Node() {
		assertNodeListAdd(0);
		assertNodeListAdd(1);
	}

	private void assertNodeListAdd(int index) {

		assertNodeListSize(index);

		// Siapkan node baru
		String nodeName = "node-" + index;
		MNode node = createNode(nodeName);

		// Tambahkan node ke node-list
		EList<MNode> nodes = model.getNodes();
		nodes.add(node);

		// Akan ada satu node setelah-nya
		int size = index + 1;
		assertNodeListSize(size);
		assertNodeNameOutset(index, nodeName);

	}

	private MNode createNode(String nodeName) {
		MNode node = MockFactoryUtil.createMNode();
		MValue value = MockFactoryUtil.createMValue();
		node.setState(value);
		node.setName(nodeName);
		return node;
	}

	private void assertNodeListSize(int size) {

		Regulator nodeListRegulator = regulator.getChildRegulator(0);
		List<Regulator> children = nodeListRegulator.getChildren();
		assertEquals(size, children.size());

		OutsetList<?> list = (OutsetList<?>) nodeListRegulator.getOutset();
		assertEquals(size, list.size());

		for (int i = 0; i < children.size(); i++) {
			Regulator regulator = children.get(i);
			Outset outset = regulator.getOutset();
			assertEquals(outset, list.get(i));
		}
	}

	private void assertNodeNameOutset(int index, String name) {

		// Pastikan node-name sama
		Regulator childRegulator = regulator.getChildRegulator(0);
		List<Regulator> children = childRegulator.getChildren();
		Regulator nodeRegulator = children.get(index);
		MNode node = (MNode) nodeRegulator.getModel();
		assertEquals(name, node.getName());

		// Pastikan outset-nya sama
		Outset outset = nodeRegulator.getOutset();
		OutsetList<?> list = (OutsetList<?>) childRegulator.getOutset();
		assertEquals(outset, list.get(index));

	}

	@Test
	@Order(32)
	public void testGetNodeListMoveNode() {

		EList<MNode> nodes = model.getNodes();
		MNode mNode = nodes.get(1);
		nodes.move(mNode, 0);
		assertNodeNameOutset(0, "node-1");
		assertNodeNameOutset(1, "node-0");
	}

	@Test
	@Order(33)
	public void testGetNodeListSetNode() {

		String nodeName = "node-2";
		MNode node = createNode(nodeName);
		EList<MNode> nodes = model.getNodes();
		nodes.set(1, node);
		assertNodeNameOutset(0, "node-1");
		assertNodeNameOutset(1, nodeName);
	}

	@Test
	@Order(34)
	public void testNodeListRemoveNode() {

		EList<MNode> nodes = model.getNodes();
		nodes.remove(1);
		assertNodeListSize(1);
	}

	@Test
	@Order(35)
	public void testNodeListRemoveAll() {

		EList<MNode> nodes = model.getNodes();
		nodes.clear();
		assertNodeListSize(0);
	}

	@Test
	@Order(40)
	public void testSetGetPreparedObject() {
		regulator.setPreparedObject(MockObject.class, new MockObject());
		assertNotNull(regulator.getPreparedObject(MockInterface.class));
		assertNotNull(regulator.getPreparedObject(MockObject.class));
		assertNull(regulator.getPreparedObject(String.class));
	}

	@Test
	@Order(50)
	public void testSetGetCapability() {
		porter.registerCapability(MockObject.class, new MockObject());
		assertNotNull(regulator.getCapability(MockInterface.class));
		assertNull(regulator.getCapability(String.class));
	}

	@Test
	@Order(60)
	public void testInstallProgressAcceptors() {
		Acceptor acceptor = new MockAcceptor();
		String progressType = MockRevision.class.getSimpleName();
		regulator.installRectificationAcceptors(progressType, acceptor);
	}

	@Test
	@Order(61)
	public void testSubmitProgress() {
		MockRevision progress = new MockRevision();
		regulator.submit(progress);
	}

	@Test
	@Order(90)
	public void testSetModelMissingOutset() {

		// Hapus outset graph edges dari factory
		MockOutsetFactory factory = (MockOutsetFactory) porter.getOutsetFactory();

		factory.remove(MGraph.XCLASSNAME, MGraph.FEATURE_NODES);

		// Berikan model baru
		MGraph graph = MockFactoryUtil.createMGraph();

		Regulator regulator = new GraphRegulator();
		regulator.setModel(graph);
		RegulatorException exception = assertThrows(RegulatorException.class, () -> {
			rootRegulator.setContents(regulator);
		});
		assertEquals("Missing outset list for 'nodes'", exception.getMessage());

	}

	@Test
	@Order(91)
	public void testSetModelUncreateOutset() {

		// Hapus outset graph edges dari factory
		MockOutsetFactory factory = (MockOutsetFactory) porter.getOutsetFactory();
		factory.registerList(MGraph.XCLASSNAME, MGraph.FEATURE_NODES, UncreateOutset.class);

		// Berikan model baru
		MGraph graph = MockFactoryUtil.createMGraph();

		Regulator regulator = new GraphRegulator();
		regulator.setModel(graph);
		RegulatorException exception = assertThrows(RegulatorException.class, () -> {
			rootRegulator.setContents(regulator);
		});
		String message = exception.getMessage();
		assertTrue(message.startsWith("Fail create outset for "));

	}

	@Test
	public void testGetRootNull() {
		Regulator regulator = new GraphRegulator();
		Runmodel runmodel = regulator.getRunmodel();
		assertNull(runmodel);
	}

}
