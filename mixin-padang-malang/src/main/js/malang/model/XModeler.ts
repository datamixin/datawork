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
import BasicEObject from "webface/model/BasicEObject";

import XInput from "malang/model/XInput";
import XResult from "malang/model/XResult";
import * as model from "malang/model/model";
import XLearning from "malang/model/XLearning";

export class XModeler extends BasicEObject {

	public static XCLASSNAME: string = model.getEClassName("XModeler");

	public static FEATURE_INPUTS = new EReference("inputs", XInput);
	public static FEATURE_LEARNING = new EReference("learning", XLearning);
	public static FEATURE_RESULT = new EReference("result", XResult);

	private inputs = new BasicEList<XInput>(this, XModeler.FEATURE_INPUTS);
	private learning: XLearning = null;
	private result: XResult = null;

	constructor() {
		super(model.createEClass(XModeler.XCLASSNAME), [
			XModeler.FEATURE_INPUTS,
			XModeler.FEATURE_LEARNING,
			XModeler.FEATURE_RESULT,
		]);
	}

	public getInputs(): EList<XInput> {
		return this.inputs;
	}

	public getLearning(): XLearning {
		return this.learning;
	}

	public setLearning(newLearning: XLearning): void {
		let oldLearning = this.learning;
		this.learning = newLearning;
		this.eSetNotify(XModeler.FEATURE_LEARNING, oldLearning, newLearning);
	}

	public getResult(): XResult {
		return this.result;
	}

	public setResult(newResult: XResult): void {
		let oldResult = this.result;
		this.result = newResult;
		this.eSetNotify(XModeler.FEATURE_RESULT, oldResult, newResult);
	}

}

export default XModeler;