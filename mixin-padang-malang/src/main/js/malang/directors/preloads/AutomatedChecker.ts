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
import XModeler from "malang/model/XModeler";
import XAutomatedLearning from "malang/model/XAutomatedLearning";

import LibraryPlan from "malang/plan/LibraryPlan";

import Executor from "malang/directors/executors/Executor";

import PreloadSupport from "malang/directors/preloads/PreloadSupport";

export default class AutomatedChecker {

	protected plan: LibraryPlan = null;

	constructor(plan: LibraryPlan) {
		this.plan = plan;
	}

	public isApplicable(support: PreloadSupport, model: XModeler): boolean {
		let match = false;
		let learning = model.getLearning();
		if (learning instanceof XAutomatedLearning) {
			let library = learning.getLibrary();
			let name = library.getName();
			match = name === this.plan.getName();
		}
		if (match === true) {
			let premise = support.getPremise();
			return premise.isVariableExists(Executor.RESULT);
		}
		return false;
	}

}
