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
import Notification from "webface/model/Notification";
import ContentAdapter from "webface/model/ContentAdapter";

import BaseHandler from "webface/wef/base/BaseHandler";
import EObjectController from "webface/wef/base/EObjectController";

import * as bekasi from "bekasi/directors";

import BaseContentLayoutParticipant from "bekasi/directors/BaseContentLayoutParticipant";

import * as directors from "rinjani/directors";

import XRoutine from "rinjani/model/XRoutine";

import RoutineTopbarView from "rinjani/view/topbar/RoutineTopbarView";

import RoutineResultSpecRequest from "rinjani/requests/topbar/RoutineResultSpecRequest";

export default class RoutineTopbarController extends EObjectController {

	private adapter = new RoutineAdapter(this);

	constructor() {
		super();
		this.addParticipant(bekasi.CONTENT_LAYOUT_PARTICIPANT, new BaseContentLayoutParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(RoutineResultSpecRequest.REQUEST_NAME, new RoutineResultSpecHandler(this));
	}

	public createView(): RoutineTopbarView {
		return new RoutineTopbarView(this);
	}

	public getView(): RoutineTopbarView {
		return <RoutineTopbarView>super.getView();
	}

	public getModel(): XRoutine {
		return <XRoutine>super.getModel();
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

class RoutineAdapter extends ContentAdapter {

	private controller: RoutineTopbarController = null;

	constructor(controller: RoutineTopbarController) {
		super();
		this.controller = controller;
	}

	public notifyChanged(): void {
		this.controller.refreshVisuals();
	}

}

class RoutineResultSpecHandler extends BaseHandler {

	public handle(_request: RoutineResultSpecRequest, callback: () => void): void {
		let director = directors.getOutputPartDirector(this.controller);
		director.getResultSpec(callback);
	}

}
