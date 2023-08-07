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
import XList from "sleman/model/XList";
import XAssignment from "sleman/model/XAssignment";
import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

import BuilderPremise from "padang/ui/BuilderPremise";

import InputPlan from "rinjani/plan/InputPlan";

import BaseMaker from "rinjani/directors/plots/BaseMaker";

import XModeler from "malang/model/XModeler";
import XInputFeature from "malang/model/XInputFeature";
import XSingleAssignment from "malang/model/XSingleAssignment";
import XSupervisedLearning from "malang/model/XSupervisedLearning";
import XMultipleAssignment from "malang/model/XMultipleAssignment";

import AlgorithmPlan from "malang/plan/AlgorithmPlan";
import InputFeatureReader from "malang/directors/InputFeatureReader";
import PreprocessingReader from "malang/directors/PreprocessingReader";

export default class AssignmentMaker {

	private maker = new BaseMaker();
	private premise: BuilderPremise = null;

	constructor(premise: BuilderPremise) {
		this.premise = premise;
	}

	public createInputAssignments(plans: InputPlan[], model: XModeler): XAssignment[] {
		let assignments: XAssignment[] = [];
		let inputs = model.getInputs();
		for (let plan of plans) {
			let name = plan.getName();
			for (let input of inputs) {
				if (name === input.getName()) {
					let assignment = input.getAssignment();
					if (assignment instanceof XSingleAssignment) {
						let feature = assignment.getInputFeature();
						let expression = this.createExpression(this.premise, feature);
						let argument = this.maker.createAssignment(name, expression);
						assignments.push(argument);
					} else if (assignment instanceof XMultipleAssignment) {
						let features = assignment.getInputFeatures();
						let list = this.maker.createList();
						for (let feature of features) {
							let expression = this.createExpression(this.premise, feature);
							list.addElement(expression);
						}
						let argument = this.maker.createAssignment(name, list);
						assignments.push(argument);
					}
				}
			}
		}
		return assignments;
	}

	private createExpression(premise: BuilderPremise, feature: XInputFeature): XExpression {
		let literal = feature.getValue();
		let expression = premise.parse(literal);
		return expression;
	}

	public createPreprocessedAssignments(plan: AlgorithmPlan, model: XModeler): XAssignment[] {

		let assignments: XAssignment[] = [];
		let plans = plan.getInputs();
		for (let plan of plans) {

			let name = plan.getName();
			let factory = SlemanFactory.eINSTANCE;
			let list = this.createPreprocessedExpression(model, name);
			if (plan.isSingle() === true) {

				let elements = list.getElements();
				let element = elements.get(0);
				let assignment = factory.createXAssignment(name, element);
				assignments.push(assignment);

			} else {

				let assignment = factory.createXAssignment(name, list);
				assignments.push(assignment);

			}

		}
		return assignments;

	}

	private createPreprocessedExpression(model: XModeler, name: string): XList {
		let learning = <XSupervisedLearning>model.getLearning();
		let proprocessing = learning.getPreprocessing();
		let inputs = new InputFeatureReader(model);
		let factory = SlemanFactory.eINSTANCE;
		let list = factory.createXList();
		let formulas = inputs.buildInputFeatureNameFormulas(name);
		for (let name of formulas.keys()) {
			let formula = formulas.get(name);
			let reader = new PreprocessingReader(this.premise, proprocessing);
			let names = reader.getPreprocessedNames(formula);
			for (let name of names) {
				let preprocessed = reader.getPreprocessedResultPointer();
				let member = factory.createXMember(preprocessed, name);
				list.addElement(member);
			}
		}
		return list;
	}

	public createVariableAssignments(names: string[]): XAssignment[] {
		let assignments: XAssignment[] = [];
		for (let name of names) {
			if (this.premise.isVariableExists(name)) {
				let expression = this.maker.createReference(name);
				let argument = this.maker.createAssignment(name, expression);
				assignments.push(argument);
			}
		}
		return assignments;
	}

}