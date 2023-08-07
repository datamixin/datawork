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
import * as util from "webface/model/util";
import EObject from "webface/model/EObject";

import ConstantPlan from "webface/plan/ConstantPlan";

import ValuePlan from "padang/plan/ValuePlan";
import ParameterPlan from "padang/plan/ParameterPlan";

import XLibrary from "malang/model/XLibrary";
import XParameter from "malang/model/XParameter";
import XAutomatedTask from "malang/model/XAutomatedTask";

import LibraryPlan from "malang/plan/LibraryPlan";
import AutomatedTaskPlan from "malang/plan/AutomatedTaskPlan";
import LibraryPlanRegistry from "malang/plan/LibraryPlanRegistry";

import LibraryPlanDirector from "malang/directors/LibraryPlanDirector";

export default class BaseLibraryPlanDirector implements LibraryPlanDirector {

	public getPlan(library: string | XLibrary): LibraryPlan {
		if (library instanceof XLibrary) {
			let name = library.getName();
			return this.getPlanByName(name);
		} else {
			return this.getPlanByName(<string>library);
		}
	}

	public getDefaultName(): string {
		let registry = LibraryPlanRegistry.getInstance();
		let plans = registry.listPlans();
		for (let plan of plans) {
			return plan.getName();
		}
		throw new Error("No LibraryPlan registered!");
	}

	public listPlanNames(): string[] {
		let registry = LibraryPlanRegistry.getInstance();
		let plans = registry.listPlans();
		return this.listValuePlanNames(plans);
	}

	private listValuePlanNames(plans: Iterable<ValuePlan>): string[] {
		let names: any[] = [];
		for (let plan of plans) {
			let name = plan.getName();
			names.push(name);
		}
		return names;
	}

	private getPlanByName(name: string): LibraryPlan {
		let registry = LibraryPlanRegistry.getInstance();
		return registry.getPlan(name);
	}

	public getDefaultSettings(name: string): Map<string, string> {
		let plan = this.getPlanByName(name);
		let parameters = plan.getSettings();
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

	public getDescriptionDetail(name: string): Map<string, any> {
		let map = new Map<string, any>();
		let plan = this.getPlanByName(name);
		let parameterList = plan.getSettingList();
		map.set("Name", plan.getName());
		map.set("Settings", parameterList.getNames());
		return map;
	}

	public listTaskPlanNames(library: string): Map<string, string> {
		let plan = this.getPlan(library);
		let plans = plan.getTaskPlans();
		let names = new Map<string, string>();
		for (let plan of plans) {
			let name = plan.getName();
			let label = plan.getLabel();
			names.set(name, label);
		}
		return names;
	}

	private getTaskPlanByName(library: string, task: string): AutomatedTaskPlan {
		let plan = this.getPlan(library);
		let plans = plan.getTaskPlans();
		for (let plan of plans) {
			if (plan.getName() === task) {
				return plan;
			}
		}
		return null;
	}

	public getTaskPlan(library: string | XLibrary, task: string | XAutomatedTask): AutomatedTaskPlan {
		let plan = this.getPlan(library);
		let lib = plan.getName();
		if (task instanceof XAutomatedTask) {
			let name = task.getName();
			return this.getTaskPlanByName(lib, name);
		} else {
			return this.getTaskPlanByName(lib, <string>task);
		}
	}

	public getTaskDescriptionDetail(library: string, task: string): Map<string, any> {
		let map = new Map<string, any>();
		let plan = this.getTaskPlanByName(library, task);
		let inputList = plan.getInputList();
		map.set("Name", plan.getName());
		map.set("Inputs", inputList.getNames());
		return map;
	}

	private getLibraryPlanByModel(model: EObject): LibraryPlan {
		let algorithm = <XLibrary>util.getAncestor(model, <any>XLibrary);
		let name = algorithm.getName();
		let registry = LibraryPlanRegistry.getInstance();
		return registry.getPlan(name);
	}

	private getSettingPlan(model: XParameter): ParameterPlan {
		let plan = this.getLibraryPlanByModel(model);
		let parameters = plan.getSettings();
		for (let parameter of parameters) {
			if (model.getName() === parameter.getName()) {
				return parameter;
			}
		}
		return null;
	}

	public getSettingType(model: XParameter): string {
		let plan = this.getSettingPlan(model);
		if (plan !== null) {
			let assignedPlan = plan.getAssignedPlan();
			return assignedPlan.xLeanName();
		}
		return null;
	}

	public getSettingLabel(model: XParameter): string {
		let plan = this.getSettingPlan(model);
		if (plan !== null) {
			return plan.getLabel();
		}
		return null;
	}

}