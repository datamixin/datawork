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

import * as directors from "padang/directors";

import PointerField from "padang/model/PointerField";

import PointerFieldAnatomyView from "padang/view/anatomy/PointerFieldAnatomyView";

import ValueFieldAnatomyController from "padang/controller/anatomy/ValueFieldAnatomyController";

import PointerFieldActionListRequest from "padang/requests/anatomy/PointerFieldActionListRequest";

export default class PointerFieldAnatomyController extends ValueFieldAnatomyController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(PointerFieldActionListRequest.REQUEST_NAME, new PointerFieldActionListHandler(this));
	}

	public createView(): PointerFieldAnatomyView {
		return new PointerFieldAnatomyView(this);
	}

	public getModel(): PointerField {
		return <PointerField>super.getModel();
	}

	public getView(): PointerFieldAnatomyView {
		return <PointerFieldAnatomyView>super.getView();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let list = model.getList();
		return [list];
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshName();
	}

	private refreshName(): void {
		let model = this.getModel();
		let name = model.getName();
		let view = this.getView();
		view.setName(name);
	}

	public getName(): string {
		let model = this.getModel();
		let name = model.getName();
		return name;
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (eventType === Notification.SET) {
			if (feature === PointerField.FEATURE_NAME) {
				this.refreshName();
			}
		}
	}
}

class PointerFieldActionListHandler extends BaseHandler {

	public handle(_request: PointerFieldActionListRequest, callback: (actions: any) => void): void {
		let director = directors.getVariableFieldDirector(this.controller);
		let model = <PointerField>this.controller.getModel();
		director.getPointerFieldActionList(model, callback);
	}

}
