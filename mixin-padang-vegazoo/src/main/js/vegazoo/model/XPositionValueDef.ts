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
import EAttribute from "webface/model/EAttribute";

import * as model from "vegazoo/model/model";
import XObjectDef from "vegazoo/model/XObjectDef";
import XPositionDef from "vegazoo/model/XPositionDef";

export default class XPositionValueDef extends XObjectDef implements XPositionDef {

	public static XCLASSNAME: string = model.getEClassName("XPositionValueDef");

	public static FEATURE_DATUM = new EAttribute("value", EAttribute.STRING);

	private value: number = null;

	constructor() {
		super(model.createEClass(XPositionValueDef.XCLASSNAME), [
			XPositionValueDef.FEATURE_DATUM,
		]);
	}

	public getValue(): number {
		return this.value;
	}

	public setValue(newValue: number) {
		let oldValue = this.value;
		this.value = newValue;
		this.eSetNotify(XPositionValueDef.FEATURE_DATUM, oldValue, newValue);
	}

}