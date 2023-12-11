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
import * as util from "webface/model/util";
import EObject from "webface/model/EObject";

import BuilderPremise from "padang/ui/BuilderPremise";

import InputPlan from "rinjani/plan/InputPlan";

import XInput from "malang/model/XInput";
import XModeler from "malang/model/XModeler";
import XSingleAssignment from "malang/model/XSingleAssignment";
import XMultipleAssignment from "malang/model/XMultipleAssignment";

import BuilderPartViewer from "malang/ui/BuilderPartViewer";

import BuilderPremiseEvaluator from "malang/directors/BuilderPremiseEvaluator";

export abstract class Readiness {

	public static RESULT = "Result";

	protected viewer: BuilderPartViewer = null;
	protected premise: BuilderPremise = null;
	protected evaluator: BuilderPremiseEvaluator = null;

	constructor(viewer: BuilderPartViewer, premise: BuilderPremise) {
		this.viewer = viewer;
		this.premise = premise;
		this.evaluator = new BuilderPremiseEvaluator(premise);
	}

	public validateInputs(plans: InputPlan[], object: EObject): string {
		let model = <XModeler>util.getAncestor(object, XModeler);
		let inputs = model.getInputs();
		for (let plan of plans) {
			let name = plan.getName();
			for (let input of inputs) {
				if (name === input.getName()) {
					let assignment = input.getAssignment();
					if (assignment instanceof XSingleAssignment) {
						let feature = assignment.getInputFeature();
						if (feature === null) {
							return "Missing required feature '" + name + "'";
						}
					} else if (assignment instanceof XMultipleAssignment) {
						let features = assignment.getInputFeatures();
						if (features.size === 0) {
							return "Required at least on feature '" + name + "'";
						}
					}
				}
			}
		}
		return null;
	}

	protected getModelInput(object: EObject, name: string): XInput {
		let model = <XModeler>util.getAncestor(object, XModeler);
		let inputs = model.getInputs();
		for (let input of inputs) {
			if (input.getName() === name) {
				return input;
			}
		}
		throw new Error("Missing model input '" + name + "'");
	}

	abstract ready(model: EObject, callback: (message: string) => void): void;

}

export default Readiness;