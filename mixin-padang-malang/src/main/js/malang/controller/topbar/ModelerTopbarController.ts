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
import Notification from "webface/model/Notification";
import ContentAdapter from "webface/model/ContentAdapter";

import BaseHandler from "webface/wef/base/BaseHandler";
import EObjectController from "webface/wef/base/EObjectController";

import * as bekasi from "bekasi/directors";

import BaseContentLayoutParticipant from "bekasi/directors/BaseContentLayoutParticipant";

import * as directors from "malang/directors";

import XModeler from "malang/model/XModeler";

import ModelerTopbarView from "malang/view/topbar/ModelerTopbarView";

import ModelerReadyExecuteRequest from "malang/requests/topbar/ModelerReadyExecuteRequest";
import ModelerLearningExecuteRequest from "malang/requests/topbar/ModelerLearningExecuteRequest";

export default class ModelerTopbarController extends EObjectController {

	private adapter = new ModelerAdapter(this);

	constructor() {
		super();
		this.addParticipant(bekasi.CONTENT_LAYOUT_PARTICIPANT, new BaseContentLayoutParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(ModelerReadyExecuteRequest.REQUEST_NAME, new ModelerReadyExecuteHandler(this));
		super.installRequestHandler(ModelerLearningExecuteRequest.REQUEST_NAME, new ModelerLearningExecuteHandler(this));
	}

	public createView(): ModelerTopbarView {
		return new ModelerTopbarView(this);
	}

	public getView(): ModelerTopbarView {
		return <ModelerTopbarView>super.getView();
	}

	public getModel(): XModeler {
		return <XModeler>super.getModel();
	}

	public getCustomAdapters(): ContentAdapter[] {
		return [this.adapter];
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.relayout();
		this.refreshExecuteEnabled();
	}

	private refreshExecuteEnabled(): void {
		let view = this.getView();
		view.setExecuteEnabled(true);
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		if (eventType === Notification.SET) {
			this.relayout();
		}
	}

}

class ModelerAdapter extends ContentAdapter {

	private controller: ModelerTopbarController = null;

	constructor(controller: ModelerTopbarController) {
		super();
		this.controller = controller;
	}

	public notifyChanged(): void {
		this.controller.refreshVisuals();
	}

}

class ModelerReadyExecuteHandler extends BaseHandler {

	public handle(_request: ModelerReadyExecuteRequest, callback: (message: string) => void): void {
		let model = <XModeler>this.controller.getModel();
		let director = directors.getOutputPartDirector(this.controller);
		director.readyExecute(model, callback);
	}

}

class ModelerLearningExecuteHandler extends BaseHandler {

	public handle(_request: ModelerLearningExecuteRequest, callback: () => void): void {
		let model = <XModeler>this.controller.getModel();
		let director = directors.getOutputPartDirector(this.controller);
		director.executeModeler(model, callback);
	}

}
