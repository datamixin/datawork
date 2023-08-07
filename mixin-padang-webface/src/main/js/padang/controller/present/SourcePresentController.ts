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
import EObjectController from "webface/wef/base/EObjectController";

import XSheet from "padang/model/XSheet";
import XSource from "padang/model/XSource";
import XDataset from "padang/model/XDataset";

import * as directors from "padang/directors";

import SourcePresentView from "padang/view/present/SourcePresentView";

import SourceFigureAddRequest from "padang/requests/present/SourceFigureAddRequest";
import SourceBuilderAddRequest from "padang/requests/present/SourceBuilderAddRequest";

export abstract class SourcePresentController extends EObjectController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(SourceFigureAddRequest.REQUEST_NAME, new SourceFigureAddHandler(this));
		super.installRequestHandler(SourceBuilderAddRequest.REQUEST_NAME, new SourceBuilderAddHandler(this));
	}

	public getModel(): XSource {
		return <XSource>super.getModel();
	}

	public getView(): SourcePresentView {
		return <SourcePresentView>super.getView();
	}

}

export default SourcePresentController;

abstract class SourceAddHandler extends BaseHandler {

	public getDataset(): string {
		let source = <XSource>this.controller.getModel();
		let dataset = <XDataset>source.eContainer();
		let sheet = <XSheet>dataset.eContainer();
		return sheet.getName();
	}

}

class SourceFigureAddHandler extends SourceAddHandler {

	public handle(request: SourceFigureAddRequest): void {
		let renderer = request.getStringData(SourceFigureAddRequest.RENDERER);
		let dataset = this.getDataset();
		let director = directors.getGraphicPresentDirector(this.controller);
		director.addGraphicCompose(this.controller, renderer, dataset);
	}

}

class SourceBuilderAddHandler extends SourceAddHandler {

	public handle(request: SourceBuilderAddRequest): void {
		let structure = request.getStringData(SourceBuilderAddRequest.STRUCTURE);
		let dataset = this.getDataset();
		let director = directors.getBuilderPresentDirector(this.controller);
		director.addBuilderCompose(this.controller, structure, dataset);
	}

}
