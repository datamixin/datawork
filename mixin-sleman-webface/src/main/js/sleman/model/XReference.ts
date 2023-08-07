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

import Printer from "sleman/model/Printer";
import * as model from "sleman/model/model";
import XPointer from "sleman/model/XPointer";

import SReference from "sleman/SReference";

import ExpressionParser from "sleman/base/ExpressionParser";

export default class XReference extends XPointer implements SReference {

	public static XCLASSNAME: string = model.getEClassName("XReference");

	public static FEATURE_NAME = new EAttribute("name", EAttribute.STRING);

	private name: string;

	constructor() {
		super(model.createEClass(XReference.XCLASSNAME), [
			XReference.FEATURE_NAME,
		]);
	}

	public getName(): string {
		return this.name;
	}

	public setName(newName: string): void {
		let oldName = this.name;
		this.name = newName;
		this.eSetNotify(XReference.FEATURE_NAME, oldName, newName);
	}

	public print(printer: Printer): void {
		if (this.name !== null) {
			let name = ExpressionParser.promoteBacktick(this.name);
			printer.term(name);
		}
	}

	public toString(): string {
		return this.toLiteral();
	}

}
