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
import * as functions from "webface/wef/functions";

import Notification from "webface/model/Notification";
import ContentAdapter from "webface/model/ContentAdapter";

import EObjectController from "webface/wef/base/EObjectController";
import BaseSelectionParticipant from "webface/wef/base/BaseSelectionParticipant";

import * as bekasi from "bekasi/directors";

import BaseContentLayoutParticipant from "bekasi/directors/BaseContentLayoutParticipant";

import XCell from "padang/model/XCell";
import XViewset from "padang/model/XViewset";

import * as directors from "padang/directors";

import ViewsetPresentView from "padang/view/present/ViewsetPresentView";

export default class ViewsetPresentController extends EObjectController {

	private adapter = new LayoutAdapter(this);

	constructor() {
		super();
		this.addParticipant(wef.SELECTION_PARTICIPANT, new ViewsetSelectionParticipant(this));
		super.addParticipant(bekasi.CONTENT_LAYOUT_PARTICIPANT, new BaseContentLayoutParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
	}

	public createView(): ViewsetPresentView {
		return new ViewsetPresentView(this);
	}

	public getModel(): XViewset {
		return <XViewset>super.getModel();
	}

	public getView(): ViewsetPresentView {
		return <ViewsetPresentView>super.getView();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let mixture = model.getMixture();
		return [mixture];
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
	}

	public activate(): void {
		super.activate();
		this.activateSelection();
	}

	private activateSelection(): void {
		let director = directors.getViewsetPresentDirector(this);
		let cell = director.getSelectedCell();
		let target: Controller = null;
		if (cell === null) {
			target = functions.getFirstDescendantByModelClass(this, XCell);
		} else {
			target = functions.getFirstDescendantByModel(this, cell);
		}
		if(target !== null){
			let manager = wef.getSelectionDirector(this);
			manager.select(target);
		}
	}

	public relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (feature === XViewset.FEATURE_SELECTION) {
			if (eventType === Notification.SET) {
				this.refresh();
			}
		}
	}

	public getCustomAdapters(): ContentAdapter[] {
		return [this.adapter];
	}

}

class LayoutAdapter extends ContentAdapter {

	protected controller: ViewsetPresentController = null;

	constructor(controller: ViewsetPresentController) {
		super();
		this.controller = controller;
	}

	public notifyChanged(notification: Notification): void {

		let eventType = notification.getEventType();
		if (eventType === Notification.SET ||
			eventType === Notification.ADD ||
			eventType === Notification.REMOVE) {
			this.controller.relayout();
		}
	}

}

class ViewsetSelectionParticipant extends BaseSelectionParticipant {

	public setSelected(controller: Controller, selected: boolean): void {
		if (selected === true) {
			let model = controller.getModel();
			if (model instanceof XCell) {
				let director = directors.getViewsetPresentDirector(this.controller);
				let cell = director.getSelectedCell();
				if (model !== cell) {
					let command = director.createSelectionSetCommand(model);
					this.controller.execute(command);
				}
			}
		}
	}

}
