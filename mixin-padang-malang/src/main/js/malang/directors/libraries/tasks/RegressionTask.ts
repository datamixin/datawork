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
import Learning from "padang/functions/model/Learning";

import InputPlanUtils from "rinjani/plan/InputPlanUtils";

import AlgorithmPlan from "malang/plan/AlgorithmPlan";
import AutomatedTaskPlan from "malang/plan/AutomatedTaskPlan";

import RegressionAlgorithm from "malang/directors/algorithms/RegressionAlgorithm";

export default class RegressionTask {

	public static FEATURES_PLAN = InputPlanUtils.createMultipleDiscreteContinuousPlanFromParameter(
		Learning.FEATURES_PLAN
	);

	public static TARGET_PLAN = InputPlanUtils.createSingleContinuousPlanFromParameter(
		Learning.TARGET_PLAN
	);

	public static getPlan(): AutomatedTaskPlan {

		let plan = new AutomatedTaskPlan(
			AlgorithmPlan.REGRESSION,
			"Regression",
			"Tabular regression");

		let inputs = plan.getInputList();
		inputs.add(RegressionTask.FEATURES_PLAN);
		inputs.add(RegressionTask.TARGET_PLAN);

		let result = RegressionAlgorithm.getDefaultResult();
		plan.setDefaultResult(result);

		return plan;
	}

}