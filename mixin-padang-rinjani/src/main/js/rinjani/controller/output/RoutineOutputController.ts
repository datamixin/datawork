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

import EObjectController from "webface/wef/base/EObjectController";

import * as bekasi from "bekasi/directors";

import BaseContentLayoutParticipant from "bekasi/directors/BaseContentLayoutParticipant";

import XRoutine from "rinjani/model/XRoutine";

import * as directors from "rinjani/directors";

import RoutineOutputView from "rinjani/view/output/RoutineOutputView";

export default class RoutineOutputController extends EObjectController {

	private adapter = new RoutineAdapter(this);

	constructor() {
		super();
		this.addParticipant(bekasi.CONTENT_LAYOUT_PARTICIPANT, new BaseContentLayoutParticipant(this));
	}

	public createView(): RoutineOutputView {
		return new RoutineOutputView(this);
	}

	public getView(): RoutineOutputView {
		return <RoutineOutputView>super.getView();
	}

	public getModel(): XRoutine {
		return <XRoutine>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let result = model.getResult();
		return [result];
	}

	public getCustomAdapters(): ContentAdapter[] {
		return [this.adapter];
	}

	public activate(): void {
		super.activate();
		this.refreshResult();
	}

	public refreshResult(): void {
		let children = this.getChildren();
		if (children.length > 0) {
			let result = children[0];
			result.refresh();
		}
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		if (eventType === Notification.SET) {
			this.refreshChildren();
			this.relayout();
		}
	}

}

class RoutineAdapter extends ContentAdapter {

	private controller: RoutineOutputController = null;

	constructor(controller: RoutineOutputController) {
		super();
		this.controller = controller;
	}

	public notifyChanged(): void {
		let director = directors.getOutputPartDirector(this.controller);
		let model = this.controller.getModel();
		director.routineChanged(model);
		this.controller.refreshResult();
	}

}
