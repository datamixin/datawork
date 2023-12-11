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
import XModeler from "malang/model/XModeler";
import XInput from "malang/model/XInput";
import XInputFeature from "malang/model/XInputFeature";
import XSingleAssignment from "malang/model/XSingleAssignment";
import XMultipleAssignment from "malang/model/XMultipleAssignment";

import FeatureFormulaParser from "malang/directors/FeatureFormulaParser";

export default class InputFeatureReader {

	private model: XModeler = null;

	constructor(model: XModeler) {
		this.model = model
	}

	public getFeatureNames(): string[] {
		let inputs = this.model.getInputs();
		let names: string[] = [];
		for (let input of inputs) {
			this.collectInputFeatureNames(names, input);
		}
		return names;
	}

	private collectInputFeatureNames(names: string[], input: XInput): void {
		let assignment = input.getAssignment();
		if (assignment instanceof XSingleAssignment) {
			let feature = assignment.getInputFeature();
			this.collectFeatureNames(feature, names);
		} else if (assignment instanceof XMultipleAssignment) {
			let features = assignment.getInputFeatures();
			for (let feature of features) {
				this.collectFeatureNames(feature, names);
			}
		}
	}

	public getInputFeatureNames(name: string): string[] {
		let inputs = this.model.getInputs();
		let names: string[] = [];
		for (let input of inputs) {
			if (input.getName() === name) {
				this.collectInputFeatureNames(names, input);
			}
		}
		return names;
	}

	private collectFeatureNames(feature: XInputFeature, names: string[]): void {
		if (feature !== null) {
			let value = feature.getValue();
			let parser = new FeatureFormulaParser();
			let name = parser.getColumnName(value);
			names.push(name);
		}
	}

	public buildFeatureNameFormulas(): Map<string, string> {
		let inputs = this.model.getInputs();
		let nameFormulas = new Map<string, string>();
		for (let input of inputs) {
			this.collectFeatureNameFormulasByInput(nameFormulas, input);
		}
		return nameFormulas;
	}

	private collectFeatureNameFormulasByInput(formulas: Map<string, any>, input: XInput): void {
		let assignment = input.getAssignment();
		if (assignment instanceof XSingleAssignment) {
			let feature = assignment.getInputFeature();
			this.collectFeatureNameFormulas(feature, formulas);
		} else if (assignment instanceof XMultipleAssignment) {
			let features = assignment.getInputFeatures();
			for (let feature of features) {
				this.collectFeatureNameFormulas(feature, formulas);
			}
		}
	}

	public buildInputFeatureNameFormulas(key: string): Map<string, string> {
		let inputs = this.model.getInputs();
		let nameFormulas = new Map<string, string>();
		for (let input of inputs) {
			let name = input.getName();
			if (name === key) {
				this.collectFeatureNameFormulasByInput(nameFormulas, input);
			}
		}
		return nameFormulas;
	}

	private collectFeatureNameFormulas(feature: XInputFeature, formulas: Map<string, any>): void {
		if (feature !== null) {
			let value = feature.getValue();
			let parser = new FeatureFormulaParser();
			let name = parser.getColumnName(value);
			formulas.set(name, value);
		}
	}

}