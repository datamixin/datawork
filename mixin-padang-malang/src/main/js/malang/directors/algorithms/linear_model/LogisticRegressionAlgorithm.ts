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
import XAssignment from "sleman/model/XAssignment";

import Learning from "padang/functions/model/Learning";
import TrainTest from "padang/functions/model/TrainTest";

import LogisticRegression from "padang/functions/model/linear_model/LogisticRegression";

import InputPlanUtils from "rinjani/plan/InputPlanUtils";

import AlgorithmPlan from "malang/plan/AlgorithmPlan";
import AlgorithmPlanRegistry from "malang/plan/AlgorithmPlanRegistry";

import Algorithm from "malang/directors/algorithms/Algorithm";
import AlgorithmFactory from "malang/directors/algorithms/AlgorithmFactory";
import ClassificationAlgorithm from "malang/directors/algorithms/ClassificationAlgorithm";

export default class LogisticRegressionAlgorithm extends Algorithm {

	public static ALGORITHM_NAME = "LogisticRegression";

	public static FEATURES_PLAN = InputPlanUtils.createMultipleContinuousPlanFromParameter(
		Learning.FEATURES_PLAN
	)

	public static TARGET_PLAN = InputPlanUtils.createSingleDiscretePlanFromParameter(
		Learning.TARGET_PLAN
	)

	public static getPlan(): AlgorithmPlan {

		let base = LogisticRegression.getPlan();
		let plan = new AlgorithmPlan(
			LogisticRegressionAlgorithm.ALGORITHM_NAME,
			"Logistic Regression Algorithm",
			base.getImage(),
			"Logistic Regression Model",
			[AlgorithmPlan.CLASSIFICATION]
		);

		let inputs = plan.getInputList();
		inputs.add(LogisticRegressionAlgorithm.FEATURES_PLAN);
		inputs.add(LogisticRegressionAlgorithm.TARGET_PLAN);

		ClassificationAlgorithm.setDefaultResult(plan);

		return plan;
	}

	public execute(assignments: XAssignment[], result: string, callback: () => void): void {
		let plan = LogisticRegressionAlgorithm.getPlan();
		this.addModelFirst(plan, LogisticRegression.FUNCTION_NAME, assignments);
		this.executeCall(TrainTest.FUNCTION_NAME, assignments, result, callback);
	}

}

let registry = AlgorithmPlanRegistry.getInstance();
registry.registerPlan(LogisticRegressionAlgorithm.getPlan());

let factory = AlgorithmFactory.getInstance();
factory.register(LogisticRegressionAlgorithm.ALGORITHM_NAME, LogisticRegressionAlgorithm);