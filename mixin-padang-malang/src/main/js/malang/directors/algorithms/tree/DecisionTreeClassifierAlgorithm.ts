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

import DecisionTreeClassifier from "padang/functions/model/tree/DecisionTreeClassifier";

import InputPlanUtils from "rinjani/plan/InputPlanUtils";

import AlgorithmPlan from "malang/plan/AlgorithmPlan";
import AlgorithmPlanRegistry from "malang/plan/AlgorithmPlanRegistry";

import Algorithm from "malang/directors/algorithms/Algorithm";
import AlgorithmFactory from "malang/directors/algorithms/AlgorithmFactory";
import ClassificationAlgorithm from "malang/directors/algorithms/ClassificationAlgorithm";

export default class DecisionTreeClassifierAlgorithm extends Algorithm {

	public static ALGORITHM_NAME = "DecisionTreeClassifier";

	public static FEATURES_PLAN = InputPlanUtils.createMultipleContinuousPlanFromParameter(
		Learning.FEATURES_PLAN
	)

	public static TARGET_PLAN = InputPlanUtils.createSingleDiscretePlanFromParameter(
		Learning.TARGET_PLAN
	)

	public static getPlan(): AlgorithmPlan {

		let base = DecisionTreeClassifier.getPlan();
		let plan = new AlgorithmPlan(
			DecisionTreeClassifierAlgorithm.ALGORITHM_NAME,
			"Decision Tree Classifier Algorithm",
			base.getImage(),
			"Decision Tree Classifier Model",
			[AlgorithmPlan.CLASSIFICATION]
		);

		let inputs = plan.getInputList();
		inputs.add(DecisionTreeClassifierAlgorithm.FEATURES_PLAN);
		inputs.add(DecisionTreeClassifierAlgorithm.TARGET_PLAN);

		ClassificationAlgorithm.setDefaultResult(plan);

		return plan;
	}

	public execute(assignments: XAssignment[], result: string, callback: () => void): void {
		let plan = DecisionTreeClassifierAlgorithm.getPlan();
		this.addModelFirst(plan, DecisionTreeClassifier.FUNCTION_NAME, assignments);
		this.executeCall(TrainTest.FUNCTION_NAME, assignments, result, callback);
	}

}

let registry = AlgorithmPlanRegistry.getInstance();
registry.registerPlan(DecisionTreeClassifierAlgorithm.getPlan());

let factory = AlgorithmFactory.getInstance();
factory.register(DecisionTreeClassifierAlgorithm.ALGORITHM_NAME, DecisionTreeClassifierAlgorithm);