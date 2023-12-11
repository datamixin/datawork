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
import EList from "webface/model/EList";
import EReference from "webface/model/EReference";
import BasicEList from "webface/model/BasicEList";

import * as model from "rinjani/model/model";
import XInputField from "rinjani/model/XInputField";
import XInputMapping from "rinjani/model/XInputMapping";

export default class XMultipleMapping extends XInputMapping {

	public static XCLASSNAME: string = model.getEClassName("XMultipleMapping");

	public static FEATURE_INPUT_FIELDS = new EReference("inputFields", XInputField);

	private inputFields = new BasicEList<XInputField>(this, XMultipleMapping.FEATURE_INPUT_FIELDS);

	constructor() {
		super(model.createEClass(XMultipleMapping.XCLASSNAME), [
			XMultipleMapping.FEATURE_INPUT_FIELDS
		]);
	}

	public getInputFields(): EList<XInputField> {
		return this.inputFields;
	}

}
