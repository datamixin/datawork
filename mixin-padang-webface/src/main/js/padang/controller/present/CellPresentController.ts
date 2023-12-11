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

import ObjectMap from "webface/util/ObjectMap";

import PartViewer from "webface/wef/PartViewer";
import * as functions from "webface/wef/functions";
import CommandGroup from "webface/wef/CommandGroup";

import BaseHandler from "webface/wef/base/BaseHandler";
import RemoveCommand from "webface/wef/base/RemoveCommand";
import ListAddCommand from "webface/wef/base/ListAddCommand";
import ListMoveCommand from "webface/wef/base/ListMoveCommand";
import PartViewerAreaRequestHandler from "webface/wef/base/PartViewerAreaRequestHandler";

import XPart from "padang/model/XPart";
import XCell from "padang/model/XCell";
import XViewset from "padang/model/XViewset";
import XMixture from "padang/model/XMixture";
import NatunaFactory from "padang/model/PadangFactory";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import CellPresentView from "padang/view/present/CellPresentView";

import CellDragParticipant from "padang/directors/CellDragParticipant";

import FigureCreateRequest from "padang/requests/FigureCreateRequest";
import OutcomeCreateRequest from "padang/requests/OutcomeCreateRequest";
import FormulaFormatRequest from "padang/requests/FormulaFormatRequest";
import FormulaValidationRequest from "padang/requests/FormulaValidationRequest";

import FigureCreateHandler from "padang/handlers/FigureCreateHandler";
import OutcomeCreateHandler from "padang/handlers/OutcomeCreateHandler";
import FormulaFormatHandler from "padang/handlers/FormulaFormatHandler";
import FormulaValidationHandler from "padang/handlers/FormulaValidationHandler";

import OutcomeFormulaListRequest from "padang/requests/OutcomeFormulaListRequest";
import OutcomeFormulaResultRequest from "padang/requests/OutcomeFormulaResultRequest";

import OutcomeFormulaListHandler from "padang/handlers/OutcomeFormulaListHandler";
import OutcomeFormulaResultHandler from "padang/handlers/OutcomeFormulaResultHandler";

import CellRemoveRequest from "padang/requests/present/CellRemoveRequest";
import CellSelectionSetRequest from "padang/requests/present/CellSelectionSetRequest";
import CellCellDropVerifyRequest from "padang/requests/present/CellCellDropVerifyRequest";
import CellCellDropObjectRequest from "padang/requests/present/CellCellDropObjectRequest";

import CellDragAreaRequest from "padang/requests/present/CellDragAreaRequest";
import CellDragSourceDragRequest from "padang/requests/present/CellDragSourceDragRequest";
import CellDragSourceStopRequest from "padang/requests/present/CellDragSourceStopRequest";
import CellDragSourceStartRequest from "padang/requests/present/CellDragSourceStartRequest";

import MixtureLayoutSetCommand from "padang/commands/MixtureLayoutSetCommand";

import PartPresentController from "padang/controller/present/PartPresentController";

export default class CellPresentController extends PartPresentController {

	constructor() {
		super();
		this.addParticipant(directors.CELL_DRAG_PARTICIPANT, new CellCellDragParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();

		super.installRequestHandler(FormulaFormatRequest.REQUEST_NAME, new FormulaFormatHandler(this));
		super.installRequestHandler(FormulaValidationRequest.REQUEST_NAME, new FormulaValidationHandler(this));

		super.installRequestHandler(OutcomeFormulaListRequest.REQUEST_NAME, new OutcomeFormulaListHandler(this));
		super.installRequestHandler(OutcomeFormulaResultRequest.REQUEST_NAME, new OutcomeFormulaResultHandler(this));

		super.installRequestHandler(CellRemoveRequest.REQUEST_NAME, new CellRemoveHandler(this));
		super.installRequestHandler(FigureCreateRequest.REQUEST_NAME, new FigureCreateHandler(this));
		super.installRequestHandler(OutcomeCreateRequest.REQUEST_NAME, new OutcomeCreateHandler(this));
		super.installRequestHandler(CellSelectionSetRequest.REQUEST_NAME, new CellSelectionSetHandler(this));

		super.installRequestHandler(CellDragAreaRequest.REQUEST_NAME, new PartViewerAreaRequestHandler(this));
		super.installRequestHandler(CellDragSourceDragRequest.REQUEST_NAME, new CellDragSourceDragHandler(this));
		super.installRequestHandler(CellDragSourceStopRequest.REQUEST_NAME, new CellDragSourceStopHandler(this));
		super.installRequestHandler(CellDragSourceStartRequest.REQUEST_NAME, new CellDragSourceStartHandler(this));
		super.installRequestHandler(CellCellDropVerifyRequest.REQUEST_NAME, new CellCellDropVerifyHandler(this));
		super.installRequestHandler(CellCellDropObjectRequest.REQUEST_NAME, new CellCellDropObjectHandler(this));
	}

	public createView(): CellPresentView {
		return new CellPresentView(this);
	}

	public getModel(): XCell {
		return <XCell>super.getModel();
	}

	public getView(): CellPresentView {
		return <CellPresentView>super.getView();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let facet = model.getFacet();
		return [facet];
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshShowGuide();
	}

	private refreshShowGuide(): void {
		let model = this.getModel();
		let view = this.getView();
		let facet = model.getFacet();
		view.setShowGuide(facet === null);
	}

	public deactivate(): void {
		super.deactivate();
	}

	public notifyChanged(notification: Notification): void {
		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (eventType === Notification.SET) {
			if (feature === XCell.FEATURE_FACET) {
				this.refresh();
			}
		}
	}

}

class CellRemoveHandler extends BaseHandler {

	public handle(_request: CellRemoveRequest, _callback: (data: any) => void): void {
		let cell = <XCell>this.controller.getModel();
		let director = directors.getViewsetPresentDirector(this.controller);
		let command = director.removeCellCommand(cell, []);
		this.controller.execute(command);
	}

}

class CellSelectionSetHandler extends BaseHandler {

	public handle(_request: CellSelectionSetRequest, _callback: (data: any) => void): void {
		let director = wef.getSelectionDirector(this.controller);
		director.select(this.controller);
	}

}

class CellDragSourceStartHandler extends BaseHandler {

	public handle(_request: CellDragSourceStartRequest, callback?: (data: any) => void): void {

		let controller = <CellPresentController>this.controller;
		let parent = controller.getParent();
		let children = parent.getChildren();
		let sourcePosition = children.indexOf(controller);
		let cell = controller.getModel();

		let data = new ObjectMap<any>();
		data.put(padang.DRAG_SOURCE, padang.CELL);
		data.put(padang.SOURCE_POSITION, sourcePosition);
		data.put(padang.CELL, cell);

		let director = directors.getCellDragDirector(this.controller);
		director.start(data);

		callback(data);

	}
}

class CellDragSourceDragHandler extends BaseHandler {

	public handle(request: CellDragSourceDragRequest, callback: (data: any) => void): void {
		let data = <ObjectMap<any>>request.getData(CellDragSourceDragRequest.DATA);
		let x = <number>request.getData(CellDragSourceDragRequest.X);
		let y = <number>request.getData(CellDragSourceDragRequest.Y);
		let director = directors.getCellDragDirector(this.controller);
		director.drag(data, x, y);
		callback(data);
	}

}

class CellDragSourceStopHandler extends BaseHandler {

	private viewer: PartViewer = null;

	constructor(controller: CellPresentController) {
		super(controller);
		this.holdViewer(controller);
	}

	private holdViewer(controller: CellPresentController) {
		this.viewer = controller.getViewer();
	}

	public handle(_request: CellDragSourceStopRequest, _callback: (data: any) => void): void {
		let director = directors.getCellDragDirector(this.viewer);
		director.stop();
	}

}

class CellCellDragParticipant extends CellDragParticipant {

	constructor(controller: CellPresentController) {
		super(controller);
	}

	public start(_data: ObjectMap<any>): void {
		let view = this.getView();
		view.dragStart(true);
	}

}

class CellCellDropVerifyHandler extends BaseHandler {

	public handle(request: CellCellDropVerifyRequest, callback: (message: string) => void): void {

		let controller = <CellPresentController>this.controller;
		let parent = controller.getParent();
		let children = parent.getChildren();
		let targetPosition = children.indexOf(controller);

		let data = request.getData(CellCellDropVerifyRequest.DATA);
		data.put(padang.DRAG_TARGET, padang.CELL);
		data.put(padang.TARGET_POSITION, targetPosition);
		callback(null);
	}
}

class CellCellDropObjectHandler extends BaseHandler {

	public handle(request: CellCellDropObjectRequest, _callback: (data: any) => void): void {

		// Ambil sheet controller sebelum cell controller pindahkan lepas
		let controller = <CellPresentController>this.controller;
		let viewset = functions.getAncestorByModelClass(controller, XViewset);

		// Lihat target dan source cell saat drop
		let sourceCell = <XCell>request.getData(CellCellDropObjectRequest.CELL);
		let targetCell = <XCell>controller.getModel();
		let cells: XCell[] = [];

		if (targetCell !== sourceCell) {

			// Hanya jika cell di drop ke cell yang lain
			let sourceMixture = <XMixture>sourceCell.eContainer();
			let targetMixture = <XMixture>targetCell.eContainer();
			let sourcePosition = <number>request.getData(CellCellDropObjectRequest.SOURCE_POSITION);
			let targetPosition = <number>request.getData(CellCellDropObjectRequest.TARGET_POSITION);
			let newPosition = <number>request.getData(CellCellDropObjectRequest.NEW_POSITION);
			let sourceParts = sourceMixture.getParts();
			let targetParts = targetMixture.getParts();
			let targetLayout = targetMixture.getLayout() || webface.HORIZONTAL;
			let newLayout = targetLayout === webface.HORIZONTAL ? webface.VERTICAL : webface.HORIZONTAL;

			let group = new CommandGroup();
			let director = directors.getViewsetPresentDirector(viewset);

			if (sourceMixture === targetMixture) {

				// Cell di drop ke parent mixture yang sama
				if (sourceParts.size === 2) {

					// Hanya ada 2 cell di bawah mixture ini maka ganti layout
					let setCommand = new MixtureLayoutSetCommand();
					setCommand.setMixture(sourceMixture);
					setCommand.setLayout(newLayout);
					group.add(setCommand);

					if (sourcePosition !== newPosition) {

						// Jika posisi berbeda pindah cell
						let moveCommand = new ListMoveCommand();
						moveCommand.setElement(sourceCell);
						moveCommand.setPosition(newPosition);
						moveCommand.setList(sourceParts);
						group.add(moveCommand);
					}

				} else if (sourceParts.size > 2) {

					// Combine source dan target cell into mixture
					this.removeCell(sourceCell, group, cells);
					this.removeCell(targetCell, group, cells);
					let newMixture = this.newMixture(newLayout, sourceCell, targetCell, newPosition);
					targetPosition = sourcePosition < targetPosition ? targetPosition - 1 : targetPosition;
					this.addMixture(targetParts, newMixture, targetPosition, group)

					// Tampilkan kembali selection
					let setCommand = director.createSelectionSetCommand(sourceCell);
					group.add(setCommand);

				}

				// Execute dalam status konfirmasi cells tersebut dipindahkan
				director.confirmOnmove(cells, () => {
					viewset.execute(group);
				});

			} else {

				// Remove cell
				let removeCommand = director.removeCellCommand(sourceCell, cells, false);
				group.add(removeCommand);

				// Gabungkan source dan target cell ke dalam satu mixture
				this.removeCell(targetCell, group, cells);
				let newMixture = this.newMixture(newLayout, sourceCell, targetCell, newPosition);
				this.addMixture(targetParts, newMixture, targetPosition, group)

				// Tampilkan kembali selection
				let setCommand = director.createSelectionSetCommand(sourceCell);
				group.add(setCommand);

				// Execute dalam status konfirmasi cells tersebut dipindahkan
				director.confirmOnmove(cells, () => {
					viewset.execute(group);
				});

			}

		}

	}

	private removeCell(cell: XCell, group: CommandGroup, cells: XCell[]): void {
		let command = new RemoveCommand();
		command.setModel(cell);
		group.add(command);
		cells.push(cell);
	}

	private newMixture(layout: string, aCell: XCell, bCell: XCell, position: number): XMixture {

		// Buat mixture dengan layout yang baru
		let factory = NatunaFactory.eINSTANCE;
		let mixture = factory.createXMixture();
		mixture.setLayout(layout);
		mixture.setWeights("1,1");

		// Anakannya adalah kedua cell
		let newParts = mixture.getParts();
		let aCopy = <XCell>util.copy(aCell);
		let bCopy = <XCell>util.copy(bCell);
		if (position === 0) {
			newParts.add(aCopy);
			newParts.add(bCopy);
		} else {
			newParts.add(bCopy);
			newParts.add(aCopy);
		}

		return mixture;
	}

	private addMixture(presents: EList<XPart>, mixture: XMixture, position: number, group: CommandGroup): void {
		let command = new ListAddCommand();
		command.setList(presents);
		command.setElement(mixture);
		command.setPosition(position);
		group.add(command);
	}

}