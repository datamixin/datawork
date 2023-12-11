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

import XTopLevelFacetSpec from "vegazoo/model/XTopLevelFacetSpec";

import TopLevelFacetSpecDesignView from "vegazoo/view/design/TopLevelFacetSpecDesignView";

import TopLevelFacetSpecSelectionRequest from "vegazoo/requests/design/TopLevelFacetSpecSelectionRequest";

import TopLevelSpecDesignController from "vegazoo/controller/design/TopLevelSpecDesignController";

export default class TopLevelFacetSpecDesignController extends TopLevelSpecDesignController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(TopLevelFacetSpecSelectionRequest.REQUEST_NAME, new TopLevelFacetSpecSelectionHandler(this));
	}

	public createView(): TopLevelFacetSpecDesignView {
		return new TopLevelFacetSpecDesignView(this);
	}

	public getView(): TopLevelFacetSpecDesignView {
		return <TopLevelFacetSpecDesignView>super.getView();
	}

	public getModel(): XTopLevelFacetSpec {
		return <XTopLevelFacetSpec>super.getModel();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let facet = model.getFacet();
		let spec = model.getSpec();
		return [facet, spec];
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
		if (feature === XTopLevelFacetSpec.FEATURE_FACET
			|| feature === XTopLevelFacetSpec.FEATURE_SPEC) {
			if (eventType === Notification.SET) {
				this.refreshChildren();
			}
		}
	}

}

class TopLevelFacetSpecSelectionHandler extends BaseHandler {

	public handle(request: TopLevelFacetSpecSelectionRequest, callback: (data: any) => void): void {
		let director = wef.getSelectionDirector(this.controller);
		director.select(this.controller);
	}

}

