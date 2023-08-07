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
import ConstantPlan from "webface/plan/ConstantPlan";

import XConstant from "sleman/model/XConstant";

import VisageConstant from "bekasi/visage/VisageConstant";

import ParameterPlan from "padang/plan/ParameterPlan";

import VisageValue from "bekasi/visage/VisageValue";

export default class ParameterMaker {

	private plans: ParameterPlan[] = null;
	private currents: Map<string, VisageValue> = null;

	constructor(plans: ParameterPlan[], currents?: Map<string, VisageValue>) {
		this.plans = plans;
		this.currents = currents === undefined ? new Map<string, VisageValue>() : currents;
	}

	public getParameter(plan: ParameterPlan): any {
		let name = plan.getName();
		let value: any = null
		if (this.currents.has(name)) {
			value = this.currents.get(name);
		} else {
			let assignedPlan = plan.getAssignedPlan();
			if (assignedPlan instanceof ConstantPlan) {
				value = <VisageConstant>assignedPlan.getDefaultValue();
			}
		}
		if (value instanceof XConstant) {
			return value.toValue();
		}
		return value;
	}

	public createParameters(): Map<string, VisageValue> {
		let parameters = new Map<string, VisageValue>();
		for (let plan of this.plans) {
			let name = plan.getName();
			let value = this.getParameter(plan);
			parameters.set(name, value);
		}
		return parameters;
	}

}