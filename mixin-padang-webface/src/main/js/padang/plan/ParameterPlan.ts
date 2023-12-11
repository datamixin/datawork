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
import AssignedPlan from "webface/plan/AssignedPlan";

import ValuePlan from "padang/plan/ValuePlan";

export default class ParameterPlan extends ValuePlan {

	private assignedPlan: AssignedPlan = null;

	constructor(name: string, label: string, description: string, plan?: AssignedPlan) {
		super(name, label, description);
		this.assignedPlan = plan === undefined ? null : plan;
	}

	public getAssignedPlan(): AssignedPlan {
		return this.assignedPlan;
	}

	public setAssigned(plan: AssignedPlan): ParameterPlan {
		this.assignedPlan = plan;
		return this;
	}

}