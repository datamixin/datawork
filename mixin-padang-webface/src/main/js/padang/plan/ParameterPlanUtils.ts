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
import MapPlan from "webface/plan/MapPlan";
import AnyPlan from "webface/plan/AnyPlan";
import ListPlan from "webface/plan/ListPlan";
import TextPlan from "webface/plan/TextPlan";
import NumberPlan from "webface/plan/NumberPlan";
import LogicalPlan from "webface/plan/LogicalPlan";
import SpecifiedPlan from "webface/plan/SpecifiedPlan";

import ParameterPlan from "padang/plan/ParameterPlan";

export default class ParameterPlanUtils {

	public static createTextPlan(name: string, label: string, description: string,
		defaultValue?: string, assignable?: string): ParameterPlan {
		let parameter = new ParameterPlan(name, label, description);
		let plan = new TextPlan(defaultValue);
		plan.setAssignable(assignable === undefined ? null : assignable);
		parameter.setAssigned(plan);
		return parameter;
	}

	public static createNumberPlan(name: string, label: string, description: string,
		defaultValue?: number, assignable?: string): ParameterPlan {
		let parameter = new ParameterPlan(name, label, description);
		let plan = new NumberPlan(defaultValue);
		plan.setAssignable(assignable === undefined ? null : assignable);
		parameter.setAssigned(plan);
		return parameter;
	}

	public static createLogicalPlan(name: string, label: string, description: string,
		defaultValue?: boolean): ParameterPlan {
		let parameter = new ParameterPlan(name, label, description);
		let plan = new LogicalPlan(defaultValue);
		parameter.setAssigned(plan);
		return parameter;
	}

	public static createListPlan(name: string, label: string, description: string,
		element: SpecifiedPlan): ParameterPlan {
		let parameter = new ParameterPlan(name, label, description);
		let plan = new ListPlan(element);
		parameter.setAssigned(plan);
		return parameter;
	}

	public static createMapPlan(name: string, label: string, description: string,
		key: SpecifiedPlan, value: SpecifiedPlan): ParameterPlan {
		let parameter = new ParameterPlan(name, label, description);
		let plan = new MapPlan(key, value);
		parameter.setAssigned(plan);
		return parameter;
	}

	public static createAnyPlan(name: string, label: string, description: string,
		assignable?: string, type?: string): ParameterPlan {
		let parameter = new ParameterPlan(name, label, description);
		let plan = new AnyPlan(type);
		plan.setAssignable(assignable);
		parameter.setAssigned(plan);
		return parameter;
	}

}