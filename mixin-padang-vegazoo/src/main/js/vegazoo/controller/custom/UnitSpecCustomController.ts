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

import XUnitSpec from "vegazoo/model/XUnitSpec";

import UnitSpecCustomView from "vegazoo/view/custom/UnitSpecCustomView";

import UnitSpecTitleSetCommand from "vegazoo/commands/UnitSpecTitleSetCommand";

import UnitSpecTitleSetRequest from "vegazoo/requests/custom/UnitSpecTitleSetRequest";

import ObjectDefCustomController from "vegazoo/controller/custom/ObjectDefCustomController";

export default class UnitSpecCustomController extends ObjectDefCustomController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(UnitSpecTitleSetRequest.REQUEST_NAME, new UnitSpecTitleSetHandler(this));
	}

	public createView(): UnitSpecCustomView {
		return new UnitSpecCustomView(this, true, "Custom");
	}

	public getView(): UnitSpecCustomView {
		return <UnitSpecCustomView>super.getView();
	}

	public getModel(): XUnitSpec {
		return <XUnitSpec>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshTitle();
	}

	private refreshTitle(): void {
		let model = this.getModel();
		let title = model.getTitle();
		let view = this.getView();
		view.setTitle(title);
	}

	public notifyChanged(notification: Notification): void {
		super.notifyChanged(notification);
	}

}

class UnitSpecTitleSetHandler extends BaseHandler {

	public handle(request: UnitSpecTitleSetRequest, _callback: (data: any) => void): void {
		let title = request.getData(UnitSpecTitleSetRequest.TITLE);
		let command = new UnitSpecTitleSetCommand();
		let controller = <UnitSpecCustomController>this.controller;
		let scale = controller.getModel();
		command.setUnitSpec(scale);
		command.setTitle(title === "" ? null : title);
		controller.execute(command);
	}

}
