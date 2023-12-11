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

import SText from "sleman/SText";

import Printer from "sleman/model/Printer";
import * as model from "sleman/model/model";
import XConstant from "sleman/model/XConstant";

export default class XText extends XConstant implements SText {

	public static XCLASSNAME: string = model.getEClassName("XText");

	public static FEATURE_VALUE = new EAttribute("value", EAttribute.STRING);

	private value: string = null;

	constructor() {
		super(model.createEClass(XText.XCLASSNAME), [
			XText.FEATURE_VALUE
		]);
	}

	public getValue(): string {
		return this.value;
	}

	public setValue(newValue: string): void {
		let oldValue = this.value;
		this.value = newValue;
		this.eSetNotify(XText.FEATURE_VALUE, oldValue, newValue);
	}

	public print(printer: Printer): void {
		let literal = JSON.stringify(this.value);
		printer.term(literal);
	}

	public toValue(): string {
		return this.value;
	}

	public toString(): string {
		return this.toLiteral();
	}
}
