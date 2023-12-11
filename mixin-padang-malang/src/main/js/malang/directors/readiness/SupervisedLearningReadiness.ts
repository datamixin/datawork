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
import InputPlan from "rinjani/plan/InputPlan";

import XInputFeature from "malang/model/XInputFeature";
import XPreprocessing from "malang/model/XPreprocessing";
import XBasicTraining from "malang/model/XBasicTraining";
import XSingleAssignment from "malang/model/XSingleAssignment";
import XSupervisedLearning from "malang/model/XSupervisedLearning";
import XMultipleAssignment from "malang/model/XMultipleAssignment";

import * as directors from "malang/directors";

import Readiness from "malang/directors/readiness/Readiness";

import AlgorithmPlanRegistry from "malang/plan/AlgorithmPlanRegistry";

import PreprocessingReader from "malang/directors/PreprocessingReader";

import ReadinessFactory from "malang/directors/readiness/ReadinessFactory";

export default class AlgorithmReadiness extends Readiness {

	public ready(learning: XSupervisedLearning, callback: (message: string) => void): void {

		// Training
		let training = <XBasicTraining>learning.getTraining();

		// Algorithm
		let algorithm = training.getEstimator();
		let name = algorithm.getName();
		if (name === null) {
			callback("Please select Learning Algorithm!");
			return;
		}

		// Inputs
		let registry = AlgorithmPlanRegistry.getInstance();
		let plan = registry.getPlan(name);
		let planInputs = plan.getInputs();
		let message = this.validateInputs(planInputs, learning);
		if (message !== null) {
			callback(message);
			return;
		}

		let preprocessing = learning.getPreprocessing();
		let director = directors.getPreprocessingDirector(this.viewer);
		director.preparePreprocessingVariable(preprocessing, () => {

			// Feature types
			let reader = new PreprocessingReader(this.premise, preprocessing);
			let literal = reader.getPreprocessedResultPointerLiteral();
			this.evaluator.getResultBriefListTypes(literal, (types: Map<string, string>) => {

				let message: string = null;
				for (let planInput of planInputs) {

					// Check input
					let inputName = planInput.getName();
					let modelInput = this.getModelInput(learning, inputName);

					// Input exists
					let unsatifies: string[] = [];
					let assignment = modelInput.getAssignment();
					if (assignment instanceof XSingleAssignment) {
						let feature = assignment.getInputFeature();
						this.collectUnsatifies(preprocessing, feature, planInput, types, unsatifies);
					} else if (assignment instanceof XMultipleAssignment) {
						let features = assignment.getInputFeatures();
						for (let feature of features) {
							this.collectUnsatifies(preprocessing, feature, planInput, types, unsatifies);
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
		});

	}

	private collectUnsatifies(preprocessing: XPreprocessing, feature: XInputFeature,
		plan: InputPlan, resultTypes: Map<string, string>, unsatifies: string[]): void {
		let value = feature.getValue();
		let reader = new PreprocessingReader(this.premise, preprocessing);
		let names = reader.getPreprocessedNames(value);
		let planTypes = plan.getTypes();
		for (let name of names) {
			let type = resultTypes.get(name);
			if (planTypes.indexOf(type) === -1) {
				unsatifies.push(name);
			}
		}
	}

}

let registry = ReadinessFactory.getInstance();
registry.register(XSupervisedLearning.XCLASSNAME, AlgorithmReadiness);