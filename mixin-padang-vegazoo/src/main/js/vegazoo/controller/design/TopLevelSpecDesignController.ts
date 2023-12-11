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

import * as functions from "webface/wef/functions";

import BaseHandler from "webface/wef/base/BaseHandler";

import * as bekasi from "bekasi/directors";

import * as directors from "vegazoo/directors";

import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";

import TopLevelSpecDesignView from "vegazoo/view/design/TopLevelSpecDesignView";

import AnyOfDefDesignController from "vegazoo/controller/design/AnyOfDefDesignController";

import TopLevelSpecViewSetRequest from "vegazoo/requests/design/TopLevelSpecViewSetRequest";
import TopLevelSpecViewSelectRequest from "vegazoo/requests/design/TopLevelSpecViewSelectRequest";

export abstract class TopLevelSpecDesignController extends AnyOfDefDesignController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(TopLevelSpecViewSetRequest.REQUEST_NAME, new TopLevelSpecViewSetHandler(this));
		super.installRequestHandler(TopLevelSpecViewSelectRequest.REQUEST_NAME, new TopLevelSpecViewSelectHandler(this));
	}

	public getView(): TopLevelSpecDesignView {
		return <TopLevelSpecDesignView>super.getView();
	}

	public getModel(): XTopLevelSpec {
		return <XTopLevelSpec>super.getModel();
	}

	public refreshVisuals(): void {
		this.refreshViewMap();
		this.refreshCurrentView();
		this.refreshSelection();
		this.relayout();
	}

	private refreshViewMap(): void {
		let director = directors.getDesignPartDirector(this);
		let modeMap = director.getTopLevelModeMap();
		let view = this.getView();
		view.setViewMap(modeMap);
	}

	private refreshCurrentView(): void {
		let model = this.getModel();
		let eClass = model.eClass();
		let eClassName = eClass.getName();
		let view = this.getView();
		view.setCurrentView(eClassName);
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public refreshSelection(): void {
		let director = wef.getSelectionDirector(this);
		let selection = functions.getFirstDescendantByModelClass(this, XTopLevelSpec);
		if (selection !== null) {
			director.select(selection);
		}
	}

}

export default TopLevelSpecDesignController;

class TopLevelSpecViewSetHandler extends BaseHandler {

	public handle(request: TopLevelSpecViewSetRequest, callback: (data: any) => void): void {
		let controller = <TopLevelSpecDesignController>this.controller;
		let view = <string>request.getData(TopLevelSpecViewSetRequest.VIEW);
		let director = directors.getDesignPartDirector(controller);
		director.changeView(controller, view);
	}

}

class TopLevelSpecViewSelectHandler extends BaseHandler {

	public handle(request: TopLevelSpecViewSelectRequest, callback: (data: any) => void): void {
		let controller = <TopLevelSpecDesignController>this.controller;
		controller.refreshSelection();
	}

}

