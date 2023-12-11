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
import EReference from "webface/model/EReference";

import * as model from "malang/model/model";
import XInputFeature from "malang/model/XInputFeature";
import XInputAssignment from "malang/model/XInputAssignment";

export default class XSingleAssignment extends XInputAssignment {

	public static XCLASSNAME: string = model.getEClassName("XSingleAssignment");

	public static FEATURE_INPUT_FEATURE = new EReference("inputFeature", XInputFeature);

	private inputFeature: XInputFeature = null;

	constructor() {
		super(model.createEClass(XSingleAssignment.XCLASSNAME), [
			XSingleAssignment.FEATURE_INPUT_FEATURE,
		]);
	}

	public getInputFeature(): XInputFeature {
		return this.inputFeature;
	}

	public setInputFeature(newFeature: XInputFeature): void {
		let oldFeature = this.inputFeature;
		this.inputFeature = newFeature;
		this.eSetNotify(XSingleAssignment.FEATURE_INPUT_FEATURE, oldFeature, newFeature);
	}
}
