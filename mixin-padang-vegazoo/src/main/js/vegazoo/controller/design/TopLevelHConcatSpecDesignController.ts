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

import XTopLevelHConcatSpec from "vegazoo/model/XTopLevelHConcatSpec";

import TopLevelHConcatSpecDesignView from "vegazoo/view/design/TopLevelHConcatSpecDesignView";

import TopLevelSpecDesignController from "vegazoo/controller/design/TopLevelSpecDesignController";

import TopLevelHConcatSpecItemAddRequest from "vegazoo/requests/design/TopLevelHConcatSpecItemAddRequest";
import TopLevelHConcatSpecItemCountRequest from "vegazoo/requests/design/TopLevelHConcatSpecItemCountRequest";
import TopLevelHConcatSpecItemRemoveRequest from "vegazoo/requests/design/TopLevelHConcatSpecItemRemoveRequest";
import TopLevelHConcatSpecItemSelectionRequest from "vegazoo/requests/design/TopLevelHConcatSpecItemSelectionRequest";

export default class TopLevelHConcatSpecDesignController extends TopLevelSpecDesignController {

	constructor() {
		super();
		this.addParticipant(wef.SELECTION_PARTICIPANT, new TopLevelHConcatSpecSelectionParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(TopLevelHConcatSpecItemAddRequest.REQUEST_NAME, new TopLevelHConcatSpecItemAddHandler(this));
		super.installRequestHandler(TopLevelHConcatSpecItemCountRequest.REQUEST_NAME, new TopLevelHConcatSpecItemCountHandler(this));
		super.installRequestHandler(TopLevelHConcatSpecItemRemoveRequest.REQUEST_NAME, new TopLevelHConcatSpecItemRemoveHandler(this));
		super.installRequestHandler(TopLevelHConcatSpecItemSelectionRequest.REQUEST_NAME, new TopLevelHConcatSpecItemSelectionHandler(this));
	}

	public createView(): TopLevelHConcatSpecDesignView {
		return new TopLevelHConcatSpecDesignView(this);
	}

	public getView(): TopLevelHConcatSpecDesignView {
		return <TopLevelHConcatSpecDesignView>super.getView();
	}

	public getModel(): XTopLevelHConcatSpec {
		return <XTopLevelHConcatSpec>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let items = model.getHconcat();
		return items.toArray();
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (feature === XTopLevelHConcatSpec.FEATURE_HCONCAT) {
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

class TopLevelHConcatSpecItemAddHandler extends BaseHandler {

	public handle(_request: TopLevelHConcatSpecItemAddRequest, _callback: (data: any) => void): void {
		let director = directors.getDesignPartDirector(this.controller);
		let element = director.createDefaultFacetedUnitSpec(this.controller);
		let model = <XTopLevelHConcatSpec>this.controller.getModel();
		let items = model.getHconcat();
		let command = new ListAddCommand();
		command.setList(items);
		command.setElement(element);
		this.controller.execute(command);
	}
}

class TopLevelHConcatSpecItemCountHandler extends BaseHandler {

	public handle(_request: TopLevelHConcatSpecItemCountRequest, callback: (data: any) => void): void {
		let model = <XTopLevelHConcatSpec>this.controller.getModel();
		let list = model.getHconcat();
		callback(list.size);
	}
}

class TopLevelHConcatSpecItemRemoveHandler extends BaseHandler {

	public handle(request: TopLevelHConcatSpecItemRemoveRequest, _callback: (data: any) => void): void {
		let index = <number>request.getData(TopLevelHConcatSpecItemRemoveRequest.INDEX);
		let model = <XTopLevelHConcatSpec>this.controller.getModel();
		let items = model.getHconcat();
		let item = items.get(index);
		let command = new RemoveCommand();
		command.setModel(item);
		this.controller.execute(command);
	}
}

class TopLevelHConcatSpecSelectionParticipant extends BaseSelectionParticipant {

	public setSelected(controller: Controller, selected: boolean): void {
		let children = this.controller.getChildren();
		let index = children.indexOf(controller);
		if (index !== -1) {
			let view = <TopLevelHConcatSpecDesignView>this.controller.getView();
			view.setLayerSelected(index, selected);
		}
	}

}

class TopLevelHConcatSpecItemSelectionHandler extends BaseHandler {

	public handle(request: TopLevelHConcatSpecItemSelectionRequest, _callback: (data: any) => void): void {
		let director = wef.getSelectionDirector(this.controller);
		let index = request.getNumberData(TopLevelHConcatSpecItemSelectionRequest.INDEX);
		let children = this.controller.getChildren();
		director.select(children[index]);
	}

}
