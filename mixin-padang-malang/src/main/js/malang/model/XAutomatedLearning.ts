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
import EReference from "webface/model/EReference";

import * as model from "malang/model/model";
import XLibrary from "malang/model/XLibrary";
import XLearning from "malang/model/XLearning";
import XAutomatedTask from "malang/model/XAutomatedTask";

export default class XAutomatedLearning extends XLearning {

	public static XCLASSNAME: string = model.getEClassName("XAutomatedLearning");

	public static FEATURE_TASK = new EReference("task", XAutomatedTask);
	public static FEATURE_LIBRARY = new EReference("library", XLibrary);

	private task: XAutomatedTask = null;
	private library: XLibrary = null;

	constructor() {
		super(model.createEClass(XAutomatedLearning.XCLASSNAME), [
			XAutomatedLearning.FEATURE_TASK,
			XAutomatedLearning.FEATURE_LIBRARY,
		]);
	}

	public getTask(): XAutomatedTask {
		return this.task;
	}

	public setTask(newTask: XAutomatedTask): void {
		let oldTask = this.task;
		this.task = newTask;
		this.eSetNotify(XAutomatedLearning.FEATURE_TASK, oldTask, newTask);
	}

	public getLibrary(): XLibrary {
		return this.library;
	}

	public setLibrary(newLibrary: XLibrary): void {
		let oldLibrary = this.library;
		this.library = newLibrary;
		this.eSetNotify(XAutomatedLearning.FEATURE_LIBRARY, oldLibrary, newLibrary);
	}

}
