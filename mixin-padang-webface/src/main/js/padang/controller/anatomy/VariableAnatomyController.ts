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

import EObjectController from "webface/wef/base/EObjectController";

import * as bekasi from "bekasi/directors";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import XVariable from "padang/model/XVariable";

import VariableAnatomyView from "padang/view/anatomy/VariableAnatomyView";

import VariableNameSetRequest from "padang/requests/VariableNameSetRequest";
import VariableNameListRequest from "padang/requests/VariableNameListRequest";

import VariableNameSetHandler from "padang/handlers/VariableNameSetHandler";
import VariableNameListHandler from "padang/handlers/VariableNameListHandler";

export default class VariableAnatomyController extends EObjectController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(VariableNameSetRequest.REQUEST_NAME, new VariableNameSetHandler(this));
		super.installRequestHandler(VariableNameListRequest.REQUEST_NAME, new VariableNameListHandler(this));
	}

	public createView(): VariableAnatomyView {
		return new VariableAnatomyView(this);
	}

	public getModel(): XVariable {
		return <XVariable>super.getModel();
	}

	public getView(): VariableAnatomyView {
		return <VariableAnatomyView>super.getView();
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

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public refreshCompute(callback: () => void): void {
		let model = this.getModel();
		let director = directors.getProjectComposerDirector(this);
		director.inspectValue(model, padang.INSPECT_COMPUTE, [], () => {
			callback();
		});
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (eventType === Notification.SET) {
			if (feature === XVariable.FEATURE_FORMULA) {
				this.refresh();
				this.relayout();
			}
		}
	}

}
