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

import Learning from "padang/functions/model/Learning";

export default class ClassificationCorrelation extends Function {

	public static FUNCTION_NAME = "ClassificationCorrelation";

	constructor(
		public features: any,
		public target: any) {
		super(ClassificationCorrelation.FUNCTION_NAME);
	}

	public static FEATURES_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
		Learning.FEATURES,
		"Features",
		"Number features"
	);

	public static TARGET_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
		Learning.TARGET,
		"target",
		"Target values"
	);

	public static METHOD_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
		"method",
		"Method",
		"Correlation method",
		"mutual_info-classification",
		"=['mutual_info-classification']"
	);

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			ClassificationCorrelation.FUNCTION_NAME,
			"ClassificationCorrelation",
			"mdi-chart-gantt",
			"Create Classification Correlation"
		);
		let parameters = plan.getParameterList();
		parameters.add(ClassificationCorrelation.FEATURES_PLAN);
		parameters.add(ClassificationCorrelation.TARGET_PLAN);
		parameters.add(ClassificationCorrelation.METHOD_PLAN);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(ClassificationCorrelation.getPlan());