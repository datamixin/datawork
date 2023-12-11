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

import GaussianNaiveBayes from "padang/functions/model/naive_bayes/GaussianNaiveBayes";

import InputPlanUtils from "rinjani/plan/InputPlanUtils";

import AlgorithmPlan from "malang/plan/AlgorithmPlan";
import AlgorithmPlanRegistry from "malang/plan/AlgorithmPlanRegistry";

import AlgorithmFactory from "malang/directors/algorithms/AlgorithmFactory";
import ClassificationAlgorithm from "malang/directors/algorithms/ClassificationAlgorithm";

export default class GaussianNaiveBayesAlgorithm extends ClassificationAlgorithm {

	public static ALGORITHM_NAME = "GaussianNaiveBayes";

	public static FEATURES_PLAN = InputPlanUtils.createMultipleContinuousPlanFromParameter(
		Learning.FEATURES_PLAN
	)

	public static TARGET_PLAN = InputPlanUtils.createSingleDiscretePlanFromParameter(
		Learning.TARGET_PLAN
	)

	public static getPlan(): AlgorithmPlan {

		let base = GaussianNaiveBayes.getPlan();
		let plan = new AlgorithmPlan(
			GaussianNaiveBayesAlgorithm.ALGORITHM_NAME,
			"Gaussian Naive Bayes Algorithm",
			base.getImage(),
			"Gaussian Naive Bayes Model",
			[AlgorithmPlan.CLASSIFICATION]
		);

		let inputs = plan.getInputList();
		inputs.add(GaussianNaiveBayesAlgorithm.FEATURES_PLAN);
		inputs.add(GaussianNaiveBayesAlgorithm.TARGET_PLAN);

		ClassificationAlgorithm.setDefaultResult(plan);

		return plan;
	}

	public execute(assignments: XAssignment[], result: string, callback: () => void): void {
		let plan = GaussianNaiveBayesAlgorithm.getPlan();
		this.addModelFirst(plan, GaussianNaiveBayes.FUNCTION_NAME, assignments,);
		this.executeCall(TrainTest.FUNCTION_NAME, assignments, result, callback);
	}

}

let registry = AlgorithmPlanRegistry.getInstance();
registry.registerPlan(GaussianNaiveBayesAlgorithm.getPlan());

let factory = AlgorithmFactory.getInstance();
factory.register(GaussianNaiveBayesAlgorithm.ALGORITHM_NAME, GaussianNaiveBayesAlgorithm);