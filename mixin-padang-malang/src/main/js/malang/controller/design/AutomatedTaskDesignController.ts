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
import BaseHandler from "webface/wef/base/BaseHandler";
import ReplaceCommand from "webface/wef/base/ReplaceCommand";

import EObjectController from "webface/wef/base/EObjectController";

import * as directors from "malang/directors";

import XAutomatedTask from "malang/model/XAutomatedTask";
import MalangCreator from "malang/model/MalangCreator";

import AutomatedTaskListRequest from "malang/requests/AutomatedTaskListRequest";
import AutomatedTaskDetailRequest from "malang/requests/AutomatedTaskDetailRequest";

import AutomatedTaskListHandler from "malang/handlers/AutomatedTaskListHandler";
import AutomatedTaskDetailHandler from "malang/handlers/AutomatedTaskDetailHandler";

import AutomatedTaskDesignView from "malang/view/design/AutomatedTaskDesignView";

import AutomatedTaskNameSetRequest from "malang/requests/design/AutomatedTaskNameSetRequest";
import { XAutomatedLearning } from "malang/model";

export default class AutomatedTaskDesignController extends EObjectController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		this.installRequestHandler(AutomatedTaskListRequest.REQUEST_NAME, new AutomatedTaskListHandler(this));
		this.installRequestHandler(AutomatedTaskDetailRequest.REQUEST_NAME, new AutomatedTaskDetailHandler(this));
		this.installRequestHandler(AutomatedTaskNameSetRequest.REQUEST_NAME, new AutomatedTaskNameSetHandler(this));
	}

	public createView(): AutomatedTaskDesignView {
		return new AutomatedTaskDesignView(this);
	}

	public getView(): AutomatedTaskDesignView {
		return <AutomatedTaskDesignView>super.getView();
	}

	public getModel(): XAutomatedTask {
		return <XAutomatedTask>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshLabel();
	}

	private refreshLabel(): void {
		let model = this.getModel();
		let learning = <XAutomatedLearning>model.eContainer();
		let library = learning.getLibrary();
		let director = directors.getLibraryPlanDirector(this);
		let plan = director.getTaskPlan(library, model);
		let label = plan.getLabel();
		let view = this.getView();
		view.setLabel(label);
	}

}

class AutomatedTaskNameSetHandler extends BaseHandler {

	public handle(request: AutomatedTaskNameSetRequest, _callback: (data?: any) => void): void {
		let name = request.getStringData(AutomatedTaskNameSetRequest.NAME);
		let model = <XAutomatedTask>this.controller.getModel();
		if (model.getName() !== name) {
			let creator = MalangCreator.eINSTANCE;
			let algorithm = creator.createAutomatedTask(name);
			let command = new ReplaceCommand();
			let model = this.controller.getModel();
			command.setModel(model);
			command.setReplacement(algorithm);
			this.controller.execute(command);
		}
	}

}