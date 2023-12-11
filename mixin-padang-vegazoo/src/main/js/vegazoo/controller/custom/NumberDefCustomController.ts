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

import XNumberDef from "vegazoo/model/XNumberDef";

import NumberDefCustomView from "vegazoo/view/custom/NumberDefCustomView";

import NumberDefValueSetCommand from "vegazoo/commands/NumberDefValueSetCommand";

import NumberDefValueSetRequest from "vegazoo/requests/custom/NumberDefValueSetRequest";

import ValueDefCustomController from "vegazoo/controller/custom/ValueDefCustomController";

export default class NumberDefCustomController extends ValueDefCustomController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(NumberDefValueSetRequest.REQUEST_NAME, new NumberDefValueSetHandler(this));
	}

	public createView(): NumberDefCustomView {
		return new NumberDefCustomView(this);
	}

	public getView(): NumberDefCustomView {
		return <NumberDefCustomView>super.getView();
	}

	public getModel(): XNumberDef {
		return <XNumberDef>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshValue();
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
		if (feature === XNumberDef.FEATURE_VALUE) {
			if (eventType === Notification.SET) {
				this.refreshValue();
			}
		}
	}

}

class NumberDefValueSetHandler extends BaseHandler {

	public handle(request: NumberDefValueSetRequest, _callback: (data: any) => void): void {
		let value = request.getData(NumberDefValueSetRequest.VALUE);
		let command = new NumberDefValueSetCommand();
		let controller = <NumberDefCustomController>this.controller;
		let model = controller.getModel();
		command.setNumberDef(model);
		command.setValue(value);
		controller.execute(command);
	}

}
