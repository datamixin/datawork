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
import XAssignment from "sleman/model/XAssignment";

import Learning from "padang/functions/model/Learning";
import TrainTest from "padang/functions/model/TrainTest";

import SupportVectorRegression from "padang/functions/model/svm/SupportVectorRegression";

import InputPlanUtils from "rinjani/plan/InputPlanUtils";

import AlgorithmPlan from "malang/plan/AlgorithmPlan";
import AlgorithmPlanRegistry from "malang/plan/AlgorithmPlanRegistry";

import Algorithm from "malang/directors/algorithms/Algorithm";
import AlgorithmFactory from "malang/directors/algorithms/AlgorithmFactory";
import RegressionAlgorithm from "malang/directors/algorithms/RegressionAlgorithm";

export default class SupportVectorRegressionAlgorithm extends Algorithm {

	public static ALGORITHM_NAME = "SupportVectorRegression";

	public static FEATURES_PLAN = InputPlanUtils.createMultipleContinuousPlanFromParameter(
		Learning.FEATURES_PLAN
	)

	public static TARGET_PLAN = InputPlanUtils.createSingleContinuousPlanFromParameter(
		Learning.TARGET_PLAN
	)

	public static getPlan(): AlgorithmPlan {

		let base = SupportVectorRegression.getPlan();
		let plan = new AlgorithmPlan(
			SupportVectorRegressionAlgorithm.ALGORITHM_NAME,
			"Support Vector Regression Algorithm",
			base.getImage(),
			"Support Vector Regression Model",
			[AlgorithmPlan.REGRESSION]
		);

		let inputs = plan.getInputList();
		inputs.add(SupportVectorRegressionAlgorithm.FEATURES_PLAN);
		inputs.add(SupportVectorRegressionAlgorithm.TARGET_PLAN);

		RegressionAlgorithm.setDefaultResult(plan);

		return plan;
	}

	public execute(assignments: XAssignment[], result: string, callback: () => void): void {
		let plan = SupportVectorRegressionAlgorithm.getPlan();
		this.addModelFirst(plan, SupportVectorRegression.FUNCTION_NAME, assignments);
		this.executeCall(TrainTest.FUNCTION_NAME, assignments, result, callback);
	}

}

let registry = AlgorithmPlanRegistry.getInstance();
registry.registerPlan(SupportVectorRegressionAlgorithm.getPlan());

let factory = AlgorithmFactory.getInstance();
factory.register(SupportVectorRegressionAlgorithm.ALGORITHM_NAME, SupportVectorRegressionAlgorithm);