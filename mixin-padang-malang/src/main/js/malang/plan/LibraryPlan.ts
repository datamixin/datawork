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
import ValuePlan from "padang/plan/ValuePlan";
import ValuePlanList from "padang/plan/ValuePlanList";
import ParameterPlan from "padang/plan/ParameterPlan";

import AutomatedTaskPlan from "malang/plan/AutomatedTaskPlan";

export default class LibraryPlan extends ValuePlan {

	private taskPlans: AutomatedTaskPlan[] = [];
	private settings: ParameterPlan[] = [];

	constructor(name: string, label: string, description: string) {
		super(name, label, description);
	}

	public getTaskPlans(): AutomatedTaskPlan[] {
		return this.taskPlans;
	}

	public getTaskPlanList(): ValuePlanList {
		return new ValuePlanList(this.taskPlans);
	}

	public getSettings(): ParameterPlan[] {
		return this.settings;
	}

	public getSettingList(): ValuePlanList {
		return new ValuePlanList(this.settings);
	}

}