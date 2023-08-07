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
import EAttribute from "webface/model/EAttribute";
import BasicEList from "webface/model/BasicEList";
import EReference from "webface/model/EReference";
import BasicEObject from "webface/model/BasicEObject";

import * as model from "malang/model/model";
import XParameter from "malang/model/XParameter";

export default class XAlgorithm extends BasicEObject {

	public static XCLASSNAME: string = model.getEClassName("XAlgorithm");

	public static FEATURE_NAME = new EAttribute("name", EAttribute.STRING);
	public static FEATURE_HYPER_PARAMETERS = new EReference("hyperParameters", XParameter);

	private name: string = null;
	private hyperParameters = new BasicEList<XParameter>(this, XAlgorithm.FEATURE_HYPER_PARAMETERS);

	constructor() {
		super(model.createEClass(XAlgorithm.XCLASSNAME), [
			XAlgorithm.FEATURE_NAME,
			XAlgorithm.FEATURE_HYPER_PARAMETERS,
		]);
	}

	public getName(): string {
		return this.name;
	}

	public setName(newName: string): void {
		let oldName = this.name;
		this.name = newName;
		this.eSetNotify(XAlgorithm.FEATURE_NAME, oldName, newName);
	}

	public getHyperParameters(): EList<XParameter> {
		return this.hyperParameters;
	}

}
