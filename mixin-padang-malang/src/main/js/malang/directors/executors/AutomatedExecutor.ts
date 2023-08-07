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
import VisageValue from "bekasi/visage/VisageValue";

import XAssignment from "sleman/model/XAssignment";

import BuilderPremise from "padang/ui/BuilderPremise";

import ParameterMaker from "rinjani/directors/plots/ParameterMaker";

import XModeler from "malang/model/XModeler";
import XLibrary from "malang/model/XLibrary";
import XAutomatedTask from "malang/model/XAutomatedTask";
import XAutomatedLearning from "malang/model/XAutomatedLearning";

import LibraryPlan from "malang/plan/LibraryPlan";
import AutomatedTaskPlan from "malang/plan/AutomatedTaskPlan";
import LibraryPlanRegistry from "malang/plan/LibraryPlanRegistry";

import Executor from "malang/directors/executors/Executor";

import OutputPartSupport from "malang/directors/OutputPartSupport";

import PremixRegistry from "malang/directors/premixes/PremixRegistry";

import LibraryFactory from "malang/directors/libraries/LibraryFactory";

import AssignmentMaker from "malang/directors/executors/AssignmentMaker";
import ExecutorRegistry from "malang/directors/executors/ExecutorRegistry";

export default class AutomatedExecutor extends Executor {

	private getLibrary(model: XModeler): XLibrary {
		let learning = <XAutomatedLearning>model.getLearning();
		let library = learning.getLibrary();
		return library;
	}

	private getLibraryPlan(model: XLibrary): LibraryPlan {
		let name = model.getName();
		let registry = LibraryPlanRegistry.getInstance();
		return registry.getPlan(name);
	}

	private getTask(model: XModeler): XAutomatedTask {
		let learning = <XAutomatedLearning>model.getLearning();
		let task = learning.getTask();
		return task;
	}

	private getTaskPlan(model: XLibrary): AutomatedTaskPlan {
		let libraryPlan = this.getLibraryPlan(model);
		let learning = <XAutomatedLearning>model.eContainer();
		let task = learning.getTask();
		let name = task.getName();
		let list = libraryPlan.getTaskPlanList();
		return <AutomatedTaskPlan>list.getPlan(name);
	}

	private createSettings(model: XLibrary, currents: Map<string, VisageValue>): Map<string, VisageValue> {
		let plan = this.getLibraryPlan(model);
		let plans = plan.getSettings();
		let maker = new ParameterMaker(plans, currents);
		return maker.createParameters();
	}

	protected createAssigments(premise: BuilderPremise, library: XLibrary, model: XModeler): XAssignment[] {
		let taskPlan = this.getTaskPlan(library);
		let inputs = taskPlan.getInputs();
		let maker = new AssignmentMaker(premise);
		return maker.createInputAssignments(inputs, model);
	}

	public execute(support: OutputPartSupport, model: XModeler, callback: () => void): void {
		let premise = support.getPremise();
		let library = this.getLibrary(model);
		let task = this.getTask(model);
		let parameters = library.getParameters();
		support.buildParameters(parameters, (currents: Map<string, any>) => {
			let name = library.getName();
			let taskName = task.getName();
			let settings = this.createSettings(library, currents);
			let assignments = this.createAssigments(premise, library, model);
			let factory = LibraryFactory.getInstance();
			let executor = factory.create(name, premise, taskName, settings);
			executor.execute(assignments, Executor.RESULT, callback);
		});
	}

	public populateResult(model: XModeler): void {
		let library = this.getLibrary(model);
		let taskPlan = this.getTaskPlan(library);
		let resultPlan = taskPlan.getDefaultResult();
		let registry = PremixRegistry.getInstance();
		let leanName = resultPlan.xLeanName();
		let premix = registry.get(leanName);
		let result = premix.createResult(resultPlan);
		model.setResult(result);
	}
}


let registry = ExecutorRegistry.getInstance();
registry.register(XAutomatedLearning.XCLASSNAME, new AutomatedExecutor());