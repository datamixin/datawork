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

import * as util from "webface/model/util";
import Notification from "webface/model/Notification";

import ObjectMap from "webface/util/ObjectMap";

import BaseHandler from "webface/wef/base/BaseHandler";
import ListAddCommand from "webface/wef/base/ListAddCommand";
import BaseRemoveHandler from "webface/wef/base/BaseRemoveHandler";
import EObjectController from "webface/wef/base/EObjectController";
import PartViewerAreaRequestHandler from "webface/wef/base/PartViewerAreaRequestHandler";

import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

import VisageObject from "bekasi/visage/VisageObject";

import XSheet from "padang/model/XSheet";
import XProject from "padang/model/XProject";
import PadangInspector from "padang/model/PadangInspector";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import SheetOutlineView from "padang/view/outline/SheetOutlineView";

import SheetNameSetCommand from "padang/commands/SheetNameSetCommand";

import SheetSelectRequest from "padang/requests/outline/SheetSelectRequest";
import SheetRemoveRequest from "padang/requests/outline/SheetRemoveRequest";
import SheetNameSetRequest from "padang/requests/outline/SheetNameSetRequest";
import SheetNameListRequest from "padang/requests/outline/SheetNameListRequest";
import SheetDuplicateRequest from "padang/requests/outline/SheetDuplicateRequest";
import SheetPointedCountRequest from "padang/requests/outline/SheetPointedCountRequest";
import SheetNameValidationRequest from "padang/requests/outline/SheetNameValidationRequest";

import SheetDragAreaRequest from "padang/requests/outline/SheetDragAreaRequest";
import SheetDragSourceDragRequest from "padang/requests/outline/SheetDragSourceDragRequest";
import SheetDragSourceStopRequest from "padang/requests/outline/SheetDragSourceStopRequest";
import SheetDragSourceStartRequest from "padang/requests/outline/SheetDragSourceStartRequest";

import ProjectSelectionSetCommand from "padang/commands/ProjectSelectionSetCommand";

export default class SheetOutlineController extends EObjectController {

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(SheetRemoveRequest.REQUEST_NAME, new BaseRemoveHandler(this));
		super.installRequestHandler(SheetSelectRequest.REQUEST_NAME, new SheetSelectHandler(this));
		super.installRequestHandler(SheetNameSetRequest.REQUEST_NAME, new SheetNameSetHandler(this));
		super.installRequestHandler(SheetNameListRequest.REQUEST_NAME, new SheetNameListHandler(this));
		super.installRequestHandler(SheetDuplicateRequest.REQUEST_NAME, new SheetDuplicateHandler(this));
		super.installRequestHandler(SheetDragAreaRequest.REQUEST_NAME, new PartViewerAreaRequestHandler(this));
		super.installRequestHandler(SheetPointedCountRequest.REQUEST_NAME, new SheetPointedCountHandler(this));
		super.installRequestHandler(SheetNameValidationRequest.REQUEST_NAME, new SheetNameValidationHandler(this));
		super.installRequestHandler(SheetDragSourceDragRequest.REQUEST_NAME, new SheetDragSourceDragHandler(this));
		super.installRequestHandler(SheetDragSourceStopRequest.REQUEST_NAME, new SheetDragSourceStopHandler(this));
		super.installRequestHandler(SheetDragSourceStartRequest.REQUEST_NAME, new SheetDragSourceStartHandler(this));
	}

	public createView(): SheetOutlineView {
		return new SheetOutlineView(this);
	}

	public getModel(): XSheet {
		return <XSheet>super.getModel();
	}

	public getView(): SheetOutlineView {
		return <SheetOutlineView>super.getView();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let foresee = model.getForesee();
		return [foresee];
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshName();
		this.refreshTooltip();
	}

	private refreshName(): void {
		let model = this.getModel();
		let name = model.getName();
		let view = this.getView();
		view.setName(name);
	}

	private refreshTooltip(): void {
		let model = this.getModel();
		let name = model.getName();
		let view = this.getView();
		let eClass = model.eClass();
		let type = eClass.getNameWithoutPackage();
		let kind = type.substring(1);
		view.setTooltip(kind + ": " + name);
	}

	private resetSelection(): void {
		let request = new SheetSelectRequest();
		let handler = this.getRequestHandler(SheetSelectRequest.REQUEST_NAME);
		handler.handle(request);
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (eventType === Notification.SET) {
			if (feature === XSheet.FEATURE_NAME) {
				this.refreshVisuals();
				this.resetSelection();
			}
		}
	}

}

class SheetSelectHandler extends BaseHandler {

	public handle(): void {
		let sheet = <XSheet>this.controller.getModel();
		let project = <XProject>sheet.eContainer();
		let name = sheet.getName();
		let command = new ProjectSelectionSetCommand();
		command.setProject(project);
		command.setSelection(name);
		this.controller.execute(command);
	}

}

class SheetNameSetHandler extends BaseHandler {

	public handle(request: SheetNameSetRequest): void {
		let name = request.getStringData(SheetNameSetRequest.NAME);
		let sheet = <XSheet>this.controller.getModel()
		let command = new SheetNameSetCommand();
		command.setSheet(sheet);
		command.setName(name);
		this.controller.execute(command);
	}

}

class SheetNameListHandler extends BaseHandler {

	public handle(_request: SheetNameListRequest, callback: (data: any) => void): void {
		let inspector = PadangInspector.eINSTANCE;
		let sheet = <XSheet>this.controller.getModel();
		let project = <XProject>sheet.eContainer();
		let names = inspector.getSheetNames(project);
		callback(names);
	}

}

class SheetPointedCountHandler extends BaseHandler {

	public handle(_request: SheetPointedCountRequest, callback: (data: any) => void): void {
		let director = directors.getProjectComposerDirector(this.controller);
		let model = this.controller.getModel();
		director.inspectValue(model, padang.INSPECT_POINTED, [], (list: VisageObject) => {
			let names = list.fieldNames();
			callback(names.length);
		});
	}

}

class SheetNameValidationHandler extends BaseHandler {

	public handle(request: SheetNameValidationRequest, callback: (data: any) => void): void {
		let name = request.getStringData(SheetNameValidationRequest.NAME);
		let inspector = PadangInspector.eINSTANCE;
		let sheet = <XSheet>this.controller.getModel();
		let project = <XProject>sheet.eContainer();
		let names = inspector.getSheetNames(project);
		if (names.indexOf(name) !== -1) {
			callback("Sheet name '" + name + "' already exists");
		} else {
			let director = directors.getExpressionFormulaDirector(this.controller);
			let message = director.validateName(name);
			callback(message);
		}
	}

}

class SheetDuplicateHandler extends BaseHandler {

	public handle(_request: SheetDuplicateRequest, callback: () => void): void {

		let sheet = <XSheet>this.controller.getModel();
		let copy = <XSheet>util.copy(sheet);
		let project = <XProject>sheet.eContainer();
		let sheets = project.getSheets();
		let oriName = sheet.getName();
		let newName = oriName + "_Copy";
		let inspector = PadangInspector.eINSTANCE;
		newName = inspector.getNewSheetName(newName, project);
		copy.setName(newName);

		// Tunggu command sync selesai
		let director = wef.getSynchronizationDirector(this.controller);
		director.onCommit(() => {

			// Tunggu selection di outline changed ke sheet yang baru
			let listener = <SelectionChangedListener>{
				selectionChanged: () => {

					// Refresh result
					let director = directors.getPresentPartDirector(this.controller);
					director.refreshContent(callback);

					manager.removeSelectionChangedListener(listener);

				}
			}

			let manager = wef.getSelectionDirector(this.controller);
			manager.addSelectionChangedListener(listener);
		});

		let addCommand = new ListAddCommand();
		addCommand.setList(sheets);
		addCommand.setElement(copy);

		this.controller.execute(addCommand);

	}

}

class SheetDragSourceStartHandler extends BaseHandler {

	public handle(_request: SheetDragSourceStartRequest, callback?: (data: any) => void): void {

		let controller = <SheetOutlineController>this.controller;
		let parent = controller.getParent();
		let children = parent.getChildren();
		let index = children.indexOf(controller);
		let sheet = controller.getModel();

		let data = new ObjectMap<any>();
		data.put(padang.SOURCE_POSITION, index);
		data.put(padang.DRAG_SOURCE, sheet);

		let director = directors.getSheetDragDirector(this.controller);
		director.start(data);

		callback(data);

	}
}

class SheetDragSourceDragHandler extends BaseHandler {

	public handle(request: SheetDragSourceDragRequest, callback: (data: any) => void): void {
		let data = <ObjectMap<any>>request.getData(SheetDragSourceDragRequest.DATA);
		let x = <number>request.getData(SheetDragSourceDragRequest.X);
		let y = <number>request.getData(SheetDragSourceDragRequest.Y);
		let director = directors.getSheetDragDirector(this.controller);
		director.drag(data, x, y);
		callback(data);
	}

}

class SheetDragSourceStopHandler extends BaseHandler {

	public handle(): void {
		let director = directors.getSheetDragDirector(this.controller);
		director.stop();
	}

}
