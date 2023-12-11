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
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import com.andia.mixin.model.EList;
import com.andia.mixin.model.EMap;
import com.andia.mixin.model.MGraph;
import com.andia.mixin.model.MNode;
import com.andia.mixin.model.MType;
import com.andia.mixin.model.MValue;
import com.andia.mixin.model.Notification;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class EObjectModifierTest {

	private static MGraph graph = MockFactoryUtil.createMGraph();

	private void modify(FeaturePath path, int type, Object oldValue, Object newValue) {
		Modification modification = new Modification(path, type, oldValue, newValue);
		modify(modification);
	}

	private void modify(FeaturePath path, int type) {
		Modification modification = new Modification(path, type);
		modify(modification);
	}

	private void modify(Modification modification) {
		EObjectModifier modifier = new EObjectModifier(modification);
		modifier.modify(graph);
	}

	@Test
	@Order(10)
	public void testListAdd() {
		assertNodeListAdd("first", 0, 1);
		assertNodeListAdd("second", 1, 2);
	}

	private void assertNodeListAdd(String name, int index, int size) {

		// Siapkan node dan beri nama
		FeaturePath path = createNodeListPath(index);
		MNode addNode = createNode(name);

		// Jalankan modifikasi menambahkan node
		modify(path, Notification.ADD, null, addNode);

		// Nodes harus ada sejumlah size
		EList<MNode> nodes = getNodes();
		assertEquals(size, nodes.size());

		// Nama node harus name
		MNode getNode = nodes.get(index);
		assertEquals(name, getNode.getName());
	}

	private EList<MNode> getNodes() {
		EList<MNode> nodes = graph.getNodes();
		return nodes;
	}

	private MNode createNode(String name) {
		MNode node = MockFactoryUtil.createMNode();
		node.setName(name);
		return node;
	}

	private FeaturePath createNodeListPath(int index) {
		String nodesName = "nodes";
		ListFeatureKey key = new ListFeatureKey(nodesName, index);
		FeaturePath path = new FeaturePath(key);
		return path;
	}

	@Test
	@Order(11)
	public void testListMove() {

		FeaturePath path = createNodeListPath(1);
		modify(path, Notification.MOVE, 1, 0);

		EList<MNode> nodes = getNodes();
		MNode mNode = nodes.get(0);
		assertEquals("second", mNode.getName());
	}

	@Test
	@Order(12)
	public void testListSet() {

		String name = "first-node";
		FeaturePath path = createNodeListPath(0);
		MNode node = createNode(name);

		modify(path, Notification.SET, null, node);

		EList<MNode> nodes = getNodes();
		MNode mNode = nodes.get(0);
		assertEquals(name, mNode.getName());

	}

	@Test
	@Order(13)
	public void testListRemove() {

		FeaturePath path = createNodeListPath(1);
		modify(path, Notification.REMOVE);

		EList<MNode> nodes = getNodes();
		assertEquals(1, nodes.size());

	}

	@Test
	@Order(14)
	public void testListClear() {

		String name = "first-node";
		EList<MNode> nodes = getNodes();
		FeaturePath path = createNodeListPath(0);
		modify(path, Notification.REMOVE_MANY, nodes.toArray(), null);

		assertEquals(0, nodes.size());

		assertNodeListAdd(name, 0, 1);

	}

	@Test
	@Order(15)
	public void testListUnknownModificationType() {

		FeaturePath path = createNodeListPath(1);
		EObjectModifierException exception = assertThrows(EObjectModifierException.class, () -> {
			modify(path, -1);
		});
		assertEquals("Unknown modification type -1", exception.getMessage());
	}

	@Test
	@Order(20)
	public void testMapPut() {
		assertNodeStylesPut("first-key", "first-value", 1);
		assertNodeStylesPut("second-key", "second-value", 2);
	}

	private void assertNodeStylesPut(String key, String value, int size) {

		// Siapkan path
		FeaturePath path = createNodeStylePath(key);

		// Jalankan modifikasi style setting key menjadi valie
		MValue mValue = MockFactoryUtil.createMValue();
		mValue.setExpression(value);
		modify(path, Notification.SET, null, mValue);

		// Node pertama harus punya styles sejumlah size
		EList<MNode> nodes = getNodes();
		MNode mNode = nodes.get(0);
		EMap<MValue> styles = mNode.getStyles();
		assertEquals(size, styles.size());

		// Style value harus sesuai
		MValue getMValue = styles.get(key);
		assertEquals(value, getMValue.getExpression());
	}

	private FeaturePath createNodeStylePath(String key) {
		ListFeatureKey listKey = new ListFeatureKey("nodes", 0);
		MapFeatureKey mapKey = new MapFeatureKey("styles", key);
		FeaturePath path = new FeaturePath(listKey, mapKey);
		return path;
	}

	@Test
	@Order(21)
	public void testMapValueSet() {

		// Siapkan path
		int index = 0;
		ListFeatureKey listKey = new ListFeatureKey("nodes", index);
		String firstKey = "first-key";
		MapFeatureKey mapKey = new MapFeatureKey("styles", firstKey);
		FeatureKey expressionKey = new FeatureKey("expression");
		FeaturePath path = new FeaturePath(listKey, mapKey, expressionKey);
		String secondExpression = "second-expression";
		modify(path, Notification.SET, null, secondExpression);

		EList<MNode> nodes = getNodes();
		MNode mNode = nodes.get(index);
		EMap<MValue> styles = mNode.getStyles();
		MValue mValue = styles.get(firstKey);
		assertEquals(secondExpression, mValue.getExpression());
	}

	@Test
	@Order(22)
	public void testMapRemove() {

		// Siapkan path
		FeaturePath path = createNodeStylePath("second-key");
		modify(path, Notification.REMOVE);
	}

	@Test
	@Order(23)
	public void testMapUnknownModificationType() {

		FeaturePath path = createNodeStylePath("first-key");
		EObjectModifierException exception = assertThrows(EObjectModifierException.class, () -> {
			modify(path, -1);
		});
		assertEquals("Unknown modification type -1", exception.getMessage());
	}

	@Test
	@Order(30)
	public void testSetAttribute() {

		// Siapkan path
		int index = 0;
		FeaturePath path = createNodeNamePath(0);
		String name = "node-one";
		modify(path, Notification.SET, null, name);

		EList<MNode> nodes = getNodes();
		MNode mNode = nodes.get(index);
		assertEquals(name, mNode.getName());
	}

	private FeaturePath createNodeNamePath(int index) {
		String nodesName = "nodes";
		ListFeatureKey listKey = new ListFeatureKey(nodesName, index);
		FeatureKey nameKey = new FeatureKey("name");
		FeaturePath path = new FeaturePath(listKey, nameKey);
		return path;
	}

	@Test
	@Order(31)
	public void setUnknownModificationType() {
		FeaturePath path = createNodeNamePath(0);
		EObjectModifierException exception = assertThrows(EObjectModifierException.class, () -> {
			modify(path, -1);
		});
		assertEquals("Unknown modification type -1", exception.getMessage());
	}

	@Test
	@Order(32)
	public void setUnknownNotEObject() {
		FeatureKey typeKey = new FeatureKey("type");
		FeatureKey nameKey = new FeatureKey("name");
		FeaturePath path = new FeaturePath(typeKey, nameKey);
		EObjectModifierException exception = assertThrows(EObjectModifierException.class, () -> {
			modify(path, -1);
		});
		String message = exception.getMessage();
		assertTrue(message.endsWith("not instanceof EObject"));
	}

	@Test
	@Order(40)
	public void testSetEnum() {

		// Siapkan path
		FeatureKey typeKey = new FeatureKey("type");
		FeaturePath path = new FeaturePath(typeKey);
		String name = "directed";
		modify(path, Notification.SET, null, name);

		assertEquals(MType.DIRECTED, graph.getType());
	}

	@Test
	@Order(40)
	public void testSetEObjectAttribute() {

		// Siapkan mark
		MValue value = MockFactoryUtil.createMValue();
		graph.setMark(value);

		// Siapkan path
		FeatureKey typeKey = new FeatureKey("mark");
		FeatureKey expressionKey = new FeatureKey("expression");
		FeaturePath path = new FeaturePath(typeKey, expressionKey);
		String expression = "noted";
		modify(path, Notification.SET, null, expression);

		MValue mark = graph.getMark();
		assertEquals(expression, mark.getExpression());
	}

}
