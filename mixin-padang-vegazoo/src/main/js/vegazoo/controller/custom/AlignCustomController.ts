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
import Notification from "webface/model/Notification";

import BaseHandler from "webface/wef/base/BaseHandler";

import XAlign from "vegazoo/model/XAlign";

import AlignCustomView from "vegazoo/view/custom/AlignCustomView";

import AlignValueSetCommand from "vegazoo/commands/AlignValueSetCommand";

import AlignValueSetRequest from "vegazoo/requests/custom/AlignValueSetRequest";

import ValueDefCustomController from "vegazoo/controller/custom/ValueDefCustomController";

export default class AlignCustomController extends ValueDefCustomController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(AlignValueSetRequest.REQUEST_NAME, new AlignValueSetHandler(this));
	}

	public createView(): AlignCustomView {
		return new AlignCustomView(this);
	}

	public getView(): AlignCustomView {
		return <AlignCustomView>super.getView();
	}

	public getModel(): XAlign {
		return <XAlign>super.getModel();
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
		if (feature === XAlign.FEATURE_VALUE) {
			if (eventType === Notification.SET) {
				this.refreshValue();
			}
		}
	}

}

class AlignValueSetHandler extends BaseHandler {

	public handle(request: AlignValueSetRequest, callback: (data: any) => void): void {
		let value = request.getData(AlignValueSetRequest.VALUE);
		let command = new AlignValueSetCommand();
		let controller = <AlignCustomController>this.controller;
		let model = controller.getModel();
		command.setAlign(model);
		command.setValue(value);
		controller.execute(command);
	}

}
