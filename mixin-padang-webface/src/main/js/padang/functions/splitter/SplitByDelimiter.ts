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
import ParameterPlan from "padang/plan/ParameterPlan";
import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";
import FunctionPlanRegistry from "padang/plan/FunctionPlanRegistry";

import Function from "padang/functions/Function";

export default class SplitByDelimiter extends Function {

	public static FUNCTION_NAME = "SplitByDelimiter";

	constructor(
		public delimiter: string,
		public regex: boolean,
		public limit: number) {
		super(SplitByDelimiter.FUNCTION_NAME);
	}

	public static DELIMITER_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"delimiter",
		"Delimiter",
		"Delimiter character",
		" ",
		"={Comma: ',', Space: ' ', Colon: ':', Tab: '\t'}",
	);
	public static REGEX_PLAN: ParameterPlan = ParameterPlanUtils.createLogicalPlan(
		"regex",
		"Regex",
		"Use regex"
	);
	public static LIMIT_PLAN: ParameterPlan = ParameterPlanUtils.createNumberPlan(
		"limit",
		"Limit",
		"Split limit",
		-1,
		"=[1, 2, 3, 4, 5]"
	);

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			SplitByDelimiter.FUNCTION_NAME,
			"SplitByDelimiter",
			"mdi-arrow-split-vertical",
			"Split by character delimiter"
		);
		let parameters = plan.getParameterList();
		parameters.add(SplitByDelimiter.DELIMITER_PLAN);
		parameters.add(SplitByDelimiter.REGEX_PLAN);
		parameters.add(SplitByDelimiter.LIMIT_PLAN);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(SplitByDelimiter.getPlan());