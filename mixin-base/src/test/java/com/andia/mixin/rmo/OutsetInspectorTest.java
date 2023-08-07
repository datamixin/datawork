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
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.andia.mixin.model.EAttribute;
import com.andia.mixin.model.EList;
import com.andia.mixin.model.EReference;
import com.andia.mixin.model.MGraph;
import com.andia.mixin.model.MNode;
import com.andia.mixin.model.MValue;

public class OutsetInspectorTest {

	private Regulator regulator;

	@BeforeEach
	public void setup() {

		// Buat susunan graph
		MGraph model = MockFactoryUtil.createMGraph();

		// Default mark value
		MValue value = MockFactoryUtil.createMValue();
		model.setMark(value);

		// Satu node
		EList<MNode> nodes = model.getNodes();
		MNode node = MockFactoryUtil.createMNode();
		nodes.add(node);

		// Bangun susunan regulator
		MockRunmodel porter = new MockRunmodel();
		porter.setModel(model);
		RootRegulator rootRegulator = porter.getRootRegulator();
		regulator = rootRegulator.getContents();

	}

	@Test
	public void testInspectGraph() throws OutsetException {

		FeaturePath rootPath = new FeaturePath();
		FeatureCall call = new FeatureCall(rootPath, "result");
		OutsetInvoker inspector = new OutsetInvoker(call);
		Object inspect = inspector.invoke(regulator);
		assertEquals("RESULT", inspect);
	}

	@Test
	public void testInspectGraphMark() throws OutsetException {
		FeatureKey markKey = createMarkKey();
		FeaturePath rootPath = new FeaturePath(markKey);
		FeatureCall call = new FeatureCall(rootPath, "state");
		OutsetInvoker inspector = new OutsetInvoker(call);
		Object inspect = inspector.invoke(regulator);
		assertEquals("STATE", inspect);
	}

	@Test
	public void testInspectGraphMarkFlag() throws OutsetException {
		FeatureKey markKey = createMarkKey();
		FeatureKey flagKey = createFlagKey();
		FeaturePath rootPath = new FeaturePath(markKey, flagKey);
		FeatureCall call = new FeatureCall(rootPath, "color");
		OutsetInvoker inspector = new OutsetInvoker(call);
		Object inspect = inspector.invoke(regulator);
		assertEquals("COLOR", inspect);
	}

	private FeatureKey createMarkKey() {
		EReference feature = MGraph.FEATURE_MARK;
		String name = feature.getName();
		FeatureKey key = new FeatureKey(name);
		return key;
	}

	private FeatureKey createFlagKey() {
		EReference feature = MValue.FEATURE_FLAG;
		String name = feature.getName();
		FeatureKey key = new FeatureKey(name);
		return key;
	}

	@Test
	public void testInspectGraphMarkFailInspect() throws OutsetException {

		FeatureKey markKey = createMarkKey();
		FeatureKey expressionKey = createExpressionKey();

		FeaturePath rootPath = new FeaturePath(markKey, expressionKey);
		FeatureCall call = new FeatureCall(rootPath, "state");
		OutsetInvoker inspector = new OutsetInvoker(call);
		OutsetException exception = assertThrows(OutsetException.class, () -> {
			inspector.invoke(regulator);
		});
		assertEquals("Missing expression regulator to visit", exception.getMessage());
	}

	private FeatureKey createExpressionKey() {

		EAttribute feature = MValue.FEATURE_EXPRESSION;
		String name = feature.getName();
		FeatureKey key = new FeatureKey(name);
		return key;
	}

	@Test
	public void testInspectGraphNodeListFirst() throws OutsetException {
		ListFeatureKey nodeKey = createNodeKey();
		FeaturePath nodePath = new FeaturePath(nodeKey);
		FeatureCall call = new FeatureCall(nodePath, "value");
		OutsetInvoker inspector = new OutsetInvoker(call);
		Object inspect = inspector.invoke(regulator);
		assertEquals("VALUE", inspect);
	}

	@Test
	public void testInspectGraphNodeListFirstState() throws OutsetException {
		ListFeatureKey nodeKey = createNodeKey();
		FeatureKey stateKey = createStateKey();
		FeaturePath statePath = new FeaturePath(nodeKey, stateKey);
		FeatureCall call = new FeatureCall(statePath, "state");
		OutsetInvoker inspector = new OutsetInvoker(call);
		Object inspect = inspector.invoke(regulator);
		assertEquals("STATE", inspect);
	}

	private ListFeatureKey createNodeKey() {

		EReference feature = MGraph.FEATURE_NODES;
		String name = feature.getName();
		ListFeatureKey key = new ListFeatureKey(name, 0);
		return key;
	}

	private FeatureKey createStateKey() {
		EReference feature = MNode.FEATURE_STATE;
		String name = feature.getName();
		FeatureKey key = new FeatureKey(name);
		return key;
	}

	@Test
	public void testFailInspect() throws OutsetException {

		FeaturePath rootPath = new FeaturePath();
		FeatureCall call = new FeatureCall(rootPath, "unknown");
		OutsetInvoker inspector = new OutsetInvoker(call);
		OutsetException exception = assertThrows(OutsetException.class, () -> {
			inspector.invoke(regulator);
		});
		assertEquals("Fail inspect outset", exception.getMessage());
	}
}
