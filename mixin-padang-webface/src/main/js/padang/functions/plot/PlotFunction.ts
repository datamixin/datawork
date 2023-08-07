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
import PlanUtils from "webface/plan/PlanUtils";

import ParameterPlan from "padang/plan/ParameterPlan";
import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";

export default class PlotFunction extends Function {

	constructor(
		public plotName: string) {
		super(plotName);
	}

	public static CONFIG_PLAN: ParameterPlan = ParameterPlanUtils.createMapPlan(
		"config",
		"Config",
		"Instant plot config",
		PlanUtils.createSpecifiedPlan("name", PlanUtils.createTextPlan()),
		PlanUtils.createSpecifiedPlan("value", PlanUtils.createAnyPlan()),
	);

}