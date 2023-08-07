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
import EReference from "webface/model/EReference";
import BasicEObject from "webface/model/BasicEObject";

import * as model from "rinjani/model/model";
import XInputMapping from "rinjani/model/XInputMapping";

export default class XInput extends BasicEObject {

	public static XCLASSNAME: string = model.getEClassName("XInput");

	public static FEATURE_NAME = new EAttribute("name", EAttribute.STRING);
	public static FEATURE_MAPPING = new EReference("mapping", XInputMapping);

	private name: string = null;
	private mapping: XInputMapping = null;

	constructor() {
		super(model.createEClass(XInput.XCLASSNAME), [
			XInput.FEATURE_NAME,
			XInput.FEATURE_MAPPING,
		]);
	}

	public getName(): string {
		return this.name;
	}

	public setName(newName: string): void {
		let oldName = this.name;
		this.name = newName;
		this.eSetNotify(XInput.FEATURE_NAME, oldName, newName);
	}

	public getMapping(): XInputMapping {
		return this.mapping;
	}

	public setMapping(newMapping: XInputMapping): void {
		let oldMapping = this.mapping;
		this.mapping = newMapping;
		this.eSetNotify(XInput.FEATURE_MAPPING, oldMapping, newMapping);
	}

}
