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

import BuilderPremise from "padang/ui/BuilderPremise";

import * as malang from "malang/malang";

import PlotPlan from "rinjani/plan/PlotPlan";

import ResidualsPlot from "rinjani/directors/plots/ResidualsPlot";
import ErrorNumberPlot from "rinjani/directors/plots/ErrorNumberPlot";

import XModeler from "malang/model/XModeler";
import XBasicTraining from "malang/model/XBasicTraining";
import XAutomatedLearning from "malang/model/XAutomatedLearning";
import XSupervisedLearning from "malang/model/XSupervisedLearning";

import AlgorithmPlan from "malang/plan/AlgorithmPlan";

import Executor from "malang/directors/executors/Executor";
import AssignmentMaker from "malang/directors/executors/AssignmentMaker";

import PlotPreload from "malang/directors/preloads/PlotPreload";
import PreloadSupport from "malang/directors/preloads/PreloadSupport";
import PreloadRegistry from "malang/directors/preloads/PreloadRegistry";

import AlgorithmPlanRegistry from "malang/plan/AlgorithmPlanRegistry";

import RegressionAlgorithm from "malang/directors/algorithms/RegressionAlgorithm";

export default class RegressionTaskPreload extends PlotPreload {

	constructor(name: string, presume: string, plan: PlotPlan, header?: boolean) {
		super(RegressionAlgorithm.GROUP, name, presume, plan, header);
	}

	public getSequence(): number {
		return 10;
	}

	public isApplicable(support: PreloadSupport, model: XModeler): boolean {
		let match = false;
		let learning = model.getLearning();
		if (learning instanceof XSupervisedLearning) {
			let training = learning.getTraining();
			if (training instanceof XBasicTraining) {
				let algorithm = training.getEstimator();
				let name = algorithm.getName();
				if (name !== null) {
					let registry = AlgorithmPlanRegistry.getInstance();
					let plan = registry.getPlan(name);
					match = plan.hasTask(AlgorithmPlan.CLASSIFICATION);
				}
			}
		} else if (learning instanceof XAutomatedLearning) {
			let task = learning.getTask();
			let name = task.getName();
			match = name === AlgorithmPlan.REGRESSION;
		}
		if (match === true) {
			let premise = support.getPremise();
			return premise.isVariableExists(Executor.RESULT);
		}
		return false;
	}

	protected createAssignments(premise: BuilderPremise, _model: XModeler): XAssignment[] {
		let maker = new AssignmentMaker(premise);
		return maker.createVariableAssignments([Executor.RESULT]);
	}

}

let addPlot = (presume: string, plan: PlotPlan, header?: boolean) => {
	let name = plan.getName();
	let preload = new RegressionTaskPreload(name, presume, plan, header);
	let registry = PreloadRegistry.getInstance();
	registry.register(preload);
}

let addNumberPlot = (plan: PlotPlan, caption?: boolean) => {
	addPlot(malang.RESULT_ICON_MAP.NUMBER, plan, caption);
}

let addScatterPlot = (plan: PlotPlan, caption?: boolean) => {
	addPlot(malang.RESULT_ICON_MAP.NUMBER, plan, caption);
}

addNumberPlot(ErrorNumberPlot.getPlan(), false);
addScatterPlot(ResidualsPlot.getPlan());
