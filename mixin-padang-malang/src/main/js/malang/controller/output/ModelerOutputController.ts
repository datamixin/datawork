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
import * as wef from "webface/wef";

import Controller from "webface/wef/Controller";

import Notification from "webface/model/Notification";
import ContentAdapter from "webface/model/ContentAdapter";

import EObjectController from "webface/wef/base/EObjectController";
import BaseSelectionParticipant from "webface/wef/base/BaseSelectionParticipant";

import * as bekasi from "bekasi/directors";

import BaseContentLayoutParticipant from "bekasi/directors/BaseContentLayoutParticipant";

import XModeler from "malang/model/XModeler";

import * as directors from "malang/directors";

import ModelerOutputView from "malang/view/output/ModelerOutputView";

import ResultOutputController from "malang/controller/output/ResultOutputController";

export default class ModelerOutputController extends EObjectController {

	private adapter = new ModelAdapter(this);

	constructor() {
		super();
		this.addParticipant(bekasi.CONTENT_LAYOUT_PARTICIPANT, new BaseContentLayoutParticipant(this));
		this.addParticipant(wef.SELECTION_PARTICIPANT, new ModelSelectionParticipant(this));
	}

	public createView(): ModelerOutputView {
		return new ModelerOutputView(this);
	}

	public getView(): ModelerOutputView {
		return <ModelerOutputView>super.getView();
	}

	public getModel(): XModeler {
		return <XModeler>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let result = model.getResult();
		return [result];
	}

	public getCustomAdapters(): ContentAdapter[] {
		return [this.adapter];
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

class ModelAdapter extends ContentAdapter {

	private controller: ModelerOutputController = null;

	constructor(controller: ModelerOutputController) {
		super();
		this.controller = controller;
	}

	public notifyChanged(): void {
		let director = directors.getOutputPartDirector(this.controller);
		let model = this.controller.getModel();
		director.modelChanged(model);
	}

}

class ModelSelectionParticipant extends BaseSelectionParticipant {

	public setSelected(controller: Controller, selected: boolean): void {
		let overlay = <ModelerOutputView>this.controller.getView();
		if (selected === true) {
			if (controller instanceof ResultOutputController) {
				if (controller.isEditable()) {
					let view = controller.getView();
					let control = view.getControl();
					overlay.setSelectedControl(control);
				}
			}
		}
	}

}
