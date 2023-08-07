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
import EAttribute from "webface/model/EAttribute";

import * as model from "vegazoo/model/model";
import XValueDef from "vegazoo/model/XValueDef";

export default class XColorStringDef extends XValueDef {

	public static XCLASSNAME: string = model.getEClassName("XColorStringDef");

	public static FEATURE_VALUE = new EAttribute("value", EAttribute.STRING);

	private value: string = null;

	constructor() {
		super(model.createEClass(XColorStringDef.XCLASSNAME), [
			XColorStringDef.FEATURE_VALUE,
		]);
	}

	public getValue(): string {
		return this.value;
	}

	public setValue(newValue: string) {
		let oldValue = this.value;
		this.value = newValue;
		this.eSetNotify(XColorStringDef.FEATURE_VALUE, oldValue, newValue);
	}

}