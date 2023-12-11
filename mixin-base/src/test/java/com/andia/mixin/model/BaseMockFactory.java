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
package com.andia.mixin.model;

class BaseMockFactory implements MockFactory {

	public EObject create(EClass eClass) {
		String name = eClass.getName();
		EPackage ePackage = MockPackage.eINSTANCE;
		Class<? extends EObject> eObjectClass = ePackage.getEClass(name);
		try {
			return eObjectClass.newInstance();
		} catch (Exception e) {
			throw new MockException("Fail create mock model " + name, e);
		}
	}

	@Override
	public MGraph createMGraph() {
		return new MGraph();
	}

	@Override
	public MNode createMNode() {
		return new MNode();
	}

	@Override
	public MVariable createMVariable() {
		return new MVariable();
	}

	@Override
	public MMarkup createMMarkup() {
		return new MMarkup();
	}

	@Override
	public MValue createMValue() {
		return new MValue();
	}

	@Override
	public MFlag createMFlag() {
		return new MFlag();
	}

	@Override
	public MEdge createMEdge() {
		return new MEdge();
	}

}
