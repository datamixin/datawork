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
import XArgument from "sleman/model/XArgument";
import XAssignment from "sleman/model/XAssignment";
import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";
import { expressionFactory } from "sleman/ExpressionFactory";

import VisageValue from "bekasi/visage/VisageValue";

import BuilderPremise from "padang/ui/BuilderPremise";

import BaseMaker from "rinjani/directors/plots/BaseMaker";

import AlgorithmPlan from "malang/plan/AlgorithmPlan";

export abstract class Algorithm {

	protected maker = new BaseMaker();
	protected premise: BuilderPremise = null;
	protected parameters: Map<string, VisageValue> = null;

	constructor(premise: BuilderPremise, parameters: Map<string, VisageValue>) {
		this.premise = premise;
		this.parameters = parameters;
	}

	protected addModelFirst(plan: AlgorithmPlan, name: string, assignments: XAssignment[]): void {
		let parameters = this.createAssigments(plan);
		let model = this.maker.createCall(name, parameters);
		let first = this.maker.createArgument(model);
		(<XArgument[]>assignments).splice(0, 0, first);
	}

	protected createAssigments(plan: AlgorithmPlan): XAssignment[] {
		let assignments: XAssignment[] = [];
		let parameterPlans = plan.getHyperParameters();
		for (let parameterPlan of parameterPlans) {
			let name = parameterPlan.getName();
			let value = this.parameters.get(name);
			let expression = <XExpression><any>expressionFactory.createValue(value);
			let factory = SlemanFactory.eINSTANCE;
			let assignment = factory.createXAssignment(name, expression);
			assignments.push(assignment);
		}
		return assignments;
	}

	protected executeCall(name: string, assignments: XAssignment[], result: string, callback: () => void): void {
		let call = this.maker.createCall(name, assignments);
		if (this.premise.isVariableExists(result)) {

			// Rubah variable baru untuk menyimpan expression baru
			this.premise.setVariableExpression(result, call, callback);

		} else {

			// Tambah variable baru untuk menyimpan variable baru
			this.premise.addVariable(result, call, callback);

		}
	}

	abstract execute(assignments: XAssignment[], result: string, callback: () => void): void;

}

export default Algorithm;