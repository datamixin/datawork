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

import VisageValue from "bekasi/visage/VisageValue";

import BuilderPremise from "padang/ui/BuilderPremise";

import ParameterMaker from "rinjani/directors/plots/ParameterMaker";

import XModeler from "malang/model/XModeler";
import XAlgorithm from "malang/model/XAlgorithm";
import XBasicTraining from "malang/model/XBasicTraining";
import XSupervisedLearning from "malang/model/XSupervisedLearning";

import AlgorithmPlan from "malang/plan/AlgorithmPlan";

import Executor from "malang/directors/executors/Executor";

import OutputPartSupport from "malang/directors/OutputPartSupport";

import AlgorithmPlanRegistry from "malang/plan/AlgorithmPlanRegistry";

import PremixRegistry from "malang/directors/premixes/PremixRegistry";

import AssignmentMaker from "malang/directors/executors/AssignmentMaker";
import ExecutorRegistry from "malang/directors/executors/ExecutorRegistry";

import AlgorithmFactory from "malang/directors/algorithms/AlgorithmFactory";

export default class SupervisedExecutor extends Executor {

	private getAlgorithm(model: XModeler): XAlgorithm {
		let learning = <XSupervisedLearning>model.getLearning();
		let training = <XBasicTraining>learning.getTraining();
		let algorithm = training.getEstimator();
		return algorithm;
	}

	private getPlan(model: XAlgorithm): AlgorithmPlan {
		let name = model.getName();
		let registry = AlgorithmPlanRegistry.getInstance();
		return registry.getPlan(name);
	}

	private createHyperParameters(model: XAlgorithm, currents: Map<string, VisageValue>): Map<string, VisageValue> {
		let plan = this.getPlan(model);
		let plans = plan.getHyperParameters();
		let maker = new ParameterMaker(plans, currents);
		return maker.createParameters();
	}

	protected createAssigments(premise: BuilderPremise, algorithm: XAlgorithm, model: XModeler): XAssignment[] {
		let plan = this.getPlan(algorithm);
		let maker = new AssignmentMaker(premise);
		return maker.createPreprocessedAssignments(plan, model);
	}

	public execute(support: OutputPartSupport, model: XModeler, callback: () => void): void {
		let premise = support.getPremise();
		let algorithm = this.getAlgorithm(model);
		let parameters = algorithm.getHyperParameters();
		support.buildParameters(parameters, (currents: Map<string, any>) => {
			let name = algorithm.getName();
			let assignments = this.createAssigments(premise, algorithm, model);
			let parameters = this.createHyperParameters(algorithm, currents);
			let factory = AlgorithmFactory.getInstance();
			let executor = factory.create(name, premise, parameters);
			executor.execute(assignments, Executor.RESULT, callback);
		});
	}

	public populateResult(model: XModeler): void {
		let algorithm = this.getAlgorithm(model);
		let algorithmPlan = this.getPlan(algorithm);
		let resultPlan = algorithmPlan.getDefaultResult();
		let registry = PremixRegistry.getInstance();
		let leanName = resultPlan.xLeanName();
		let premix = registry.get(leanName);
		let result = premix.createResult(resultPlan);
		model.setResult(result);
	}

}

let registry = ExecutorRegistry.getInstance();
registry.register(XSupervisedLearning.XCLASSNAME, new SupervisedExecutor());