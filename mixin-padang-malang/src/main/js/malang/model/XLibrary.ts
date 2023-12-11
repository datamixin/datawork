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
import EAttribute from "webface/model/EAttribute";
import BasicEList from "webface/model/BasicEList";
import EReference from "webface/model/EReference";
import BasicEObject from "webface/model/BasicEObject";

import * as model from "malang/model/model";
import XParameter from "malang/model/XParameter";

export default class XLibrary extends BasicEObject {

	public static XCLASSNAME: string = model.getEClassName("XLibrary");

	public static FEATURE_NAME = new EAttribute("name", EAttribute.STRING);
	public static FEATURE_PARAMETERS = new EReference("parameters", XParameter);

	private name: string = null;
	private parameters = new BasicEList<XParameter>(this, XLibrary.FEATURE_PARAMETERS);

	constructor() {
		super(model.createEClass(XLibrary.XCLASSNAME), [
			XLibrary.FEATURE_NAME,
			XLibrary.FEATURE_PARAMETERS,
		]);
	}

	public getName(): string {
		return this.name;
	}

	public setName(newName: string): void {
		let oldName = this.name;
		this.name = newName;
		this.eSetNotify(XLibrary.FEATURE_NAME, oldName, newName);
	}

	public getParameters(): EList<XParameter> {
		return this.parameters;
	}

}
