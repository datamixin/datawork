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
import CommandGroup from "webface/wef/CommandGroup";

import Notification from "webface/model/Notification";

import BaseHandler from "webface/wef/base/BaseHandler";
import EObjectController from "webface/wef/base/EObjectController";
import ListRepopulateCommand from "webface/wef/base/ListRepopulateCommand";

import * as bekasi from "bekasi/directors";

import BaseContentLayoutParticipant from "bekasi/directors/BaseContentLayoutParticipant";

import XRoutine from "rinjani/model/XRoutine";
import RinjaniCreator from "rinjani/model/RinjaniCreator";

import * as directors from "rinjani/directors";

import PlotListRequest from "rinjani/requests/PlotListRequest";
import PlotDetailRequest from "rinjani/requests/PlotDetailRequest";
import PlotPreviewRequest from "rinjani/requests/PlotPreviewRequest";

import PlotListHandler from "rinjani/handlers/PlotListHandler";
import PlotDetailHandler from "rinjani/handlers/PlotDetailHandler";
import PlotPreviewHandler from "rinjani/handlers/PlotPreviewHandler";

import RoutineDesignView from "rinjani/view/design/RoutineDesignView";

import RoutineNameSetCommand from "rinjani/commands/RoutineNameSetCommand";

import RoutineNameSetRequest from "rinjani/requests/design/RoutineNameSetRequest";
import RoutineSourceNameRequest from "rinjani/requests/design/RoutineSourceNameRequest";

export default class RoutineDesignController extends EObjectController {

	constructor() {
		super();
		this.addParticipant(bekasi.CONTENT_LAYOUT_PARTICIPANT, new BaseContentLayoutParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		this.installRequestHandler(PlotListRequest.REQUEST_NAME, new PlotListHandler(this));
		this.installRequestHandler(PlotDetailRequest.REQUEST_NAME, new PlotDetailHandler(this));
		this.installRequestHandler(PlotPreviewRequest.REQUEST_NAME, new PlotPreviewHandler(this));
		this.installRequestHandler(RoutineNameSetRequest.REQUEST_NAME, new RoutineNameSetHandler(this));
		this.installRequestHandler(RoutineSourceNameRequest.REQUEST_NAME, new RoutineSourceNameHandler(this));
	}

	public createView(): RoutineDesignView {
		return new RoutineDesignView(this);
	}

	public getView(): RoutineDesignView {
		return <RoutineDesignView>super.getView();
	}

	public getModel(): XRoutine {
		return <XRoutine>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let inputs = model.getInputs();
		let parameters = model.getParameters();
		return [inputs, parameters];
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshName();
	}

	private refreshName(): void {
		let model = this.getModel();
		let name = model.getName();
		let view = this.getView();
		view.setName(name);
	}

	public refreshChildren(): void {
		super.refreshChildren();
		this.relayout();
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public notifyChanged(notification: Notification): void {
		let feature = notification.getFeature();
		if (feature === XRoutine.FEATURE_NAME) {
			this.refreshName();
			this.relayout();
		}
	}

}

class RoutineNameSetHandler extends BaseHandler {

	public handle(request: RoutineNameSetRequest, _callback: (data?: any) => void): void {
		let newName = request.getStringData(RoutineNameSetRequest.NAME);
		let controller = <RoutineDesignController>this.controller;
		let model = controller.getModel();
		let oldName = model.getName();
		if (oldName !== newName) {

			// Name
			let setNameCommand = new RoutineNameSetCommand();
			setNameCommand.setRoutine(model);
			setNameCommand.setName(newName);

			// Inputs
			let creator = RinjaniCreator.eINSTANCE;
			let oldInputs = model.getInputs();
			let newInputs = creator.createInputList(controller, newName);
			let repopulateInputsCommand = new ListRepopulateCommand();
			repopulateInputsCommand.setList(oldInputs);
			repopulateInputsCommand.setElements(newInputs);

			// Parameters
			let oldParameters = model.getParameters();
			let newParameters = creator.createParameterList(controller, newName);
			let repopulateParametersCommand = new ListRepopulateCommand();
			repopulateParametersCommand.setList(oldParameters);
			repopulateParametersCommand.setElements(newParameters);

			let group = new CommandGroup([
				setNameCommand,
				repopulateInputsCommand,
				repopulateParametersCommand
			]);
			this.controller.execute(group);
		}
	}

}

class RoutineSourceNameHandler extends BaseHandler {

	public handle(_request: RoutineSourceNameRequest, callback: (data: any) => void): void {
		let director = directors.getDesignPartDirector(this.controller);
		let source = director.getSourceName();
		callback(source);
	}

}