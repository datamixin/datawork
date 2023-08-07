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
import FunctionPlan from "padang/plan/FunctionPlan";
import FunctionPlanRegistry from "padang/plan/FunctionPlanRegistry";

import Function from "padang/functions/Function";

export default class LinearRegression extends Function {

	public static FUNCTION_NAME = "LinearRegression";

	constructor() {
		super(LinearRegression.FUNCTION_NAME);
	}

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			LinearRegression.FUNCTION_NAME,
			"LinearRegression",
			"mdi-vector-line",
			"Create linear regression model"
		);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(LinearRegression.getPlan());