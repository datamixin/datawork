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

import BaseHandler from "webface/wef/base/BaseHandler";
import RemoveCommand from "webface/wef/base/RemoveCommand";
import ListAddCommand from "webface/wef/base/ListAddCommand";
import BaseSelectionParticipant from "webface/wef/base/BaseSelectionParticipant";

import * as directors from "vegazoo/directors";

import XTopLevelVConcatSpec from "vegazoo/model/XTopLevelVConcatSpec";

import TopLevelVConcatSpecDesignView from "vegazoo/view/design/TopLevelVConcatSpecDesignView";

import TopLevelSpecDesignController from "vegazoo/controller/design/TopLevelSpecDesignController";

import TopLevelVConcatSpecItemAddRequest from "vegazoo/requests/design/TopLevelVConcatSpecItemAddRequest";
import TopLevelVConcatSpecItemCountRequest from "vegazoo/requests/design/TopLevelVConcatSpecItemCountRequest";
import TopLevelVConcatSpecItemRemoveRequest from "vegazoo/requests/design/TopLevelVConcatSpecItemRemoveRequest";
import TopLevelVConcatSpecItemSelectionRequest from "vegazoo/requests/design/TopLevelVConcatSpecItemSelectionRequest";

export default class TopLevelVConcatSpecDesignController extends TopLevelSpecDesignController {

	constructor() {
		super();
		this.addParticipant(wef.SELECTION_PARTICIPANT, new TopLevelVConcatSpecSelectionParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(TopLevelVConcatSpecItemAddRequest.REQUEST_NAME, new TopLevelVConcatSpecItemAddHandler(this));
		super.installRequestHandler(TopLevelVConcatSpecItemCountRequest.REQUEST_NAME, new TopLevelVConcatSpecItemCountHandler(this));
		super.installRequestHandler(TopLevelVConcatSpecItemRemoveRequest.REQUEST_NAME, new TopLevelVConcatSpecItemRemoveHandler(this));
		super.installRequestHandler(TopLevelVConcatSpecItemSelectionRequest.REQUEST_NAME, new TopLevelVConcatSpecItemSelectionHandler(this));
	}

	public createView(): TopLevelVConcatSpecDesignView {
		return new TopLevelVConcatSpecDesignView(this);
	}

	public getView(): TopLevelVConcatSpecDesignView {
		return <TopLevelVConcatSpecDesignView>super.getView();
	}

	public getModel(): XTopLevelVConcatSpec {
		return <XTopLevelVConcatSpec>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let layer = model.getVconcat();
		return layer.toArray();
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (feature === XTopLevelVConcatSpec.FEATURE_VCONCAT) {
			if (eventType === Notification.ADD || eventType === Notification.REMOVE) {
				this.refresh();
				let index = notification.getListPosition();
				let children = this.getChildren();
				if (index === children.length) {
					index = children.length - 1;
				}
				let director = wef.getSelectionDirector(this);
				director.select(children[index]);
			}
		}
	}

}

class TopLevelVConcatSpecItemAddHandler extends BaseHandler {

	public handle(_request: TopLevelVConcatSpecItemAddRequest, _callback: (data: any) => void): void {
		let director = directors.getDesignPartDirector(this.controller);
		let element = director.createDefaultFacetedUnitSpec(this.controller);
		let model = <XTopLevelVConcatSpec>this.controller.getModel();
		let layer = model.getVconcat();
		let command = new ListAddCommand();
		command.setList(layer);
		command.setElement(element);
		this.controller.execute(command);
	}
}

class TopLevelVConcatSpecItemCountHandler extends BaseHandler {

	public handle(_request: TopLevelVConcatSpecItemCountRequest, callback: (data: any) => void): void {
		let model = <XTopLevelVConcatSpec>this.controller.getModel();
		let list = model.getVconcat();
		callback(list.size);
	}
}

class TopLevelVConcatSpecItemRemoveHandler extends BaseHandler {

	public handle(request: TopLevelVConcatSpecItemRemoveRequest, _callback: (data: any) => void): void {
		let index = <number>request.getData(TopLevelVConcatSpecItemRemoveRequest.INDEX);
		let model = <XTopLevelVConcatSpec>this.controller.getModel();
		let layer = model.getVconcat();
		let item = layer.get(index);
		let command = new RemoveCommand();
		command.setModel(item);
		this.controller.execute(command);
	}
}

class TopLevelVConcatSpecSelectionParticipant extends BaseSelectionParticipant {

	public setSelected(controller: Controller, selected: boolean): void {
		let children = this.controller.getChildren();
		let index = children.indexOf(controller);
		if (index !== -1) {
			let view = <TopLevelVConcatSpecDesignView>this.controller.getView();
			view.setLayerSelected(index, selected);
		}
	}

}

class TopLevelVConcatSpecItemSelectionHandler extends BaseHandler {

	public handle(request: TopLevelVConcatSpecItemSelectionRequest, _callback: (data: any) => void): void {
		let director = wef.getSelectionDirector(this.controller);
		let index = request.getNumberData(TopLevelVConcatSpecItemSelectionRequest.INDEX);
		let children = this.controller.getChildren();
		director.select(children[index]);
	}

}
