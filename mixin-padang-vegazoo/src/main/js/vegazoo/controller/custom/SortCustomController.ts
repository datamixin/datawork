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

import BaseHandler from "webface/wef/base/BaseHandler";

import XSort from "vegazoo/model/XSort";

import * as directors from "vegazoo/directors";

import SortCustomView from "vegazoo/view/custom/SortCustomView";

import SortValueSetCommand from "vegazoo/commands/SortValueSetCommand";

import SortValueSetRequest from "vegazoo/requests/custom/SortValueSetRequest";

import ValueDefCustomController from "vegazoo/controller/custom/ValueDefCustomController";

export default class SortOrderCustomController extends ValueDefCustomController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(SortValueSetRequest.REQUEST_NAME, new SortOrderValueSetHandler(this));
	}

	public createView(): SortCustomView {
		return new SortCustomView(this);
	}

	public getView(): SortCustomView {
		return <SortCustomView>super.getView();
	}

	public getModel(): XSort {
		return <XSort>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshEncodings();
		this.refreshValue();
	}

	private refreshEncodings(): void {
		let director = directors.getDesignPartDirector(this);
		let encodings = director.getEncodingFieldNames(this, false);
		let view = this.getView();
		view.setEncodings(encodings);
	}

	private refreshValue(): void {
		let model = this.getModel();
		let value = model.getValue();
		let view = this.getView();
		view.setValue(value);
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (feature === XSort.FEATURE_VALUE) {
			if (eventType === Notification.SET) {
				this.refreshValue();
			}
		}
	}

}

class SortOrderValueSetHandler extends BaseHandler {

	public handle(request: SortValueSetRequest, _callback: (data: any) => void): void {
		let value = request.getData(SortValueSetRequest.VALUE);
		let command = new SortValueSetCommand();
		let controller = <SortOrderCustomController>this.controller;
		let model = controller.getModel();
		command.setSortOrder(model);
		command.setValue(value);
		controller.execute(command);
	}

}
