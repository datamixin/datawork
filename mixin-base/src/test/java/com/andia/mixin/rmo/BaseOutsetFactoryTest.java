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

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import com.andia.mixin.model.MGraph;
import com.andia.mixin.outset.GraphOutset;
import com.andia.mixin.outset.UncreateOutset;
import com.andia.mixin.regulator.GraphRegulator;

public class BaseOutsetFactoryTest {

	@Test
	public void testRegisterEObject() throws OutsetException {

		// Daftarkan outset
		BaseOutsetFactory factory = new MockOutsetFactory();

		String mGraph = MGraph.XCLASSNAME;

		factory.register(mGraph, GraphOutset.class);
		assertTrue(factory.isExists(mGraph));

		// Buat EObject outset
		Supervisor supervisor = new GraphRegulator();
		Outset outset = factory.create(supervisor, mGraph);
		assertNotNull(outset);
		assertTrue(outset instanceof GraphOutset);
	}

	@Test
	public void testRegisterEList() throws OutsetException {

		// Daftarkan model
		BaseOutsetFactory factory = new MockOutsetFactory();

		factory.registerList(MGraph.XCLASSNAME, MGraph.FEATURE_NODES, BaseOutsetList.class);

		String key = factory.asFeatureKey(MGraph.XCLASSNAME, MGraph.FEATURE_NODES);

		// Buat EList outset
		Supervisor supervisor = new EListRegulator();
		Outset outset = factory.create(supervisor, key);
		assertNotNull(outset);
		assertTrue(outset instanceof OutsetList);
	}

	@Test
	public void testRegisterCreateNotValidModel() {

		// Daftarkan model
		MockOutsetFactory factory = new MockOutsetFactory();
		factory.clear();

		// Buat EObject outset
		OutsetException exception = assertThrows(OutsetException.class, () -> {
			Supervisor supervisor = new GraphRegulator();
			factory.create(supervisor, MGraph.XCLASSNAME);
		});
		String message = exception.getMessage();
		assertTrue(message.startsWith("Missing outset for "));
	}

	@Test
	public void testMissingOutset() {

		// Daftarkan model
		MockOutsetFactory factory = new MockOutsetFactory();
		factory.clear();

		// Buat EObject outset
		OutsetException exception = assertThrows(OutsetException.class, () -> {
			Supervisor supervisor = new GraphRegulator();
			factory.create(supervisor, MGraph.XCLASSNAME);
		});
		String message = exception.getMessage();
		assertTrue(message.startsWith("Missing outset for "));
	}

	@Test
	public void testUncreateOutset() {

		// Daftarkan model
		BaseOutsetFactory factory = new MockOutsetFactory();
		factory.register(MGraph.XCLASSNAME, UncreateOutset.class);

		// Buat EObject regulator
		OutsetException exception = assertThrows(OutsetException.class, () -> {
			Supervisor supervisor = new GraphRegulator();
			factory.create(supervisor, MGraph.XCLASSNAME);
		});
		String message = exception.getMessage();
		assertTrue(message.startsWith("Fail create outset"));
	}
}
