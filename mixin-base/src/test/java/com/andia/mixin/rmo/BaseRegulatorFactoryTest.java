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
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import com.andia.mixin.model.EList;
import com.andia.mixin.model.MGraph;
import com.andia.mixin.model.MNode;
import com.andia.mixin.regulator.GraphRegulator;
import com.andia.mixin.regulator.UncreateRegulator;

public class BaseRegulatorFactoryTest {

	@Test
	public void testRegisterEObject() {

		// Daftarkan model
		BaseRegulatorFactory factory = new MockRegulatorFactory();
		factory.register(MGraph.XCLASSNAME, GraphRegulator.class);

		// Buat EObject regulator
		MGraph graph = MockFactoryUtil.createMGraph();
		Regulator regulator = factory.create(graph);
		assertNotNull(regulator);
		assertTrue(regulator instanceof GraphRegulator);
	}

	@Test
	public void testRegisterEList() {

		// Daftarkan model
		BaseRegulatorFactory factory = new MockRegulatorFactory();

		factory.registerList(MGraph.XCLASSNAME, MGraph.FEATURE_NODES, EListRegulator.class);

		// Buat EList regulator
		MGraph graph = MockFactoryUtil.createMGraph();
		EList<MNode> nodes = graph.getNodes();
		Regulator regulator = factory.create(nodes);
		assertNotNull(regulator);
		assertTrue(regulator instanceof EListRegulator);
	}

	@Test
	public void testCreateNullModel() {

		// Buat EObject regulator
		BaseRegulatorFactory factory = new MockRegulatorFactory();
		RegulatorException exception = assertThrows(RegulatorException.class, () -> {
			factory.create(null);
		});
		assertEquals("Cannot create regulator from null model", exception.getMessage());
	}

	@Test
	public void testCreateNotValidModel() {

		// Buat EObject regulator
		BaseRegulatorFactory factory = new MockRegulatorFactory();
		RegulatorException exception = assertThrows(RegulatorException.class, () -> {
			factory.create("invalid");
		});
		assertEquals("Model invalid must be EObjectEList or EObject", exception.getMessage());
	}

	@Test
	public void testMissingRegulator() {

		// Daftarkan model
		MockRegulatorFactory factory = new MockRegulatorFactory();
		factory.clear();

		// Buat EObject regulator
		MGraph graph = MockFactoryUtil.createMGraph();
		RegulatorException exception = assertThrows(RegulatorException.class, () -> {
			factory.create(graph);
		});
		String message = exception.getMessage();
		assertTrue(message.startsWith("Missing regulator for "));
	}

	@Test
	public void testUncreateRegulator() {

		// Daftarkan model
		BaseRegulatorFactory factory = new MockRegulatorFactory();

		factory.register(MGraph.XCLASSNAME, UncreateRegulator.class);

		// Buat EObject regulator
		MGraph graph = MockFactoryUtil.createMGraph();
		RegulatorException exception = assertThrows(RegulatorException.class, () -> {
			factory.create(graph);
		});
		String message = exception.getMessage();
		assertTrue(message.startsWith("Fail create regulator"));
	}

}
