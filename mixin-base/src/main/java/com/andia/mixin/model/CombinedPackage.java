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
package com.andia.mixin.model;

import java.util.ArrayList;
import java.util.List;

public class CombinedPackage implements EPackage {

	private EPackage[] packages;
	private CombinedFactory combinedFactory;

	public CombinedPackage(EPackage... packages) {
		this.packages = new EPackage[packages.length];
		for (int i = 0; i < packages.length; i++) {
			this.packages[i] = packages[i];
		}
		this.combinedFactory = new CombinedFactory(this);
	}

	@Override
	public Namespace getMainNamespace() {
		return packages[0].getMainNamespace();
	}

	@Override
	public Namespace[] getNamespaces() {
		List<Namespace> namespaces = new ArrayList<>();
		for (int i = 0; i < this.packages.length; i++) {
			EPackage ePackage = this.packages[i];
			Namespace[] subNamespaces = ePackage.getNamespaces();
			for (Namespace subNamespace : subNamespaces) {
				if (namespaces.indexOf(subNamespace) == -1) {
					namespaces.add(subNamespace);
				}
			}
		}
		return namespaces.toArray(new Namespace[0]);
	}

	@Override
	public Class<? extends EObject> getDefinedEClass(String eClassName) {
		for (int i = 0; i < this.packages.length; i++) {
			EPackage ePackage = this.packages[i];
			Class<? extends EObject> eClass = ePackage.getDefinedEClass(eClassName);
			if (eClass != null) {
				return eClass;
			}
		}
		return null;
	}

	@Override
	public Class<? extends EObject> getEClass(String eClassName) {
		return this.getDefinedEClass(eClassName);
	}

	@Override
	public EFactory getEFactoryInstance() {
		return this.combinedFactory;
	}
}
