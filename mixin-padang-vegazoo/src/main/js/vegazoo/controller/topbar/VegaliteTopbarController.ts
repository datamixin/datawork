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
import BaseHandler from "webface/wef/base/BaseHandler";

import * as directors from "vegazoo/directors";

import XVegalite from "vegazoo/model/XVegalite";

import VegaliteTopbarView from "vegazoo/view/topbar/VegaliteTopbarView";

import VegaliteSpecRequest from "vegazoo/requests/topbar/VegaliteSpecRequest";
import VegaliteRefreshRequest from "vegazoo/requests/topbar/VegaliteRefreshRequest";

import ViewletTopbarController from "vegazoo/controller/topbar/ViewletTopbarController";

export default class VegaliteTopbarController extends ViewletTopbarController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(VegaliteSpecRequest.REQUEST_NAME, new VegaliteSpecHandler(this));
		super.installRequestHandler(VegaliteRefreshRequest.REQUEST_NAME, new VegaliteRefreshHandler(this));
	}

	public createView(): VegaliteTopbarView {
		return new VegaliteTopbarView(this);
	}

	public getView(): VegaliteTopbarView {
		return <VegaliteTopbarView>super.getView();
	}

	public getModel(): XVegalite {
		return <XVegalite>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
	}

}

class VegaliteSpecHandler extends BaseHandler {

	public handle(_request: VegaliteSpecRequest, callback: (spec: any) => void): void {
		let director = directors.getOutputPartDirector(this.controller);
		let spec = director.getLastSpec();
		callback(spec);
	}

}

class VegaliteRefreshHandler extends BaseHandler {

	public handle(_request: VegaliteRefreshRequest, _callback: (spec: any) => void): void {
		let director = directors.getOutputPartDirector(this.controller);
		director.refresh();
	}

}
