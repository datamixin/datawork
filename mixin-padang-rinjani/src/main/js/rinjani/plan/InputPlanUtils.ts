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
import ParameterPlan from "padang/plan/ParameterPlan";

import InputPlan from "rinjani/plan/InputPlan";

export default class InputPlanUtils {

	public static createPlan(name: string, label: string, description: string,
		single: boolean, types: string[]): InputPlan {
		let plan = new InputPlan(name, label, description, single, types);
		return plan;
	}

	public static createSingleContinuousPlan(name: string, label: string, description: string): InputPlan {
		return this.createPlan(name, label, description, true, [InputPlan.TYPE_CONTINUOUS]);
	}

	public static createSingleDiscretePlan(name: string, label: string, description: string): InputPlan {
		return this.createPlan(name, label, description, true, [InputPlan.TYPE_DISCRETE]);
	}

	public static createMultipleContinuousPlan(name: string, label: string, description: string): InputPlan {
		return this.createPlan(name, label, description, false, [InputPlan.TYPE_CONTINUOUS]);
	}

	public static createMultipleDiscretePlan(name: string, label: string, description: string): InputPlan {
		return this.createPlan(name, label, description, false, [InputPlan.TYPE_DISCRETE]);
	}

	public static createPlanFromParameter(plan: ParameterPlan, single: boolean,
		types: string[], preferred?: number): InputPlan {
		let name = plan.getName();
		let label = plan.getLabel();
		let description = plan.getDescription();
		let argumentPlan = new InputPlan(name, label, description, single, types, preferred);
		return argumentPlan;
	}

	public static createSingleContinuousPlanFromParameter(plan: ParameterPlan): InputPlan {
		return this.createPlanFromParameter(plan, true, [InputPlan.TYPE_CONTINUOUS]);
	}

	public static createSingleDiscretePlanFromParameter(plan: ParameterPlan): InputPlan {
		return this.createPlanFromParameter(plan, true, [InputPlan.TYPE_DISCRETE]);
	}

	public static createSingleDiscreteContinuousPlanFromParameter(plan: ParameterPlan): InputPlan {
		return this.createPlanFromParameter(plan, true, [InputPlan.TYPE_DISCRETE, InputPlan.TYPE_CONTINUOUS]);
	}

	public static createMultipleContinuousPlanFromParameter(
		plan: ParameterPlan, preferred?: number): InputPlan {
		return this.createPlanFromParameter(plan, false, [InputPlan.TYPE_CONTINUOUS], preferred);
	}

	public static createMultipleDiscreteContinuousPlanFromParameter(
		plan: ParameterPlan, preferred?: number): InputPlan {
		return this.createPlanFromParameter(plan, false,
			[InputPlan.TYPE_DISCRETE, InputPlan.TYPE_CONTINUOUS], preferred);
	}

	public static createMultipleDiscretePlanFromParameter(
		plan: ParameterPlan, preferred?: number): InputPlan {
		return this.createPlanFromParameter(plan, false, [InputPlan.TYPE_DISCRETE], preferred);
	}

}