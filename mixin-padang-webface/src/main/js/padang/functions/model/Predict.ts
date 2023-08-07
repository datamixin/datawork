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
import ParameterPlan from "padang/plan/ParameterPlan";
import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";
import FunctionPlanRegistry from "padang/plan/FunctionPlanRegistry";

import Function from "padang/functions/Function";

export default class Predict extends Function {

	public static FUNCTION_NAME = "Predict";

	public static MODEL = "model";
	public static FEATURES = "features";
	public static FEATURES_LABEL = "Features";
	public static PREDICTION = "prediction";
	public static PREDICTION_LABEL = "Prediction";

	constructor(
		public model: any,
		public features: any) {
		super(Predict.FUNCTION_NAME);
	}

	public static MODEL_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
		Predict.MODEL,
		"Model",
		"Model instance"
	);

	public static FEATURES_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
		Predict.FEATURES,
		Predict.FEATURES_LABEL,
		"Input features"
	);

	public static getPlan(): FunctionPlan {
		let plan = new FunctionPlan(
			Predict.FUNCTION_NAME,
			"Predict",
			"mdi-flask-outline",
			"Train and test model"
		);
		let parameters = plan.getParameterList();
		parameters.add(Predict.MODEL_PLAN);
		parameters.add(Predict.FEATURES_PLAN);
		return plan;
	}

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(Predict.getPlan());