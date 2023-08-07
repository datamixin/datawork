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
import Point from "webface/graphics/Point";

import * as util from "webface/model/util";
import EObject from "webface/model/EObject";

import ConstantPlan from "webface/plan/ConstantPlan";

import ValuePlanList from "padang/plan/ValuePlanList";
import ParameterPlan from "padang/plan/ParameterPlan";

import GraphicPremise from "padang/ui/GraphicPremise";

import XInput from "rinjani/model/XInput";
import XRoutine from "rinjani/model/XRoutine";
import XParameter from "rinjani/model/XParameter";

import PlotPlan from "rinjani/plan/PlotPlan";
import InputPlan from "rinjani/plan/InputPlan";
import PlotPlanRegistry from "rinjani/plan/PlotPlanRegistry";

import PlotPlanSupport from "rinjani/directors/PlotPlanSupport";
import PlotPlanDirector from "rinjani/directors/PlotPlanDirector";

export default class BasePlotPlanDirector implements PlotPlanDirector {

	private support: PlotPlanSupport = null;

	constructor(premise: GraphicPremise) {
		this.support = new PlotPlanSupport(premise);
	}

	public getPlan(name: string): PlotPlan {
		return this.getPlanByName(name);
	}

	public getDefaultName(): string {
		let registry = PlotPlanRegistry.getInstance();
		let plans = registry.listPlans();
		for (let plan of plans) {
			return plan.getName();
		}
		throw new Error("No PlotPlan registered!");
	}

	private getPlanByName(name: string): PlotPlan {
		let registry = PlotPlanRegistry.getInstance();
		let plan = registry.getPlan(name);
		if (plan == null) {
			let registry = PlotPlanRegistry.getInstance();
			return registry.getPlan(name);
		}
		return plan;
	}

	public getDefaultParameters(name: string): Map<string, string> {
		let plan = this.getPlanByName(name);
		let parameters = plan.getParameters();
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

	public getParameterPlans(name: string): ParameterPlan[] {
		let plan = this.getPlanByName(name);
		return plan.getParameters();
	}

	public listPlanNames(): string[] {
		let names: any[] = [];
		let registry = PlotPlanRegistry.getInstance();
		let plans = registry.listPlans();
		for (let plan of plans) {
			let inputs = plan.getInputs();
			if (inputs.length > 0) {
				let satisfies = 0;
				for (let input of inputs) {
					let types = input.getTypes();
					let accepts = 0;
					for (let type of types) {
						if (InputPlan.isSeriesType(type)) {
							accepts++;
						}
					}
					if (accepts === types.length) {
						satisfies++;
					}
				}
				if (satisfies === inputs.length) {
					let name = plan.getName();
					names.push(name);
				}
			}
		}
		return names;
	}

	public getDescriptionDetail(name: string): Map<string, any> {
		let map = new Map<string, any>();
		let plan = this.getPlanByName(name);
		let parameterList = plan.getParameterList();
		let argumentList = this.getInputPlanList(name);
		map.set("Name", plan.getName());
		map.set("Parameters", parameterList.getNames());
		map.set("Inputs", argumentList.getNames());
		return map;
	}

	public getSourcePreview(name: string, size: Point, callback: (preview: any) => void): void {
		let plotPlan = this.getPlanByName(name);
		this.support.getPreviewResult(plotPlan, size, callback);
	}

	private getPlotPlanByModel(model: EObject): PlotPlan {
		let routine = <XRoutine>util.getAncestor(model, <any>XRoutine);
		let routineName = routine.getName();
		let registry = PlotPlanRegistry.getInstance();
		return registry.getPlan(routineName);
	}

	public getParameterPlan(model: XParameter): ParameterPlan {
		let plan = this.getPlotPlanByModel(model);
		let parameters = plan.getParameters();
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
		let plan = this.getPlotPlanByModel(model);
		let list = plan.getInputList();
		let name = model.getName();
		let inputPlan = <InputPlan>list.getPlan(name);
		return inputPlan.getTypes();
	}

}