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

import KNeighborsClassifier from "padang/functions/model/neighbors/KNeighborsClassifier";

import InputPlanUtils from "rinjani/plan/InputPlanUtils";

import AlgorithmPlan from "malang/plan/AlgorithmPlan";
import AlgorithmPlanRegistry from "malang/plan/AlgorithmPlanRegistry";

import Algorithm from "malang/directors/algorithms/Algorithm";
import AlgorithmFactory from "malang/directors/algorithms/AlgorithmFactory";
import ClassificationAlgorithm from "malang/directors/algorithms/ClassificationAlgorithm";

export default class KNeighborsClassifierAlgorithm extends Algorithm {

	public static ALGORITHM_NAME = "KNeighborsClassifier";

	public static FEATURES_PLAN = InputPlanUtils.createMultipleContinuousPlanFromParameter(
		Learning.FEATURES_PLAN
	)

	public static TARGET_PLAN = InputPlanUtils.createSingleDiscretePlanFromParameter(
		Learning.TARGET_PLAN
	)

	public static getPlan(): AlgorithmPlan {

		let base = KNeighborsClassifier.getPlan();
		let plan = new AlgorithmPlan(
			KNeighborsClassifierAlgorithm.ALGORITHM_NAME,
			"K-Neighbors Classifier Algorithm",
			base.getImage(),
			"K-Neighbors Classifier Model",
			[AlgorithmPlan.CLASSIFICATION]
		);

		let inputs = plan.getInputList();
		inputs.add(KNeighborsClassifierAlgorithm.FEATURES_PLAN);
		inputs.add(KNeighborsClassifierAlgorithm.TARGET_PLAN);

		ClassificationAlgorithm.setDefaultResult(plan);

		return plan;
	}

	public execute(assignments: XAssignment[], result: string, callback: () => void): void {
		let plan = KNeighborsClassifierAlgorithm.getPlan();
		this.addModelFirst(plan, KNeighborsClassifier.FUNCTION_NAME, assignments);
		this.executeCall(TrainTest.FUNCTION_NAME, assignments, result, callback);
	}

}

let registry = AlgorithmPlanRegistry.getInstance();
registry.registerPlan(KNeighborsClassifierAlgorithm.getPlan());

let factory = AlgorithmFactory.getInstance();
factory.register(KNeighborsClassifierAlgorithm.ALGORITHM_NAME, KNeighborsClassifierAlgorithm);