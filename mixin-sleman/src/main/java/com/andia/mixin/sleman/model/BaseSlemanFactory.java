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
package com.andia.mixin.sleman.model;

import com.andia.mixin.model.EClass;
import com.andia.mixin.model.EObject;
import com.andia.mixin.model.EPackage;

class BaseSlemanFactory implements SlemanFactory {

	public EObject create(EClass eClass) {
		String name = eClass.getName();
		EPackage ePackage = SlemanPackage.eINSTANCE;
		Class<? extends EObject> eObjectClass = ePackage.getEClass(name);
		try {
			return eObjectClass.newInstance();
		} catch (Exception e) {
			throw new SlemanException("Fail create sleman model " + name, e);
		}
	}

	@Override
	public XNull createXNull() {
		return new XNull();
	}

	@Override
	public XText createXText() {
		return new XText();
	}

	@Override
	public XNumber createXNumber() {
		return new XNumber();
	}

	@Override
	public XLogical createXLogical() {
		return new XLogical();
	}

	@Override
	public XList createXList() {
		return new XList();
	}

	@Override
	public XObject createXObject() {
		return new XObject();
	}

	@Override
	public XAlias createXAlias() {
		return new XAlias();
	}

	@Override
	public XReference createXReference() {
		return new XReference();
	}

	@Override
	public XAssignment createXAssignment() {
		return new XAssignment();
	}

	@Override
	public XIdentifier createXIdentifier() {
		return new XIdentifier();
	}

	@Override
	public XLet createXLet() {
		return new XLet();
	}

	@Override
	public XCall createXCall() {
		return new XCall();
	}

	@Override
	public XArgument createXArgument() {
		return new XArgument();
	}

	@Override
	public XUnary createXUnary() {
		return new XUnary();
	}

	@Override
	public XBinary createXBinary() {
		return new XBinary();
	}

	@Override
	public XMember createXMember() {
		return new XMember();
	}

	@Override
	public XLambda createXLambda() {
		return new XLambda();
	}

	@Override
	public XForeach createXForeach() {
		return new XForeach();
	}

	@Override
	public XConditional createXConditional() {
		return new XConditional();
	}

}
