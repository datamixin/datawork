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
import EReference from "webface/model/EReference";
import BasicEList from "webface/model/BasicEList";

import * as model from "malang/model/model";
import XInputFeature from "malang/model/XInputFeature";
import XInputAssignment from "malang/model/XInputAssignment";

export default class XMultipleAssignment extends XInputAssignment {

	public static XCLASSNAME: string = model.getEClassName("XMultipleAssignment");

	public static FEATURE_INPUT_FEATURES = new EReference("inputFeatures", XInputFeature);

	private inputFeatures = new BasicEList<XInputFeature>(this, XMultipleAssignment.FEATURE_INPUT_FEATURES);

	constructor() {
		super(model.createEClass(XMultipleAssignment.XCLASSNAME), [
			XMultipleAssignment.FEATURE_INPUT_FEATURES
		]);
	}

	public getInputFeatures(): EList<XInputFeature> {
		return this.inputFeatures;
	}

}
