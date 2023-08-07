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
import InputPlan from "rinjani/plan/InputPlan";

import XModeler from "malang/model/XModeler";
import XInputFeature from "malang/model/XInputFeature";
import XSingleAssignment from "malang/model/XSingleAssignment";
import XAutomatedLearning from "malang/model/XAutomatedLearning";
import XMultipleAssignment from "malang/model/XMultipleAssignment";

import * as directors from "malang/directors";

import Readiness from "malang/directors/readiness/Readiness";
import ReadinessFactory from "malang/directors/readiness/ReadinessFactory";

import FeatureFormulaParser from "malang/directors/FeatureFormulaParser";

import InputDatasetPlotPreload from "malang/directors/preloads/InputDatasetPreload";

export default class AutomatedReadiness extends Readiness {

	public ready(learning: XAutomatedLearning, callback: (message: string) => void): void {

		// Library
		let library = learning.getLibrary();
		let task = learning.getTask();
		let director = directors.getLibraryPlanDirector(this.viewer);
		let plan = director.getTaskPlan(library, task);
		let inputs = plan.getInputs();

		// Inputs
		let message = this.validateInputs(inputs, learning);
		if (message !== null) {
			callback(message);
			return;
		}

		// Dataset
		let preload = new InputDatasetPlotPreload();
		let model = <XModeler>learning.eContainer();
		let expression = preload.createExpression(this.premise, model);
		this.evaluator.getResultBriefListTypes(expression, (types: Map<string, string>) => {

			let message: string = null;
			for (let planInput of inputs) {

				// Input
				let inputName = planInput.getName();
				let modelInput = this.getModelInput(learning, inputName);

				// Satisfied
				let unsatifies: string[] = [];
				let assignment = modelInput.getAssignment();
				if (assignment instanceof XSingleAssignment) {
					let feature = assignment.getInputFeature();
					this.collectUnsatifies(feature, planInput, types, unsatifies);
				} else if (assignment instanceof XMultipleAssignment) {
					let features = assignment.getInputFeatures();
					for (let feature of features) {
						this.collectUnsatifies(feature, planInput, types, unsatifies);
					}
				}
				if (unsatifies.length > 0) {
					let label = planInput.getLabel();
					let types = planInput.getTypes();
					message = "Required " + types + " data type for " + label + " [" + unsatifies + "]";
					break;
				}

			}
			callback(message);

		});
	}

	private collectUnsatifies(feature: XInputFeature, plan: InputPlan, resultTypes: Map<string, string>, unsatifies: string[]): void {
		let value = feature.getValue();
		let parser = new FeatureFormulaParser();
		let name = parser.getColumnName(value);
		let planTypes = plan.getTypes();
		let type = resultTypes.get(name);
		if (planTypes.indexOf(type) === -1) {
			unsatifies.push(name);
		}
	}

}

let registry = ReadinessFactory.getInstance();
registry.register(XAutomatedLearning.XCLASSNAME, AutomatedReadiness);