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
import Point from "webface/graphics/Point";

import Notification from "webface/model/Notification";

import BaseHandler from "webface/wef/base/BaseHandler";
import EObjectController from "webface/wef/base/EObjectController";

import * as bekasi from "bekasi/directors";

import * as directors from "malang/directors";

import PreloadPanel from "malang/panels/PreloadPanel";

import PreloadContent from "malang/model/PreloadContent";

import PreloadContentExposeView from "malang/view/expose/PreloadContentExposeView";

import PreloadContentEnrollRequest from "malang/requests/expose/PreloadContentEnrollRequest";

export default class PreloadContentExposeController extends EObjectController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(PreloadContentEnrollRequest.REQUEST_NAME, new PreloadContentEnrollHandler(this));
	}

	public createView(): PreloadContentExposeView {
		return new PreloadContentExposeView(this);
	}

	public getView(): PreloadContentExposeView {
		return <PreloadContentExposeView>super.getView();
	}

	public getModel(): PreloadContent {
		return <PreloadContent>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshResult();
	}

	private refreshResult(): void {
		setTimeout(() => {
			let model = this.getModel();
			let name = model.getName();
			if (name !== null) {
				let size = new Point(320, 240);
				let director = directors.getExposePartDirector(this);
				director.loadPreloadResult(name, size, (result: PreloadPanel) => {
					let preload = director.getPreload(name);
					let presume = preload.getPresume();
					let view = this.getView();
					view.setName(name);
					view.setIcon(presume)
					view.setResult(result);
					this.relayout();
				});
			}
		}, 0);
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (eventType === Notification.SET) {
			if (feature === PreloadContent.FEATURE_NAME) {
				this.refreshResult();
			}
		}
	}

}

class PreloadContentEnrollHandler extends BaseHandler {

	public handle(_request: PreloadContentEnrollRequest, _callback: (data: any) => void): void {
		let controller = <PreloadContentExposeController>this.controller;
		let model = controller.getModel();
		let name = model.getName();
		let director = directors.getOutputPartDirector(controller);
		director.enrollPreload(name);
	}

}
