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
import EList from "webface/model/EList";
import * as util from "webface/model/util";

import BaseHandler from "webface/wef/base/BaseHandler";
import ListRepopulateCommand from "webface/wef/base/ListRepopulateCommand";

import * as bekasi from "bekasi/directors";

import BaseContentLayoutParticipant from "bekasi/directors/BaseContentLayoutParticipant";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import XInput from "padang/model/XInput";
import XSheet from "padang/model/XSheet";
import XDataset from "padang/model/XDataset";
import XTabular from "padang/model/XTabular";
import XPreparation from "padang/model/XPreparation";

import ControllerProperties from "padang/util/ControllerProperties";

import TabularToolsetView from "padang/view/toolset/TabularToolsetView";

import FormulaFormatRequest from "padang/requests/FormulaFormatRequest";
import FormulaValidationRequest from "padang/requests/FormulaValidationRequest";

import TabularPropertyHandler from "padang/handlers/TabularPropertyHandler";
import FormulaFormatHandler from "padang/handlers/FormulaFormatHandler";
import FormulaValidationHandler from "padang/handlers/FormulaValidationHandler";

import DisplayToolsetController from "padang/controller/toolset/DisplayToolsetController";

import TabularColumnFormatGetRequest from "padang/requests/TabularColumnFormatGetRequest";

import TabularColumnFormatGetHandler from "padang/handlers/TabularColumnFormatGetHandler";

import TabularExportResultRequest from "padang/requests/toolset/TabularExportResultRequest";
import TabularRefreshResultRequest from "padang/requests/toolset/TabularRefreshResultRequest";
import InputListComposerOpenRequest from "padang/requests/toolset/InputListComposerOpenRequest";
import TabularColumnFormatSetRequest from "padang/requests/toolset/TabularColumnFormatSetRequest";
import TabularGenerateFormulaRequest from "padang/requests/toolset/TabularGenerateFormulaRequest";
import TabularExportFormatListRequest from "padang/requests/toolset/TabularExportFormatListRequest";

import InputListComposerOpenHandler from "padang/handlers/toolset/InputListComposerOpenHandler";

export default class TabularToolsetController extends DisplayToolsetController {

	constructor() {
		super();
		this.addParticipant(bekasi.CONTENT_LAYOUT_PARTICIPANT, new BaseContentLayoutParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(FormulaFormatRequest.REQUEST_NAME, new FormulaFormatHandler(this));
		super.installRequestHandler(FormulaValidationRequest.REQUEST_NAME, new FormulaValidationHandler(this));

		super.installRequestHandler(TabularExportResultRequest.REQUEST_NAME, new TabularExportResultHandler(this));
		super.installRequestHandler(TabularRefreshResultRequest.REQUEST_NAME, new TabularRefreshResultHandler(this));
		super.installRequestHandler(TabularGenerateFormulaRequest.REQUEST_NAME, new TabularGenerateFormulaHandler(this));
		super.installRequestHandler(TabularColumnFormatGetRequest.REQUEST_NAME, new TabularColumnFormatGetHandler(this));
		super.installRequestHandler(TabularColumnFormatSetRequest.REQUEST_NAME, new TabularColumnFormatSetHandler(this));
		super.installRequestHandler(TabularExportFormatListRequest.REQUEST_NAME, new TabularExportFormatListHandler(this));
		super.installRequestHandler(InputListComposerOpenRequest.REQUEST_NAME, new TabularInputListComposerOpenHandler(this));
	}

	public createView(): TabularToolsetView {
		let model = this.getModel();
		let container = model.eContainer();
		return new TabularToolsetView(this, container instanceof XDataset);
	}

	public getModel(): XTabular {
		return <XTabular>super.getModel();
	}

	public getView(): TabularToolsetView {
		return <TabularToolsetView>super.getView();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshFormatNumber();
	}

	private refreshFormatNumber(): void {
		this.refreshProperty(TabularPropertyHandler.SELECTED_PART);
	}

	protected refreshProperty(key: string): void {
		let view = this.getView();
		if (key === TabularPropertyHandler.SELECTED_PART) {
			let properties = super.getProperties();
			let part = properties.getProperty(key, null);
			let label = properties.getProperty(TabularPropertyHandler.SELECTED_COLUMN_LABEL, null);
			if (part === TabularPropertyHandler.SELECTED_PART_CELL) {
				view.setSelectedColumn(label);
			} else if (part === TabularPropertyHandler.SELECTED_PART_COLUMN) {
				view.setSelectedColumn(label);
			} else {
				view.setSelectedColumn(null);
			}
		}
	}

}

class TabularColumnFormatSetHandler extends BaseHandler {

	public handle(request: TabularColumnFormatSetRequest): void {
		let name = <string>request.getData(TabularColumnFormatSetRequest.NAME);
		let format = <string>request.getData(TabularColumnFormatSetRequest.FORMAT);
		let properties = new ControllerProperties(this.controller, XTabular.FEATURE_PROPERTIES);
		properties.executePutCommand([padang.COLUMN, name, padang.FORMAT], format);
	}

}

class TabularExportFormatListHandler extends BaseHandler {

	public handle(_request: TabularExportFormatListRequest, callback: (extensions: { [name: string]: string }) => void): void {
		let model = <XTabular>this.controller.getModel();
		let container = model.eContainer();
		let director = directors.getProjectComposerDirector(this.controller);
		director.inspectFormats(container, padang.INSPECT_EXPORT_FORMAT_LIST, (extensions: { [name: string]: string }) => {
			callback(extensions);
		});
	}

}

class TabularExportResultHandler extends BaseHandler {

	public handle(request: TabularExportResultRequest): void {
		let model = <XTabular>this.controller.getModel();
		let container = model.eContainer();
		let sheet = <XSheet>util.getAncestor(container, XSheet);
		let name = sheet.getName()
		let format = <string>request.getData(TabularExportResultRequest.FORMAT);
		let director = directors.getProjectComposerDirector(this.controller);
		let filename = name + "." + format;
		director.inspectDownload(container, padang.INSPECT_EXPORT_RESULT, format, filename, () => {

		});
	}

}

class TabularRefreshResultHandler extends BaseHandler {

	public handle(_request: TabularRefreshResultRequest): void {
		let model = <XTabular>this.controller.getModel();
		let container = model.eContainer();
		if (container instanceof XDataset) {
			let director = directors.getDatasetPresentDirector(this.controller);
			director.computeResult(container);
		} else if (container instanceof XPreparation) {
			let director = directors.getPreparationMutationDirector(this.controller);
			director.computeResult(container);
		}
	}

}

class TabularInputListComposerOpenHandler extends InputListComposerOpenHandler {

	private getDataset(): XDataset {
		let model = <XTabular>this.controller.getModel();
		return <XDataset>util.getAncestor(model, XDataset);
	}

	protected getList(): EList<XInput> {
		let dataset = this.getDataset();
		let copy = <XDataset>util.copy(dataset);
		return copy.getInputs();
	}

	protected applyList(list: EList<XInput>): void {
		let dataset = this.getDataset();
		let inputs = dataset.getInputs();
		let command = new ListRepopulateCommand();
		command.setList(inputs);
		command.setElements(list.toArray());
		this.controller.execute(command);
	}

}

class TabularGenerateFormulaHandler extends BaseHandler {

	public handle(_request: TabularGenerateFormulaRequest, callback: (literal: string) => void): void {
		let tabular = <XTabular>this.controller.getModel();
		let dataset = <XDataset>tabular.eContainer();
		let preparation = <XPreparation>dataset.getSource();
		let director = directors.getDatasetPresentDirector(this.controller);
		let formula = director.generateFormula(preparation);
		callback(formula);
	}

}
