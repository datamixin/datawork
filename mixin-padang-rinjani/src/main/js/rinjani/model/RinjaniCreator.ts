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
import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import ConstantPlan from "webface/plan/ConstantPlan";

import ParameterPlan from "padang/plan/ParameterPlan";

import XInput from "rinjani/model/XInput";
import XRoutine from "rinjani/model/XRoutine";
import XParameter from "rinjani/model/XParameter";
import XInputField from "rinjani/model/XInputField";
import RinjaniFactory from "rinjani/model/RinjaniFactory";

import * as directors from "rinjani/directors";

import InputPlan from "rinjani/plan/InputPlan";

export default class RinjaniCreator {

	public static eINSTANCE: RinjaniCreator = null;

	public createRoutine(): XRoutine {

		// Routine
		let factory = RinjaniFactory.eINSTANCE;
		let routine = factory.createRoutine();

		let result = factory.createResult();
		routine.setResult(result);

		return routine;
	}

	public createInput(plan: InputPlan): XInput {

		// Input
		let factory = RinjaniFactory.eINSTANCE;
		let input = factory.createInput();
		let name = plan.getName();
		input.setName(name);

		// Assignment
		if (plan.isSingle()) {
			let mapping = factory.createSingleMapping();
			input.setMapping(mapping);
		} else {
			let mapping = factory.createMultipleMapping();
			input.setMapping(mapping);
		}

		return input;
	}

	public createParameter(plan: ParameterPlan): XParameter {

		// Input
		let factory = RinjaniFactory.eINSTANCE;
		let parameter = factory.createParameter();
		let name = plan.getName();
		parameter.setName(name);

		let assigned = plan.getAssignedPlan();
		if (assigned instanceof ConstantPlan) {
			let value = assigned.getDefaultValue();
			if (value !== undefined || value !== null) {
				parameter.setValue(value.toString());
			}
		}
		return parameter;
	}

	public createInputList(controller: Controller | PartViewer, name: string): XInput[] {
		let director = directors.getPlotPlanDirector(controller);
		let plans = director.getInputPlans(name);
		let inputs: XInput[] = [];
		for (let plan of plans) {
			let model = this.createInput(plan);
			inputs.push(model);
		}
		return inputs;
	}

	public createParameterList(controller: Controller | PartViewer, name: string): XParameter[] {
		let director = directors.getPlotPlanDirector(controller);
		let plans = director.getParameterPlans(name);
		let parameters: XParameter[] = [];
		for (let plan of plans) {
			let model = this.createParameter(plan);
			parameters.push(model);
		}
		return parameters;
	}

	public createInputField(formula: string): XInputField {
		let factory = RinjaniFactory.eINSTANCE;
		let feature = factory.createInputField();
		feature.setValue(formula);
		return feature;
	}

}

RinjaniCreator.eINSTANCE = new RinjaniCreator();
