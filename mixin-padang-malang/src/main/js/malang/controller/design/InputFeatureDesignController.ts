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
import * as wef from "webface/wef";

import ObjectMap from "webface/util/ObjectMap";

import CommandGroup from "webface/wef/CommandGroup";

import BaseHandler from "webface/wef/base/BaseHandler";
import RemoveCommand from "webface/wef/base/RemoveCommand";
import EObjectController from "webface/wef/base/EObjectController";
import RootViewerAreaRequestHandler from "webface/wef/base/RootViewerAreaRequestHandler";

import * as padang from "padang/padang";

import * as directors from "malang/directors";
import FeatureFormulaParser from "malang/directors/FeatureFormulaParser";

import XInputFeature from "malang/model/XInputFeature";

import InputFeatureDesignView from "malang/view/design/InputFeatureDesignView";

import InputFeatureRemoveRequest from "malang/requests/design/InputFeatureRemoveRequest";
import InputFeatureDragAreaRequest from "malang/requests/design/InputFeatureDragAreaRequest";
import InputFeatureDragSourceDragRequest from "malang/requests/design/InputFeatureDragSourceDragRequest";
import InputFeatureDragSourceStopRequest from "malang/requests/design/InputFeatureDragSourceStopRequest";
import InputFeatureDragSourceStartRequest from "malang/requests/design/InputFeatureDragSourceStartRequest";

import InputFeatureSelectionRequest from "malang/requests/design/InputFeatureSelectionRequest";

export default class InputFeatureDesignController extends EObjectController {

	constructor() {
		super();
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(InputFeatureRemoveRequest.REQUEST_NAME, new InputFeatureRemoveHandler(this));
		super.installRequestHandler(InputFeatureSelectionRequest.REQUEST_NAME, new InputFeatureSelectionHandler(this));

		super.installRequestHandler(InputFeatureDragAreaRequest.REQUEST_NAME, new RootViewerAreaRequestHandler(this));
		super.installRequestHandler(InputFeatureDragSourceDragRequest.REQUEST_NAME, new InputFeatureDragSourceDragHandler(this));
		super.installRequestHandler(InputFeatureDragSourceStopRequest.REQUEST_NAME, new InputFeatureDragSourceStopHandler(this));
		super.installRequestHandler(InputFeatureDragSourceStartRequest.REQUEST_NAME, new InputFeatureDragSourceStartHandler(this));
	}

	public createView(): InputFeatureDesignView {
		return new InputFeatureDesignView(this);
	}

	public getView(): InputFeatureDesignView {
		return <InputFeatureDesignView>super.getView();
	}

	public getModel(): XInputFeature {
		return <XInputFeature>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshType();
		this.refreshValue();
	}

	private refreshType(): void {
		let model = this.getModel();
		let value = model.getValue();
		let director = directors.getDesignPartDirector(this);
		director.getBuilderResultBriefType(value, (type: string) => {
			let view = this.getView();
			view.setResultType(type);
			let key = InputFeatureDragSourceStartRequest.REQUEST_NAME;
			let handler = <InputFeatureDragSourceStartHandler>this.getRequestHandler(key);
			handler.setType(type);
		});
	}

	private refreshValue(): void {
		let model = this.getModel();
		let value = model.getValue();
		let view = this.getView();
		let parser = new FeatureFormulaParser();
		let name = parser.getColumnName(value);
		view.setValue(value, name);
	}

}

class InputFeatureSelectionHandler extends BaseHandler {

	public handle(): void {
		let director = wef.getSelectionDirector(this.controller);
		director.select(this.controller);
	}

}

class InputFeatureRemoveHandler extends BaseHandler {

	public handle(): void {

		let controller = <InputFeatureDesignController>this.controller;
		let model = controller.getModel();
		let formula = model.getValue();

		let group = new CommandGroup();
		let director = directors.getDesignPartDirector(this.controller);
		let modifier = director.createRecipeModifier();

		let removeCommand = new RemoveCommand();
		removeCommand.setModel(model);
		group.add(removeCommand);

		modifier.removeFeature(formula);
		modifier.addCommand(group);

		this.controller.execute(group);
	}

}

class InputFeatureDragSourceStartHandler extends BaseHandler {

	private type: string = null;

	public handle(_request: InputFeatureDragSourceStartRequest, callback?: (data: any) => void): void {

		let controller = <InputFeatureDesignController>this.controller;
		let data = new ObjectMap<any>();

		let field = controller.getModel();
		let formula = field.getValue();
		data.put(padang.FIELD_FORMULA, formula);
		data.put(padang.FIELD_TYPE, this.type);
		data.put(padang.DRAG_SOURCE, field);

		let director = directors.getInputFeatureDragDirector(this.controller);
		director.start(data);

		callback(data);

	}

	public setType(type: string): void {
		this.type = type;
	}

}

class InputFeatureDragSourceDragHandler extends BaseHandler {

	public handle(request: InputFeatureDragSourceDragRequest, callback: (data: any) => void): void {
		let data = <ObjectMap<any>>request.getData(InputFeatureDragSourceDragRequest.DATA);
		let x = <number>request.getData(InputFeatureDragSourceDragRequest.X);
		let y = <number>request.getData(InputFeatureDragSourceDragRequest.Y);
		let director = directors.getInputFeatureDragDirector(this.controller);
		director.drag(data, x, y);
		callback(data);
	}

}

class InputFeatureDragSourceStopHandler extends BaseHandler {

	private director: directors.InputFeatureDragDirector = null;

	constructor(controller: InputFeatureDesignController) {
		super(controller);
		this.director = directors.getInputFeatureDragDirector(this.controller);
	}

	public handle(): void {
		this.director.stop();
	}

}