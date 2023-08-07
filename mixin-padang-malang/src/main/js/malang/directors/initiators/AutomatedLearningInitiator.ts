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
import XLibrary from "malang/model/XLibrary";
import XAutomatedTask from "malang/model/XAutomatedTask";
import MalangCreator from "malang/model/MalangCreator";
import XAutomatedLearning from "malang/model/XAutomatedLearning";

import * as directors from "malang/directors";

import BuilderPartViewer from "malang/ui/BuilderPartViewer";

import Initiator from "malang/directors/initiators/Initiator";
import InitiatorRegistry from "malang/directors/initiators/InitiatorRegistry";

export default class AutomatedLearningInitiator extends Initiator {

	public createNew(viewer: BuilderPartViewer): XAutomatedLearning {
		let creator = MalangCreator.eINSTANCE;
		let learning = creator.createAutomatedLearning();
		let library = learning.getLibrary();
		let task = learning.getTask();
		this.prepareLibrary(viewer, library);
		this.prepareAutomatedTask(viewer, library, task);
		return learning;
	}

	private prepareLibrary(viewer: BuilderPartViewer, library: XLibrary): void {
		let director = directors.getLibraryPlanDirector(viewer);
		let name = director.getDefaultName();
		library.setName(name);
	}

	private prepareAutomatedTask(viewer: BuilderPartViewer, library: XLibrary, task: XAutomatedTask): void {
		let libraryName = library.getName();
		let director = directors.getLibraryPlanDirector(viewer);
		let plan = director.getPlan(libraryName);
		let plans = plan.getTaskPlans();
		for (let plan of plans) {
			let name = plan.getName();
			task.setName(name);
			break;
		}
	}

}

let registry = InitiatorRegistry.getInstance();
registry.register(XAutomatedLearning.XCLASSNAME, new AutomatedLearningInitiator());