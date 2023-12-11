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
import * as wef from "webface/wef";

import Notification from "webface/model/Notification";

import BaseHandler from "webface/wef/base/BaseHandler";

import XTopLevelUnitSpec from "vegazoo/model/XTopLevelUnitSpec";

import TopLevelUnitSpecDesignView from "vegazoo/view/design/TopLevelUnitSpecDesignView";

import TopLevelUnitSpecSelectionRequest from "vegazoo/requests/design/TopLevelUnitSpecSelectionRequest";

import TopLevelSpecDesignController from "vegazoo/controller/design/TopLevelSpecDesignController";

export default class TopLevelUnitSpecDesignController extends TopLevelSpecDesignController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(TopLevelUnitSpecSelectionRequest.REQUEST_NAME, new TopLevelUnitSpecSelectionHandler(this));
	}

	public createView(): TopLevelUnitSpecDesignView {
		return new TopLevelUnitSpecDesignView(this);
	}

	public getView(): TopLevelUnitSpecDesignView {
		return <TopLevelUnitSpecDesignView>super.getView();
	}

	public getModel(): XTopLevelUnitSpec {
		return <XTopLevelUnitSpec>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let mark = model.getMark();
		let encoding = model.getEncoding();
		return [mark, encoding];
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
	}

	public refreshChildren(): void {
		super.refreshChildren();
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (feature === XTopLevelUnitSpec.FEATURE_ENCODING) {
			if (eventType === Notification.SET) {
				this.refreshChildren();
			}
		}
	}

}

class TopLevelUnitSpecSelectionHandler extends BaseHandler {

	public handle(request: TopLevelUnitSpecSelectionRequest, callback: (data: any) => void): void {
		let director = wef.getSelectionDirector(this.controller);
		director.select(this.controller);
	}

}

