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
import * as wef from "webface/wef";

import Controller from "webface/wef/Controller";

import Notification from "webface/model/Notification";

import BaseHandler from "webface/wef/base/BaseHandler";
import RemoveCommand from "webface/wef/base/RemoveCommand";
import ListAddCommand from "webface/wef/base/ListAddCommand";
import BaseSelectionParticipant from "webface/wef/base/BaseSelectionParticipant";

import * as directors from "vegazoo/directors";

import XTopLevelLayerSpec from "vegazoo/model/XTopLevelLayerSpec";

import TopLevelLayerSpecDesignView from "vegazoo/view/design/TopLevelLayerSpecDesignView";

import TopLevelSpecDesignController from "vegazoo/controller/design/TopLevelSpecDesignController";

import TopLevelLayerSpecLayerAddRequest from "vegazoo/requests/design/TopLevelLayerSpecLayerAddRequest";
import TopLevelLayerSpecLayerCountRequest from "vegazoo/requests/design/TopLevelLayerSpecLayerCountRequest";
import TopLevelLayerSpecLayerRemoveRequest from "vegazoo/requests/design/TopLevelLayerSpecLayerRemoveRequest";
import TopLevelLayerSpecLayerSelectionRequest from "vegazoo/requests/design/TopLevelLayerSpecLayerSelectionRequest";

export default class TopLevelLayerSpecDesignController extends TopLevelSpecDesignController {

	constructor() {
		super();
		this.addParticipant(wef.SELECTION_PARTICIPANT, new TopLevelLayerSpecSelectionParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(TopLevelLayerSpecLayerAddRequest.REQUEST_NAME, new TopLevelLayerSpecLayerAddHandler(this));
		super.installRequestHandler(TopLevelLayerSpecLayerCountRequest.REQUEST_NAME, new TopLevelLayerSpecLayerCountHandler(this));
		super.installRequestHandler(TopLevelLayerSpecLayerRemoveRequest.REQUEST_NAME, new TopLevelLayerSpecLayerRemoveHandler(this));
		super.installRequestHandler(TopLevelLayerSpecLayerSelectionRequest.REQUEST_NAME, new TopLevelLayerSpecLayerSelectionHandler(this));
	}

	public createView(): TopLevelLayerSpecDesignView {
		return new TopLevelLayerSpecDesignView(this);
	}

	public getView(): TopLevelLayerSpecDesignView {
		return <TopLevelLayerSpecDesignView>super.getView();
	}

	public getModel(): XTopLevelLayerSpec {
		return <XTopLevelLayerSpec>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let layer = model.getLayer();
		return layer.toArray();
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (feature === XTopLevelLayerSpec.FEATURE_LAYER) {
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

class TopLevelLayerSpecLayerAddHandler extends BaseHandler {

	public handle(request: TopLevelLayerSpecLayerAddRequest, callback: (data: any) => void): void {
		let director = directors.getDesignPartDirector(this.controller);
		let element = director.createDefaultUnitSpec(this.controller);
		let model = <XTopLevelLayerSpec>this.controller.getModel();
		let layer = model.getLayer();
		let command = new ListAddCommand();
		command.setList(layer);
		command.setElement(element);
		this.controller.execute(command);
	}
}

class TopLevelLayerSpecLayerCountHandler extends BaseHandler {

	public handle(request: TopLevelLayerSpecLayerCountRequest, callback: (data: any) => void): void {
		let model = <XTopLevelLayerSpec>this.controller.getModel();
		let list = model.getLayer();
		callback(list.size);
	}
}

class TopLevelLayerSpecLayerRemoveHandler extends BaseHandler {

	public handle(request: TopLevelLayerSpecLayerRemoveRequest, callback: (data: any) => void): void {
		let index = <number>request.getData(TopLevelLayerSpecLayerRemoveRequest.INDEX);
		let model = <XTopLevelLayerSpec>this.controller.getModel();
		let layer = model.getLayer();
		let item = layer.get(index);
		let command = new RemoveCommand();
		command.setModel(item);
		this.controller.execute(command);
	}
}

class TopLevelLayerSpecSelectionParticipant extends BaseSelectionParticipant {

	public setSelected(controller: Controller, selected: boolean): void {
		let children = this.controller.getChildren();
		let index = children.indexOf(controller);
		if (index !== -1) {
			let view = <TopLevelLayerSpecDesignView>this.controller.getView();
			view.setLayerSelected(index, selected);
		}
	}

}

class TopLevelLayerSpecLayerSelectionHandler extends BaseHandler {

	public handle(request: TopLevelLayerSpecLayerSelectionRequest, callback: (data: any) => void): void {
		let director = wef.getSelectionDirector(this.controller);
		let index = request.getNumberData(TopLevelLayerSpecLayerSelectionRequest.INDEX);
		let children = this.controller.getChildren();
		director.select(children[index]);
	}

}
