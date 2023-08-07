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
package com.andia.mixin.sleman.model;

import java.util.HashMap;
import java.util.Map;

import com.andia.mixin.model.EObject;
import com.andia.mixin.model.Namespace;

class BasicSlemanPackage implements SlemanPackage {

	private Map<String, Class<? extends EObject>> map = new HashMap<>();

	public BasicSlemanPackage() {
		this.map.put(XLet.XCLASSNAME, XLet.class);
		this.map.put(XText.XCLASSNAME, XText.class);
		this.map.put(XNull.XCLASSNAME, XNull.class);
		this.map.put(XCall.XCLASSNAME, XCall.class);
		this.map.put(XList.XCLASSNAME, XList.class);
		this.map.put(XAlias.XCLASSNAME, XAlias.class);
		this.map.put(XUnary.XCLASSNAME, XUnary.class);
		this.map.put(XObject.XCLASSNAME, XObject.class);
		this.map.put(XBinary.XCLASSNAME, XBinary.class);
		this.map.put(XNumber.XCLASSNAME, XNumber.class);
		this.map.put(XMember.XCLASSNAME, XMember.class);
		this.map.put(XLambda.XCLASSNAME, XLambda.class);
		this.map.put(XLogical.XCLASSNAME, XLogical.class);
		this.map.put(XForeach.XCLASSNAME, XForeach.class);
		this.map.put(XArgument.XCLASSNAME, XArgument.class);
		this.map.put(XReference.XCLASSNAME, XReference.class);
		this.map.put(XAssignment.XCLASSNAME, XAssignment.class);
		this.map.put(XIdentifier.XCLASSNAME, XIdentifier.class);
		this.map.put(XConditional.XCLASSNAME, XConditional.class);
	}

	@Override
	public Namespace getMainNamespace() {
		return Sleman.NAMESPACE;
	}

	@Override
	public Namespace[] getNamespaces() {
		return new Namespace[] { Sleman.NAMESPACE };
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
	public SlemanFactory getEFactoryInstance() {
		return SlemanFactory.eINSTANCE;
	}

}