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
import EList from "webface/model/EList";
import BasicEList from "webface/model/BasicEList";
import EReference from "webface/model/EReference";
import EAttribute from "webface/model/EAttribute";
import BasicEObject from "webface/model/BasicEObject";

import XInput from "rinjani/model/XInput";
import XResult from "rinjani/model/XResult";
import * as model from "rinjani/model/model";
import XParameter from "rinjani/model/XParameter";

export class XRoutine extends BasicEObject {

	public static XCLASSNAME: string = model.getEClassName("XRoutine");

	public static FEATURE_NAME = new EAttribute("name", EAttribute.STRING);
	public static FEATURE_INPUTS = new EReference("inputs", XInput);
	public static FEATURE_PARAMETERS = new EReference("parameters", XParameter);
	public static FEATURE_RESULT = new EReference("result", XResult);

	private name: string = null;
	private inputs = new BasicEList<XInput>(this, XRoutine.FEATURE_INPUTS);
	private parameters = new BasicEList<XParameter>(this, XRoutine.FEATURE_PARAMETERS);
	private result: XResult = null;

	constructor() {
		super(model.createEClass(XRoutine.XCLASSNAME), [
			XRoutine.FEATURE_INPUTS,
			XRoutine.FEATURE_NAME,
			XRoutine.FEATURE_PARAMETERS,
			XRoutine.FEATURE_RESULT,
		]);
	}

	public getName(): string {
		return this.name;
	}

	public setName(newName: string): void {
		let oldName = this.name;
		this.name = newName;
		this.eSetNotify(XRoutine.FEATURE_NAME, oldName, newName);
	}

	public getParameters(): EList<XParameter> {
		return this.parameters;
	}

	public getInputs(): EList<XInput> {
		return this.inputs;
	}

	public getResult(): XResult {
		return this.result;
	}

	public setResult(newResult: XResult): void {
		let oldResult = this.result;
		this.result = newResult;
		this.eSetNotify(XRoutine.FEATURE_RESULT, oldResult, newResult);
	}

}

export default XRoutine;