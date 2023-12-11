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

import ConstantPlan from "webface/plan/ConstantPlan";

import ValuePlanList from "padang/plan/ValuePlanList";
import ParameterPlan from "padang/plan/ParameterPlan";

import InputPlan from "rinjani/plan/InputPlan";

import XInput from "malang/model/XInput";
import XAlgorithm from "malang/model/XAlgorithm";
import XParameter from "malang/model/XParameter";

import AlgorithmPlan from "malang/plan/AlgorithmPlan";
import AlgorithmPlanRegistry from "malang/plan/AlgorithmPlanRegistry";

import AlgorithmPlanDirector from "malang/directors/AlgorithmPlanDirector";

export default class BaseAlgorithmPlanDirector implements AlgorithmPlanDirector {

	public getPlan(name: string): AlgorithmPlan {
		return this.getPlanByName(name);
	}

	public getDefaultName(): string {
		let registry = AlgorithmPlanRegistry.getInstance();
		let plans = registry.listPlans();
		for (let plan of plans) {
			return plan.getName();
		}
		throw new Error("No AlgorithmPlan registered!");
	}

	private getPlanByName(name: string): AlgorithmPlan {
		let registry = AlgorithmPlanRegistry.getInstance();
		let plan = registry.getPlan(name);
		if (plan == null) {
			let registry = AlgorithmPlanRegistry.getInstance();
			return registry.getPlan(name);
		}
		return plan;
	}

	public getDefaultParameters(name: string): Map<string, string> {
		let plan = this.getPlanByName(name);
		let parameters = plan.getHyperParameters();
		let map = new Map<string, string>();
		for (let parameter of parameters) {
			let name = parameter.getName();
			let assignedPlan = parameter.getAssignedPlan();
			if (assignedPlan instanceof ConstantPlan) {
				let defaultValue = assignedPlan.getDefaultValue();
				let literal = defaultValue.toString();
				map.set(name, literal);
			}
		}
		return map;
	}

	public getInputPlans(name: string): InputPlan[] {
		let plan = this.getPlanByName(name);
		return plan.getInputs();
	}

	public getInputPlanList(name: string): ValuePlanList {
		let plan = this.getPlanByName(name);
		return plan.getInputList();
	}

	public listPlanNames(): string[] {
		let names: any[] = [];
		let registry = AlgorithmPlanRegistry.getInstance();
		let plans = registry.listPlans();
		for (let plan of plans) {
			let name = plan.getName();
			names.push(name);
		}
		return names;
	}

	public getDescriptionDetail(name: string): Map<string, any> {
		let map = new Map<string, any>();
		let plan = this.getPlanByName(name);
		let parameterList = plan.getHyperParameterList();
		let argumentList = this.getInputPlanList(name);
		map.set("Name", plan.getName());
		map.set("Hyper-Parameters", parameterList.getNames());
		map.set("Inputs", argumentList.getNames());
		return map;
	}

	private getAlgorithmPlanByModel(model: EObject): AlgorithmPlan {
		let algorithm = <XAlgorithm>util.getAncestor(model, <any>XAlgorithm);
		let name = algorithm.getName();
		let registry = AlgorithmPlanRegistry.getInstance();
		return registry.getPlan(name);
	}

	private getParameterPlan(model: XParameter): ParameterPlan {
		let plan = this.getAlgorithmPlanByModel(model);
		let parameters = plan.getHyperParameters();
		for (let parameter of parameters) {
			if (model.getName() === parameter.getName()) {
				return parameter;
			}
		}
		return null;
	}

	public getParameterType(model: XParameter): string {
		let plan = this.getParameterPlan(model);
		if (plan !== null) {
			let assignedPlan = plan.getAssignedPlan();
			return assignedPlan.xLeanName();
		}
		return null;
	}

	public getParameterLabel(model: XParameter): string {
		let plan = this.getParameterPlan(model);
		if (plan !== null) {
			return plan.getLabel();
		}
		return null;
	}

	public getInputTypes(model: XInput): string[] {
		let plan = this.getAlgorithmPlanByModel(model);
		let list = plan.getInputList();
		let name = model.getName();
		let inputPlan = <InputPlan>list.getPlan(name);
		return inputPlan.getTypes();
	}

}