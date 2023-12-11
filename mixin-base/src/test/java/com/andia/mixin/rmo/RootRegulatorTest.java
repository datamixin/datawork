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
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import com.andia.mixin.model.MGraph;
import com.andia.mixin.regulator.GraphRegulator;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class RootRegulatorTest {

	private static Runmodel runmodel = new MockRunmodel();
	private static RootRegulator rootRegulator = new RootRegulator();

	@BeforeAll
	public static void setup() {
		rootRegulator.setRunmodel(runmodel);
	}

	@Test
	@Order(00)
	public void testGetOutset() {
		assertNotNull(rootRegulator.getOutset());
	}

	@Test
	@Order(10)
	public void testGetRunPorter() {
		assertEquals(runmodel, rootRegulator.getRunmodel());
	}

	@Test
	@Order(20)
	public void testGetRoot() {
		assertEquals(rootRegulator, rootRegulator.getRoot());
	}

	@Test
	@Order(30)
	public void testGetChildrenEmpty() {
		List<Regulator> children = rootRegulator.getChildren();
		assertEquals(0, children.size());
	}

	@Test
	@Order(31)
	public void testSetContent() {
		Regulator contents = createContents();
		rootRegulator.setContents(contents);
	}

	@Test
	@Order(32)
	public void testUpdate() {
		rootRegulator.update();
	}

	@Test
	@Order(33)
	public void testResetContent() {
		Regulator contents = createContents();
		rootRegulator.setContents(contents);
	}

	private Regulator createContents() {
		MGraph graph = MockFactoryUtil.createMGraph();
		Regulator contents = new GraphRegulator();
		contents.setModel(graph);
		return contents;
	}

	@Test
	@Order(40)
	public void testGetContent() {
		Regulator contents = rootRegulator.getContents();
		assertTrue(contents instanceof GraphRegulator);
	}

	@Test
	@Order(50)
	public void testGetChildren() {
		List<Regulator> children = rootRegulator.getChildren();
		assertEquals(1, children.size());
	}

	@Test
	@Order(51)
	public void testResetContentsNull() {
		rootRegulator.setContents(null);
		List<Regulator> children = rootRegulator.getChildren();
		assertEquals(0, children.size());
	}
}
