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

import * as directors from "padang/directors";

import XDataset from "padang/model/XDataset";
import XPreparation from "padang/model/XPreparation";

import PreparationPresentView from "padang/view/present/PreparationPresentView";

import SourcePresentController from "padang/controller/present/SourcePresentController";

import PreparationCreateNewRequest from "padang/requests/present/PreparationCreateNewRequest";
import PreparationComposerOpenRequest from "padang/requests/present/PreparationComposerOpenRequest";

export default class PreparationPresentController extends SourcePresentController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(PreparationCreateNewRequest.REQUEST_NAME, new PreparationCreateNewHandler(this));
		super.installRequestHandler(PreparationComposerOpenRequest.REQUEST_NAME, new PreparationFullDeckComposerOpenHandler(this));
	}

	public createView(): PreparationPresentView {
		return new PreparationPresentView(this);
	}

	public getModel(): XPreparation {
		return <XPreparation>super.getModel();
	}

	public getView(): PreparationPresentView {
		return <PreparationPresentView>super.getView();
	}

}

class PreparationCreateNewHandler extends BaseHandler {

	public handle(_request: PreparationCreateNewRequest, _callback: (data: any) => void): void {
		let ingestion = <XPreparation>this.controller.getModel();
		let dataset = <XDataset>ingestion.eContainer();
		let director = directors.getDatasetPresentDirector(this.controller);
		director.addPreparation(this.controller, dataset);
	}

}

class PreparationFullDeckComposerOpenHandler extends BaseHandler {

	public handle(_request: PreparationComposerOpenRequest, _callback: (data: any) => void): void {
		let preparation = <XPreparation>this.controller.getModel();
		let director = directors.getDatasetPresentDirector(this.controller);
		director.openPreparationComposer(this.controller, false, preparation);
	}

}
