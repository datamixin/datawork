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
import * as webface from "webface/webface";

import Point from "webface/graphics/Point";

import Notification from "webface/model/Notification";

import BaseHandler from "webface/wef/base/BaseHandler";
import EObjectController from "webface/wef/base/EObjectController";

import ConductorPanel from "webface/wef/ConductorPanel";

import * as bekasi from "bekasi/directors";

import XResult from "rinjani/model/XResult";
import XRoutine from "rinjani/model/XRoutine";

import * as directors from "rinjani/directors";

import RinjaniPartViewer from "rinjani/ui/RinjaniPartViewer";

import ResultOutputView from "rinjani/view/output/ResultOutputView";

import ResultWidthSetCommand from "rinjani/commands/ResultWidthSetCommand";
import ResultHeightSetCommand from "rinjani/commands/ResultHeightSetCommand";

import ResultResizeRequest from "rinjani/requests/output/ResultResizeRequest";

export default class ResultOutputController extends EObjectController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();

		super.installRequestHandler(ResultResizeRequest.REQUEST_NAME, new ResultResizeHandler(this));
	}

	public createView(): ResultOutputView {
		let viewer = this.getViewer();
		let parent = viewer.getParent();
		let editable = parent instanceof RinjaniPartViewer;
		return new ResultOutputView(this, editable);
	}

	public getView(): ResultOutputView {
		return <ResultOutputView>super.getView();
	}

	public getModel(): XResult {
		return <XResult>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshResult();
	}

	public refreshResult(): void {
		let model = this.getModel();
		let width = model.getWidth();
		let height = model.getHeight();
		let routine = <XRoutine>model.eContainer();
		let size = new Point(width, height);
		let director = directors.getOutputPartDirector(this);
		director.createResult(routine, size, (panel: ConductorPanel) => {
			if (this.isActive() === true) {
				let view = this.getView();
				view.setResult(panel);
				this.relayout();
			}
		});
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public notifyChanged(notification: Notification): void {
		let feature = notification.getFeature();
		if (feature === XResult.FEATURE_WIDTH || feature === XResult.FEATURE_HEIGHT) {
			this.refreshResult();
		}
	}

}

class ResultResizeHandler extends BaseHandler {

	public handle(request: ResultResizeRequest, _callback: (data: any) => void): void {

		let controller = <ResultOutputController>this.controller;
		let size = <number>request.getData(ResultResizeRequest.SIZE);
		let orientation = <string>request.getData(ResultResizeRequest.ORIENTATION);
		let model = controller.getModel();
		if (orientation === webface.HORIZONTAL) {

			let command = new ResultWidthSetCommand();
			command.setResult(model);
			command.setWidth(size);
			controller.execute(command);

		} else {

			let command = new ResultHeightSetCommand();
			command.setResult(model);
			command.setHeight(size);
			controller.execute(command);

		}
	}

}