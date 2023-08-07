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
import EReference from "webface/model/EReference";
import BasicEList from "webface/model/BasicEList";
import BasicEObject from "webface/model/BasicEObject";

import * as model from "padang/model/model";
import XVariable from "padang/model/XVariable";

export default class XBuilder extends BasicEObject {

	public static XCLASSNAME: string = model.getEClassName("XBuilder");

	public static FEATURE_REVISION = new EAttribute("revision", EAttribute.STRING);
	public static FEATURE_STRUCTURE = new EAttribute("structure", EAttribute.STRING);
	public static FEATURE_EXPLANATION = new EAttribute("explanation", EAttribute.STRING);
	public static FEATURE_VARIABLES = new EReference("variables", XVariable);

	private revision: string = null;
	private structure: string = null;
	private explanation: string = null;
	private variables: EList<XVariable> = new BasicEList<XVariable>(this, XBuilder.FEATURE_VARIABLES);

	constructor() {
		super(model.createEClass(XBuilder.XCLASSNAME), [
			XBuilder.FEATURE_REVISION,
			XBuilder.FEATURE_STRUCTURE,
			XBuilder.FEATURE_EXPLANATION,
			XBuilder.FEATURE_VARIABLES,
		]);
	}

	public getRevision(): string {
		return this.revision;
	}

	public setRevision(newRevision: string) {
		let oldRevision = this.revision;
		this.revision = newRevision;
		this.eSetNotify(XBuilder.FEATURE_STRUCTURE, oldRevision, newRevision);
	}

	public getStructure(): string {
		return this.structure;
	}

	public setStructure(newStructure: string) {
		let oldStructure = this.structure;
		this.structure = newStructure;
		this.eSetNotify(XBuilder.FEATURE_STRUCTURE, oldStructure, newStructure);
	}

	public getExplanation(): string {
		return this.explanation;
	}

	public setExplanation(newExplanation: string) {
		let oldExplanation = this.explanation;
		this.explanation = newExplanation;
		this.eSetNotify(XBuilder.FEATURE_EXPLANATION, oldExplanation, newExplanation);
	}

	public getVariables(): EList<XVariable> {
		return this.variables;
	}

}