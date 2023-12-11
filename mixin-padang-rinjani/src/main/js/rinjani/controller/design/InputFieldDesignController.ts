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

import ObjectMap from "webface/util/ObjectMap";

import BaseHandler from "webface/wef/base/BaseHandler";
import RemoveCommand from "webface/wef/base/RemoveCommand";
import EObjectController from "webface/wef/base/EObjectController";
import RootViewerAreaRequestHandler from "webface/wef/base/RootViewerAreaRequestHandler";

import * as padang from "padang/padang";

import * as directors from "rinjani/directors";

import XInputField from "rinjani/model/XInputField";

import InputFieldDesignView from "rinjani/view/design/InputFieldDesignView";

import InputFieldRemoveRequest from "rinjani/requests/design/InputFieldRemoveRequest";
import InputFieldDragAreaRequest from "rinjani/requests/design/InputFieldDragAreaRequest";
import InputFieldDragSourceDragRequest from "rinjani/requests/design/InputFieldDragSourceDragRequest";
import InputFieldDragSourceStopRequest from "rinjani/requests/design/InputFieldDragSourceStopRequest";
import InputFieldDragSourceStartRequest from "rinjani/requests/design/InputFieldDragSourceStartRequest";

import InputFieldSelectionRequest from "rinjani/requests/design/InputFieldSelectionRequest";

export default class InputFieldDesignController extends EObjectController {

	constructor() {
		super();
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(InputFieldRemoveRequest.REQUEST_NAME, new InputFieldRemoveHandler(this));
		super.installRequestHandler(InputFieldSelectionRequest.REQUEST_NAME, new InputFieldSelectionHandler(this));

		super.installRequestHandler(InputFieldDragAreaRequest.REQUEST_NAME, new RootViewerAreaRequestHandler(this));
		super.installRequestHandler(InputFieldDragSourceDragRequest.REQUEST_NAME, new InputFieldDragSourceDragHandler(this));
		super.installRequestHandler(InputFieldDragSourceStopRequest.REQUEST_NAME, new InputFieldDragSourceStopHandler(this));
		super.installRequestHandler(InputFieldDragSourceStartRequest.REQUEST_NAME, new InputFieldDragSourceStartHandler(this));
	}

	public createView(): InputFieldDesignView {
		return new InputFieldDesignView(this);
	}

	public getView(): InputFieldDesignView {
		return <InputFieldDesignView>super.getView();
	}

	public getModel(): XInputField {
		return <XInputField>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshType();
		this.refreshValue();
	}

	private refreshType(): void {
		let model = this.getModel();
		let value = model.getValue();
		let director = directors.getOutputPartDirector(this);
		director.getResultBriefType(value, (type: string) => {
			let view = this.getView();
			view.setResultType(type);
			let key = InputFieldDragSourceStartRequest.REQUEST_NAME;
			let handler = <InputFieldDragSourceStartHandler>this.getRequestHandler(key);
			handler.setType(type);
		});
	}

	private refreshValue(): void {
		let model = this.getModel();
		let value = model.getValue();
		let view = this.getView();
		view.setValue(value);
	}

}

class InputFieldSelectionHandler extends BaseHandler {

	public handle(): void {
		let director = wef.getSelectionDirector(this.controller);
		director.select(this.controller);
	}

}

class InputFieldRemoveHandler extends BaseHandler {

	public handle(): void {

		let controller = <InputFieldDesignController>this.controller;
		let model = controller.getModel();
		let command = new RemoveCommand();
		command.setModel(model);
		this.controller.execute(command);
	}

}

class InputFieldDragSourceStartHandler extends BaseHandler {

	private type: string = null;

	public handle(_request: InputFieldDragSourceStartRequest, callback?: (data: any) => void): void {

		let controller = <InputFieldDesignController>this.controller;
		let data = new ObjectMap<any>();

		let field = controller.getModel();
		let formula = field.getValue();
		data.put(padang.FIELD_FORMULA, formula);
		data.put(padang.FIELD_TYPE, this.type);
		data.put(padang.DRAG_SOURCE, field);

		let director = directors.getInputFieldDragDirector(this.controller);
		director.start(data);

		callback(data);

	}

	public setType(type: string): void {
		this.type = type;
	}

}

class InputFieldDragSourceDragHandler extends BaseHandler {

	public handle(request: InputFieldDragSourceDragRequest, callback: (data: any) => void): void {
		let data = <ObjectMap<any>>request.getData(InputFieldDragSourceDragRequest.DATA);
		let x = <number>request.getData(InputFieldDragSourceDragRequest.X);
		let y = <number>request.getData(InputFieldDragSourceDragRequest.Y);
		let director = directors.getInputFieldDragDirector(this.controller);
		director.drag(data, x, y);
		callback(data);
	}

}

class InputFieldDragSourceStopHandler extends BaseHandler {

	private director: directors.InputFieldDragDirector = null;

	constructor(controller: InputFieldDesignController) {
		super(controller);
		this.director = directors.getInputFieldDragDirector(this.controller);
	}

	public handle(): void {
		this.director.stop();
	}

}