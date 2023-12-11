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

import java.util.HashMap;
import java.util.Map;

class BasicMockPackage implements MockPackage {

	private Map<String, Class<? extends EObject>> map = new HashMap<>();

	public BasicMockPackage() {
		this.map.put(MGraph.XCLASSNAME, MGraph.class);
		this.map.put(MNode.XCLASSNAME, MNode.class);
		this.map.put(MVariable.XCLASSNAME, MVariable.class);
		this.map.put(MMarkup.XCLASSNAME, MMarkup.class);
		this.map.put(MEdge.XCLASSNAME, MEdge.class);
		this.map.put(MValue.XCLASSNAME, MValue.class);
		this.map.put(MFlag.XCLASSNAME, MFlag.class);
	}

	@Override
	public Namespace getMainNamespace() {
		return Mock.NAMESPACE;
	}

	@Override
	public Namespace[] getNamespaces() {
		return new Namespace[] { Mock.NAMESPACE };
	}

	@Override
	public Class<? extends EObject> getDefinedEClass(String eClassName) {
		return this.map.get(eClassName);
	}

	@Override
	public Class<? extends EObject> getEClass(String eClassName) {
		return this.getDefinedEClass(eClassName);
	}

	@Override
	public MockFactory getEFactoryInstance() {
		return MockFactory.eINSTANCE;
	}

}