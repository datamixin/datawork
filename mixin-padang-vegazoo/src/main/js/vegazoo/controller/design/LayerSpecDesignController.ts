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

import * as bekasi from "bekasi/directors";

import * as directors from "vegazoo/directors";

import XLayerSpec from "vegazoo/model/XLayerSpec";

import LayerSpecDesignView from "vegazoo/view/design/LayerSpecDesignView";

import LayerSpecLayerAddRequest from "vegazoo/requests/design/LayerSpecLayerAddRequest";
import LayerSpecLayerCountRequest from "vegazoo/requests/design/LayerSpecLayerCountRequest";
import LayerSpecLayerRemoveRequest from "vegazoo/requests/design/LayerSpecLayerRemoveRequest";
import LayerSpecLayerSelectionRequest from "vegazoo/requests/design/LayerSpecLayerSelectionRequest";

import ViewSpecDesignController from "vegazoo/controller/design/ViewSpecDesignController";

export default class LayerSpecDesignController extends ViewSpecDesignController {

	constructor() {
		super();
		this.addParticipant(wef.SELECTION_PARTICIPANT, new LayerSpecSelectionParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(LayerSpecLayerAddRequest.REQUEST_NAME, new LayerSpecLayerAddHandler(this));
		super.installRequestHandler(LayerSpecLayerCountRequest.REQUEST_NAME, new LayerSpecLayerCountHandler(this));
		super.installRequestHandler(LayerSpecLayerRemoveRequest.REQUEST_NAME, new LayerSpecLayerRemoveHandler(this));
		super.installRequestHandler(LayerSpecLayerSelectionRequest.REQUEST_NAME, new LayerSpecLayerSelectionHandler(this));
	}

	public createView(): LayerSpecDesignView {
		return new LayerSpecDesignView(this);
	}

	public getView(): LayerSpecDesignView {
		return <LayerSpecDesignView>super.getView();
	}

	public getModel(): XLayerSpec {
		return <XLayerSpec>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let layer = model.getLayer();
		return layer.toArray();
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
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (feature === XLayerSpec.FEATURE_LAYER) {
			if (eventType === Notification.ADD || eventType === Notification.REMOVE) {
				this.refreshChildren();
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

class LayerSpecLayerAddHandler extends BaseHandler {

	public handle(): void {
		let director = directors.getDesignPartDirector(this.controller);
		let element = director.createDefaultUnitSpec(this.controller);
		let model = <XLayerSpec>this.controller.getModel();
		let layer = model.getLayer();
		let command = new ListAddCommand();
		command.setList(layer);
		command.setElement(element);
		this.controller.execute(command);
	}
}

class LayerSpecLayerCountHandler extends BaseHandler {

	public handle(request: LayerSpecLayerCountRequest, callback: (data: any) => void): void {
		let model = <XLayerSpec>this.controller.getModel();
		let list = model.getLayer();
		callback(list.size);
	}
}

class LayerSpecLayerRemoveHandler extends BaseHandler {

	public handle(request: LayerSpecLayerRemoveRequest): void {
		let index = <number>request.getData(LayerSpecLayerRemoveRequest.INDEX);
		let model = <XLayerSpec>this.controller.getModel();
		let layer = model.getLayer();
		let item = layer.get(index);
		let command = new RemoveCommand();
		command.setModel(item);
		this.controller.execute(command);
	}
}

class LayerSpecSelectionParticipant extends BaseSelectionParticipant {

	public setSelected(controller: Controller, selected: boolean): void {
		let children = this.controller.getChildren();
		let index = children.indexOf(controller);
		if (index !== -1) {
			let view = <LayerSpecDesignView>this.controller.getView();
			view.setLayerSelected(index, selected);
		}
	}

}

class LayerSpecLayerSelectionHandler extends BaseHandler {

	public handle(request: LayerSpecLayerSelectionRequest): void {
		let director = wef.getSelectionDirector(this.controller);
		let index = request.getNumberData(LayerSpecLayerSelectionRequest.INDEX);
		let children = this.controller.getChildren();
		director.select(children[index]);
	}

}
