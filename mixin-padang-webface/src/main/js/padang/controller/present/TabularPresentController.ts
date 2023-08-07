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
import BaseHandler from "webface/wef/base/BaseHandler";

import XSheet from "padang/model/XSheet";
import XDataset from "padang/model/XDataset";
import XTabular from "padang/model/XTabular";

import QuerySource from "padang/query/QuerySource";
import DatasetQuery from "padang/query/DatasetQuery";

import TabularActuator from "padang/controller/TabularActuator";

import TabularPresentView from "padang/view/present/TabularPresentView";

import TabularRowSelectRequest from "padang/requests/TabularRowSelectRequest";
import TabularCellSelectRequest from "padang/requests/TabularCellSelectRequest";
import TabularColumnSelectRequest from "padang/requests/TabularColumnSelectRequest";
import TabularTopOriginChangeRequest from "padang/requests/TabularTopOriginChangeRequest";
import TabularLeftOriginChangeRequest from "padang/requests/TabularLeftOriginChangeRequest";

import TabularColumnProfileRequest from "padang/requests/TabularColumnProfileRequest";
import TabularColumnWidthSetRequest from "padang/requests/TabularColumnWidthSetRequest";
import TabularColumnWidthGetRequest from "padang/requests/TabularColumnWidthGetRequest";
import TabularColumnFormatGetRequest from "padang/requests/TabularColumnFormatGetRequest";
import TabularColumnInspectResetRequest from "padang/requests/TabularColumnInspectResetRequest";
import TabularColumnInspectApplyRequest from "padang/requests/TabularColumnInspectApplyRequest";

import TabularFocusStateRefreshRequest from "padang/requests/present/TabularFocusStateRefreshRequest";

import TabularPropertyHandler from "padang/handlers/TabularPropertyHandler";
import TabularRowSelectHandler from "padang/handlers/TabularRowSelectHandler";
import TabularCellSelectHandler from "padang/handlers/TabularCellSelectHandler";
import TabularColumnSelectHandler from "padang/handlers/TabularColumnSelectHandler";
import TabularTopOriginChangeHandler from "padang/handlers/TabularTopOriginChangeHandler";
import TabularLeftOriginChangeHandler from "padang/handlers/TabularLeftOriginChangeHandler";
import TabularColumnFrequencySortHandler from "padang/handlers/TabularColumnFrequencySortHandler";

import TabularColumnProfileHandler from "padang/handlers/TabularColumnProfileHandler";
import TabularColumnWidthSetHandler from "padang/handlers/TabularColumnWidthSetHandler";
import TabularColumnWidthGetHandler from "padang/handlers/TabularColumnWidthGetHandler";
import TabularColumnFormatGetHandler from "padang/handlers/TabularColumnFormatGetHandler";
import TabularColumnInspectApplyHandler from "padang/handlers/TabularColumnInspectApplyHandler";
import TabularColumnInspectResetHandler from "padang/handlers/TabularColumnInspectResetHandler";
import TabularColumnFrequencySortRequest from "padang/requests/TabularColumnFrequencySortRequest";

import DisplayPresentController from "padang/controller/present/DisplayPresentController";

export default class TabularPresentController extends DisplayPresentController implements QuerySource {

	public static TOP_ORIGIN = "topOrigin";
	public static LEFT_ORIGIN = "leftOrigin";

	private actuator = new TabularActuator(this);

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		
		super.installRequestHandler(TabularRowSelectRequest.REQUEST_NAME, new TabularRowSelectHandler(this));
		super.installRequestHandler(TabularCellSelectRequest.REQUEST_NAME, new TabularCellSelectHandler(this));
		super.installRequestHandler(TabularColumnSelectRequest.REQUEST_NAME, new TabularColumnSelectHandler(this));
		super.installRequestHandler(TabularTopOriginChangeRequest.REQUEST_NAME, new TabularTopOriginChangeHandler(this));
		super.installRequestHandler(TabularLeftOriginChangeRequest.REQUEST_NAME, new TabularLeftOriginChangeHandler(this));
		super.installRequestHandler(TabularFocusStateRefreshRequest.REQUEST_NAME, new TabularFocusStateRefreshHandler(this));

		super.installRequestHandler(TabularColumnProfileRequest.REQUEST_NAME, new TabularColumnProfileHandler(this));
		super.installRequestHandler(TabularColumnWidthSetRequest.REQUEST_NAME, new TabularColumnWidthSetHandler(this));
		super.installRequestHandler(TabularColumnWidthGetRequest.REQUEST_NAME, new TabularColumnWidthGetHandler(this));
		super.installRequestHandler(TabularColumnFormatGetRequest.REQUEST_NAME, new TabularColumnFormatGetHandler(this));
		super.installRequestHandler(TabularColumnInspectApplyRequest.REQUEST_NAME, new TabularColumnInspectApplyHandler(this));
		super.installRequestHandler(TabularColumnInspectResetRequest.REQUEST_NAME, new TabularColumnInspectResetHandler(this));
		super.installRequestHandler(TabularColumnFrequencySortRequest.REQUEST_NAME, new TabularColumnFrequencySortHandler(this));
	}

	public createView(): TabularPresentView {
		return new TabularPresentView(this);
	}

	public getModel(): XTabular {
		return <XTabular>super.getModel();
	}

	public getView(): TabularPresentView {
		return <TabularPresentView>super.getView();
	}

	public applyFrom(query: DatasetQuery): void {
		let model = this.getModel();
		let dataset = <XDataset>model.eContainer();
		let sheet = <XSheet>dataset.eContainer();
		let name = sheet.getName();
		query.fromDataset(name);
	}

	public getInspectModel(): XDataset {
		let parent = this.getParent();
		return <XDataset>parent.getModel();
	}

	protected refreshInspection(): void {
		let view = this.getView();
		view.refreshInspection();
		view.refreshRows();
	}

	public refreshProperties(): void {
		this.actuator.refreshProperties();
	}

	public refreshFocusState(): void {
		this.refreshProperty([TabularPropertyHandler.SELECTED_PART]);
	}

	protected refreshProperty(keys: string[]): void {
		this.actuator.refreshProperty(keys);
	}

}

class TabularFocusStateRefreshHandler extends BaseHandler {

	public handle(_request: TabularFocusStateRefreshRequest): void {
		let controller = <TabularPresentController>this.controller;
		controller.refreshFocusState();
	}
}
