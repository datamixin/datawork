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

import EList from "webface/model/EList";
import * as util from "webface/model/util";
import Notification from "webface/model/Notification";

import * as webface from "webface/webface";

import Point from "webface/graphics/Point";

import ObjectMap from "webface/util/ObjectMap";

import PartViewer from "webface/wef/PartViewer";
import * as functions from "webface/wef/functions";
import CommandGroup from "webface/wef/CommandGroup";

import BaseHandler from "webface/wef/base/BaseHandler";
import RemoveCommand from "webface/wef/base/RemoveCommand";
import ReplaceCommand from "webface/wef/base/ReplaceCommand";
import ListAddCommand from "webface/wef/base/ListAddCommand";
import ListMoveCommand from "webface/wef/base/ListMoveCommand";
import BaseSelectionParticipant from "webface/wef/base/BaseSelectionParticipant";
import PartViewerAreaRequestHandler from "webface/wef/base/PartViewerAreaRequestHandler";

import * as bekasi from "bekasi/directors";

import * as padang from "padang/padang";

import * as malang from "malang/malang";
import * as directors from "malang/directors";

import PreloadPanel from "malang/panels/PreloadPanel";

import XResult from "malang/model/XResult";
import MalangFactory from "malang/model/MalangFactory";
import XInstantResult from "malang/model/XInstantResult";
import XCascadeResult from "malang/model/XCascadeResult";

import InstantResultOutputView from "malang/view/output/InstantResultOutputView";

import ResultOutputController from "malang/controller/output/ResultOutputController";

import InstantResultDragParticipant from "malang/directors/InstantResultDragParticipant";

import InstantResultWidthSetCommand from "malang/commands/InstantResultWidthSetCommand";
import InstantResultHeightSetCommand from "malang/commands/InstantResultHeightSetCommand";
import CascadeResultLayoutSetCommand from "malang/commands/CascadeResultLayoutSetCommand";

import InstantResultReloadRequest from "malang/requests/output/InstantResultReloadRequest";
import InstantResultRemoveRequest from "malang/requests/output/InstantResultRemoveRequest";
import InstantResultResizeRequest from "malang/requests/output/InstantResultResizeRequest";
import InstantResultSelectionRequest from "malang/requests/output/InstantResultSelectionRequest";

import InstantInstantDropVerifyRequest from "malang/requests/output/InstantInstantDropVerifyRequest";
import InstantInstantDropObjectRequest from "malang/requests/output/InstantInstantDropObjectRequest";

import InstantResultDragAreaRequest from "malang/requests/output/InstantResultDragAreaRequest";
import InstantResultDragSourceDragRequest from "malang/requests/output/InstantResultDragSourceDragRequest";
import InstantResultDragSourceStopRequest from "malang/requests/output/InstantResultDragSourceStopRequest";
import InstantResultDragSourceStartRequest from "malang/requests/output/InstantResultDragSourceStartRequest";

export default class InstantResultOutputController extends ResultOutputController {

	constructor() {
		super();
		this.addParticipant(wef.SELECTION_PARTICIPANT, new BaseSelectionParticipant(this));
		this.addParticipant(directors.INSTANT_RESULT_DRAG_PARTICIPANT, new InstantInstantResultDragParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();

		super.installRequestHandler(InstantResultReloadRequest.REQUEST_NAME, new InstantResultReloadHandler(this));
		super.installRequestHandler(InstantResultRemoveRequest.REQUEST_NAME, new InstantResultRemoveHandler(this));
		super.installRequestHandler(InstantResultResizeRequest.REQUEST_NAME, new InstantResultResizeHandler(this));
		super.installRequestHandler(InstantResultSelectionRequest.REQUEST_NAME, new InstantResultSelectionHandler(this));

		super.installRequestHandler(InstantResultDragAreaRequest.REQUEST_NAME, new PartViewerAreaRequestHandler(this));
		super.installRequestHandler(InstantResultDragSourceDragRequest.REQUEST_NAME, new InstantResultDragSourceDragHandler(this));
		super.installRequestHandler(InstantResultDragSourceStopRequest.REQUEST_NAME, new InstantResultDragSourceStopHandler(this));
		super.installRequestHandler(InstantResultDragSourceStartRequest.REQUEST_NAME, new InstantResultDragSourceStartHandler(this));
		super.installRequestHandler(InstantInstantDropVerifyRequest.REQUEST_NAME, new InstantInstantDropVerifyHandler(this));
		super.installRequestHandler(InstantInstantDropObjectRequest.REQUEST_NAME, new InstantInstantDropObjectHandler(this));
	}

	public createView(): InstantResultOutputView {
		let editable = this.isEditable();
		return new InstantResultOutputView(this, editable);
	}

	public getView(): InstantResultOutputView {
		return <InstantResultOutputView>super.getView();
	}

	public getModel(): XInstantResult {
		return <XInstantResult>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshResult();
		this.relayout();
	}

	public refreshResult(): void {

		let view = this.getView();
		let model = this.getModel();
		let width = model.getWidth();
		let height = model.getHeight();
		let preload = model.getPreload();
		view.setMessage("Loading " + preload + "...");

		let size = new Point(width, height);
		let director = directors.getExposePartDirector(this);
		director.loadPreloadResult(preload, size, (panel: PreloadPanel) => {

			if (this.isActive() === true) {
				let orientation = this.getOrientation();
				view.setResult(panel, orientation);
				this.relayout();
				this.reselect();
			}

		});
	}

	private getOrientation(): string {
		let parent = this.getParent();
		let model = <XCascadeResult>parent.getModel();
		let layout = model.getLayout();
		return layout === webface.HORIZONTAL ? webface.VERTICAL : webface.HORIZONTAL;
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	private reselect(): void {
		let director = wef.getSelectionDirector(this);
		let selection = director.getSelection();
		let controller = selection.getFirstElement();
		if (controller === this) {
			let view = this.getView();
			view.setSelected(true);
		}
	}

	public notifyChanged(notification: Notification): void {
		let feature = notification.getFeature();
		if (feature === XInstantResult.FEATURE_WIDTH || feature === XInstantResult.FEATURE_HEIGHT) {
			this.refreshResult();
		}
	}

}

class InstantResultReloadHandler extends BaseHandler {

	public handle(_request: InstantResultReloadRequest, _callback: () => void): void {
		let controller = <InstantResultOutputController>this.controller;
		controller.refreshResult();
	}

}

class InstantResultRemoveHandler extends BaseHandler {

	public handle(_request: InstantResultRemoveRequest, _callback: (spec: any) => void): void {
		let controller = <InstantResultOutputController>this.controller;
		let model = controller.getModel();
		let director = directors.getOutputPartDirector(this.controller);
		let command = director.removeInstantCommand(model);
		controller.execute(command);
	}

}

class InstantResultResizeHandler extends BaseHandler {

	public handle(request: InstantResultResizeRequest, _callback: (data: any) => void): void {

		let controller = <InstantResultOutputController>this.controller;
		let size = <number>request.getData(InstantResultResizeRequest.SIZE);
		let orientation = <string>request.getData(InstantResultResizeRequest.ORIENTATION);
		let model = controller.getModel();
		if (orientation === webface.HORIZONTAL) {

			let command = new InstantResultWidthSetCommand();
			command.setInstantResult(model);
			command.setWidth(size);
			controller.execute(command);

		} else {

			let command = new InstantResultHeightSetCommand();
			command.setInstantResult(model);
			command.setHeight(size);
			controller.execute(command);

		}
	}

}

class InstantResultSelectionHandler extends BaseHandler {

	public handle(_request: InstantResultSelectionRequest, _callback: (spec: any) => void): void {
		let director = wef.getSelectionDirector(this.controller);
		director.select(this.controller);
	}

}

class InstantResultDragSourceStartHandler extends BaseHandler {

	public handle(_request: InstantResultDragSourceStartRequest, callback?: (data: any) => void): void {

		let controller = <InstantResultOutputController>this.controller;
		let parent = controller.getParent();
		let children = parent.getChildren();
		let sourcePosition = children.indexOf(controller);
		let instantResult = controller.getModel();

		let data = new ObjectMap<any>();
		data.put(padang.DRAG_SOURCE, malang.INSTANT_RESULT);
		data.put(padang.SOURCE_POSITION, sourcePosition);
		data.put(malang.INSTANT_RESULT, instantResult);

		let director = directors.getInstantResultDragDirector(this.controller);
		director.start(data);

		callback(data);

	}
}

class InstantResultDragSourceDragHandler extends BaseHandler {

	public handle(request: InstantResultDragSourceDragRequest, callback: (data: any) => void): void {
		let data = <ObjectMap<any>>request.getData(InstantResultDragSourceDragRequest.DATA);
		let x = <number>request.getData(InstantResultDragSourceDragRequest.X);
		let y = <number>request.getData(InstantResultDragSourceDragRequest.Y);
		let director = directors.getInstantResultDragDirector(this.controller);
		director.drag(data, x, y);
		callback(data);
	}

}

class InstantResultDragSourceStopHandler extends BaseHandler {

	private viewer: PartViewer = null;

	constructor(controller: InstantResultOutputController) {
		super(controller);
		this.holdViewer(controller);
	}

	private holdViewer(controller: InstantResultOutputController) {
		this.viewer = controller.getViewer();
	}

	public handle(_request: InstantResultDragSourceStopRequest, _callback: (data: any) => void): void {
		let director = directors.getInstantResultDragDirector(this.viewer);
		director.stop();
	}

}

class InstantInstantResultDragParticipant extends InstantResultDragParticipant {

	constructor(controller: InstantResultOutputController) {
		super(controller);
	}

	public start(_data: ObjectMap<any>): void {
		let view = this.getView();
		view.dragStart(true);
	}

}

class InstantInstantDropVerifyHandler extends BaseHandler {

	public handle(request: InstantInstantDropVerifyRequest, callback: (message: string) => void): void {

		let controller = <InstantResultOutputController>this.controller;
		let parent = controller.getParent();
		let children = parent.getChildren();
		let targetPosition = children.indexOf(controller);

		let data = request.getData(InstantInstantDropVerifyRequest.DATA);
		data.put(padang.DRAG_TARGET, malang.INSTANT_RESULT);
		data.put(padang.TARGET_POSITION, targetPosition);
		callback(null);
	}
}

class InstantInstantDropObjectHandler extends BaseHandler {

	public handle(request: InstantInstantDropObjectRequest, _callback: (data: any) => void): void {

		// Ambil sheet controller sebelum instant controller pindahkan lepas
		let controller = <InstantResultOutputController>this.controller;
		let cascade = functions.getAncestorByModelClass(controller, XCascadeResult);

		// Lihat target dan source instant saat drop
		let sourceInstant = <XInstantResult>request.getData(InstantInstantDropObjectRequest.INSTANT);
		let targetInstant = <XInstantResult>controller.getModel();

		if (targetInstant !== sourceInstant) {

			// Hanya jika instant di drop ke instant yang lain
			let sourceCascade = <XCascadeResult>sourceInstant.eContainer();
			let targetCascade = <XCascadeResult>targetInstant.eContainer();
			let sourcePosition = <number>request.getData(InstantInstantDropObjectRequest.SOURCE_POSITION);
			let targetPosition = <number>request.getData(InstantInstantDropObjectRequest.TARGET_POSITION);
			let newPosition = <number>request.getData(InstantInstantDropObjectRequest.NEW_POSITION);
			let sourceResults = sourceCascade.getResults();
			let targetResults = targetCascade.getResults();
			let targetLayout = targetCascade.getLayout() || webface.HORIZONTAL;
			let newLayout = targetLayout === webface.HORIZONTAL ? webface.VERTICAL : webface.HORIZONTAL;

			let group = new CommandGroup();
			let director = directors.getOutputPartDirector(cascade);

			if (sourceCascade === targetCascade) {

				// InstantResult di drop ke parent cascade yang sama
				if (sourceResults.size === 2) {

					// Hanya ada 2 instant di bawah cascade ini maka ganti layout
					let setCommand = new CascadeResultLayoutSetCommand();
					setCommand.setCascadeResult(sourceCascade);
					setCommand.setLayout(newLayout);
					group.add(setCommand);

					if (sourcePosition !== newPosition) {

						// Jika posisi berbeda pindah instant
						let moveCommand = new ListMoveCommand();
						moveCommand.setElement(sourceInstant);
						moveCommand.setPosition(newPosition);
						moveCommand.setList(sourceResults);
						group.add(moveCommand);
					}

				} else if (sourceResults.size > 2) {

					// Combine source dan target instant into cascade
					this.removeInstantResult(sourceInstant, group);
					this.removeInstantResult(targetInstant, group);
					let newCascade = this.newCascade(newLayout, sourceInstant, targetInstant, newPosition);
					targetPosition = sourcePosition < targetPosition ? targetPosition - 1 : targetPosition;
					this.addCascade(targetResults, newCascade, targetPosition, group)

				}

				// Execute
				cascade.execute(group);

			} else {

				// Remove instant
				let removeCommand = director.removeInstantCommand(sourceInstant);
				group.add(removeCommand);

				// Gabungkan source dan target instant ke dalam satu cascade dan replace target
				let newCascade = this.newCascade(newLayout, sourceInstant, targetInstant, newPosition);
				this.replaceResult(targetInstant, newCascade, group);

				// Execute
				cascade.execute(group);

			}

		}

	}

	private removeInstantResult(instant: XInstantResult, group: CommandGroup): void {
		let command = new RemoveCommand();
		command.setModel(instant);
		group.add(command);
	}

	private newCascade(layout: string, a: XInstantResult, b: XInstantResult, position: number): XCascadeResult {

		// Buat cascade dengan layout yang baru
		let factory = MalangFactory.eINSTANCE;
		let cascade = factory.createCascadeResult();
		cascade.setLayout(layout);

		// Anakannya adalah kedua instant
		let newResults = cascade.getResults();
		let aCopy = <XInstantResult>util.copy(a);
		let bCopy = <XInstantResult>util.copy(b);
		if (position === 0) {
			newResults.add(aCopy);
			newResults.add(bCopy);
		} else {
			newResults.add(bCopy);
			newResults.add(aCopy);
		}

		return cascade;
	}

	private addCascade(outputs: EList<XResult>, cascade: XCascadeResult, position: number, group: CommandGroup): void {
		let command = new ListAddCommand();
		command.setList(outputs);
		command.setElement(cascade);
		command.setPosition(position);
		group.add(command);
	}

	private replaceResult(model: XResult, replacement: XResult, group: CommandGroup): void {
		let command = new ReplaceCommand();
		command.setModel(model);
		command.setReplacement(replacement);
		group.add(command);
	}

}