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

public class EClass {

	private String name;
	private EPackage ePackage;

	public EClass(EPackage ePackage, String name) {
		this.ePackage = ePackage;
		this.name = name;
	}

	public String getName() {
		return this.name;
	}

	public String getFullName() {
		Namespace[] namespaces = this.ePackage.getNamespaces();
		Namespace namespace = namespaces[0];
		String name = namespace.getName();
		String uri = namespace.getURI();
		return uri + '#' + this.name.substring(name.length() + 1);
	}

	public EPackage getEPackage() {
		return this.ePackage;
	}

	public String toString() {
		return this.name;
	}

}
