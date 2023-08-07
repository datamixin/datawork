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

export default class XBooleanDef extends XValueDef {

	public static XCLASSNAME: string = model.getEClassName("XBooleanDef");

	public static FEATURE_VALUE = new EAttribute("value", EAttribute.BOOLEAN);

	private value: boolean = true;

	constructor() {
		super(model.createEClass(XBooleanDef.XCLASSNAME), [
			XBooleanDef.FEATURE_VALUE
		]);
	}

	public getValue(): boolean {
		return this.value;
	}

	public setValue(newValue: boolean): void {
		let oldValue = this.value;
		this.value = newValue;
		this.eSetNotify(XBooleanDef.FEATURE_VALUE, oldValue, newValue);
	}

}
