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

import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";

import TrainTest from "padang/functions/model/TrainTest";

import FlamlModel from "padang/functions/model/auto_model/FlamlModel";

import LibraryPlan from "malang/plan/LibraryPlan";
import LibraryPlanRegistry from "malang/plan/LibraryPlanRegistry";

import Library from "malang/directors/libraries/Library";
import LibraryFactory from "malang/directors/libraries/LibraryFactory";

import RegressionTask from "malang/directors/libraries/tasks/RegressionTask";
import ClassificationTask from "malang/directors/libraries/tasks/ClassificationTask";

export default class FlamlLibrary extends Library {

	public static LIBRARY_NAME = "Flaml";

	public static TIME_BUDGET_PLAN = ParameterPlanUtils.createNumberPlan(
		"timeBudget", "Time Budget", "Time budget in seconds or -1 for no time limit");

	public static getPlan(): LibraryPlan {

		let plan = new LibraryPlan(
			FlamlLibrary.LIBRARY_NAME,
			"Flaml",
			"Flaml AutoML Library"
		);

		let tasks = plan.getTaskPlans();
		tasks.push(RegressionTask.getPlan());
		tasks.push(ClassificationTask.getPlan());

		let settings = plan.getSettingList();
		settings.add(FlamlLibrary.TIME_BUDGET_PLAN);

		return plan;
	}

	public execute(assignments: XAssignment[], result: string, callback: () => void): void {
		let plan = FlamlLibrary.getPlan();
		this.addModelFirst(plan, FlamlModel.FUNCTION_NAME, assignments);
		this.executeCall(TrainTest.FUNCTION_NAME, assignments, result, callback);
	}

}

let registry = LibraryPlanRegistry.getInstance();
registry.registerPlan(FlamlLibrary.getPlan());

let factory = LibraryFactory.getInstance();
factory.register(FlamlLibrary.LIBRARY_NAME, FlamlLibrary);