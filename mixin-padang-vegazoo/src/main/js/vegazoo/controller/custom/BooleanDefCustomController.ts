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

import XBooleanDef from "vegazoo/model/XBooleanDef";

import BooleanDefCustomView from "vegazoo/view/custom/BooleanDefCustomView";

import BooleanDefValueSetCommand from "vegazoo/commands/BooleanDefValueSetCommand";

import BooleanDefValueSetRequest from "vegazoo/requests/custom/BooleanDefValueSetRequest";

import ValueDefCustomController from "vegazoo/controller/custom/ValueDefCustomController";

export default class BooleanDefCustomController extends ValueDefCustomController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(BooleanDefValueSetRequest.REQUEST_NAME, new BooleanDefValueSetHandler(this));
	}

	public createView(): BooleanDefCustomView {
		return new BooleanDefCustomView(this);
	}

	public getView(): BooleanDefCustomView {
		return <BooleanDefCustomView>super.getView();
	}

	public getModel(): XBooleanDef {
		return <XBooleanDef>super.getModel();
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
		if (feature === XBooleanDef.FEATURE_VALUE) {
			if (eventType === Notification.SET) {
				this.refreshValue();
			}
		}
	}

}

class BooleanDefValueSetHandler extends BaseHandler {

	public handle(request: BooleanDefValueSetRequest, _callback: (data: any) => void): void {
		let value = request.getData(BooleanDefValueSetRequest.VALUE);
		let command = new BooleanDefValueSetCommand();
		let controller = <BooleanDefCustomController>this.controller;
		let model = controller.getModel();
		command.setBooleanDef(model);
		command.setValue(value);
		controller.execute(command);
	}

}
