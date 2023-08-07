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
import EMap from "webface/model/EMap";
import BasicEMap from "webface/model/BasicEMap";
import EAttribute from "webface/model/EAttribute";
import EReference from "webface/model/EReference";
import BasicEObject from "webface/model/BasicEObject";

import * as model from "padang/model/model";
import XPreparation from "padang/model/XPreparation";

export default class XVariable extends BasicEObject {

	public static XCLASSNAME: string = model.getEClassName("XVariable");

	public static FEATURE_NAME = new EAttribute("name", EAttribute.STRING);
	public static FEATURE_FORMULA = new EAttribute("formula", EAttribute.STRING);
	public static FEATURE_PROPERTIES = new EAttribute("properties", EAttribute.STRING);
	public static FEATURE_PREPARATION = new EReference("preparation", XPreparation);

	private name: string = null;
	private formula: string = null;
	private properties: EMap<string> = new BasicEMap<string>(this, XVariable.FEATURE_PROPERTIES);
	private preparation: XPreparation = null;

	constructor() {
		super(model.createEClass(XVariable.XCLASSNAME), [
			XVariable.FEATURE_NAME,
			XVariable.FEATURE_FORMULA,
			XVariable.FEATURE_PROPERTIES,
			XVariable.FEATURE_PREPARATION,
		]);
	}

	public getName(): string {
		return this.name;
	}

	public setName(newName: string) {
		let oldName = this.name;
		this.name = newName;
		this.eSetNotify(XVariable.FEATURE_NAME, oldName, newName);
	}

	public getFormula(): string {
		return this.formula;
	}

	public setFormula(newFormula: string) {
		let oldFormula = this.formula;
		this.formula = newFormula;
		this.eSetNotify(XVariable.FEATURE_FORMULA, oldFormula, newFormula);
	}

	public getProperties(): EMap<string> {
		return this.properties;
	}

	public getPreparation(): XPreparation {
		return this.preparation;
	}

	public setPreparation(newPreparation: XPreparation): void {
		let oldPreparation = this.preparation;
		this.preparation = newPreparation;
		this.eSetNotify(XVariable.FEATURE_PREPARATION, oldPreparation, newPreparation);
	}

}