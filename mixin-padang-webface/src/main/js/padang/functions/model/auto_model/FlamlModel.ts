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
import FunctionPlan from "padang/plan/FunctionPlan";
import FunctionPlanRegistry from "padang/plan/FunctionPlanRegistry";

import AutoModel from "padang/functions/model/auto_model/AutoModel";

export default class FlamlModel extends AutoModel {

	public static FUNCTION_NAME = "FlamlModel";

	constructor() {
		super(FlamlModel.FUNCTION_NAME);
	}

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			FlamlModel.FUNCTION_NAME,
			"FlamlModel",
			"mdi-vector-line",
			"Create Flaml automated model"
		);
		let parameters = plan.getParameterList();
		parameters.add(FlamlModel.TASK_PLAN);
		parameters.add(FlamlModel.SETTINGS_PLAN);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(FlamlModel.getPlan());