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
import EObject from "webface/model/EObject";
import EFactory from "webface/model/EFactory";
import ModelNamespace from "webface/model/ModelNamespace";

import { NAMESPACE } from "rinjani/model/model";
import RinjaniPackage from "rinjani/model/RinjaniPackage";
import RinjaniFactory from "rinjani/model/RinjaniFactory";

import XInput from "rinjani/model/XInput";
import XResult from "rinjani/model/XResult";
import XRoutine from "rinjani/model/XRoutine";
import XParameter from "rinjani/model/XParameter";
import XInputField from "rinjani/model/XInputField";
import XSingleMapping from "rinjani/model/XSingleMapping";
import XMultipleMapping from "rinjani/model/XMultipleMapping";

export default class BasicRinjaniPackage implements RinjaniPackage {

	private map: { [xClass: string]: typeof EObject } = {};

	constructor() {
		this.map[XInput.XCLASSNAME] = XInput;
		this.map[XResult.XCLASSNAME] = XResult;
		this.map[XRoutine.XCLASSNAME] = XRoutine;
		this.map[XParameter.XCLASSNAME] = XParameter;
		this.map[XInputField.XCLASSNAME] = XInputField;
		this.map[XSingleMapping.XCLASSNAME] = XSingleMapping;
		this.map[XMultipleMapping.XCLASSNAME] = XMultipleMapping;
	}

	public getNamespaces(): ModelNamespace[] {
		return [NAMESPACE];
	}

	public getDefinedEClass(eClassName: string): typeof EObject {
		return this.map[eClassName] || null;
	}

	public getEClass(eClassName: string): typeof EObject {
		return this.getDefinedEClass(eClassName);
	}

	public getEFactoryInstance(): EFactory {
		return RinjaniFactory.eINSTANCE;
	}

	public getEClassNames(): string[] {
		return Object.keys(this.map);
	}


}

RinjaniPackage.eINSTANCE = new BasicRinjaniPackage();

