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
import XAssignment from "sleman/model/XAssignment";
import XExpression from "sleman/model/XExpression";

import GraphicPremise from "padang/ui/GraphicPremise";

import XRoutine from "rinjani/model/XRoutine";
import XInputField from "rinjani/model/XInputField";
import XSingleMapping from "rinjani/model/XSingleMapping";
import XMultipleMapping from "rinjani/model/XMultipleMapping";

import RoutinePlan from "rinjani/plan/RoutinePlan";

import BaseMaker from "rinjani/directors/plots/BaseMaker";

export default class MappingMaker {

	private maker = new BaseMaker();
	private premise: GraphicPremise = null;

	constructor(premise: GraphicPremise) {
		this.premise = premise;
	}

	public validateInputs(plan: RoutinePlan, routine: XRoutine): string {
		let inputs = routine.getInputs();
		let plans = plan.getInputs();
		for (let plan of plans) {
			let name = plan.getName();
			for (let input of inputs) {
				if (name === input.getName()) {
					let mapping = input.getMapping();
					if (mapping instanceof XSingleMapping) {
						let field = mapping.getInputField();
						if (field === null) {
							return "Missing required field '" + name + "'";
						}
					} else if (mapping instanceof XMultipleMapping) {
						let fields = mapping.getInputFields();
						if (fields.size === 0) {
							return "Required at least on field '" + name + "'";
						}
					}
				}
			}
		}
		return null;
	}

	public createAssignments(plan: RoutinePlan, routine: XRoutine): XAssignment[] {
		let assignments: XAssignment[] = [];
		let inputs = routine.getInputs();
		let plans = plan.getInputs();
		for (let plan of plans) {
			let name = plan.getName();
			for (let input of inputs) {
				if (name === input.getName()) {
					let mapping = input.getMapping();
					if (mapping instanceof XSingleMapping) {
						let field = mapping.getInputField();
						let expression = this.createExpression(this.premise, field);
						let argument = this.maker.createAssignment(name, expression);
						assignments.push(argument);
					} else if (mapping instanceof XMultipleMapping) {
						let fields = mapping.getInputFields();
						let list = this.maker.createList();
						for (let field of fields) {
							let expression = this.createExpression(this.premise, field);
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

	private createExpression(premise: GraphicPremise, field: XInputField): XExpression {
		let literal = field.getValue();
		let expression = premise.parse(literal);
		return expression;
	}

}