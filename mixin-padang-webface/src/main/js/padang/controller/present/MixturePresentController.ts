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

import * as util from "webface/model/util";
import Notification from "webface/model/Notification";

import ObjectMap from "webface/util/ObjectMap";

import Controller from "webface/wef/Controller";
import CommandGroup from "webface/wef/CommandGroup";

import BaseHandler from "webface/wef/base/BaseHandler";
import RemoveCommand from "webface/wef/base/RemoveCommand";
import ListAddCommand from "webface/wef/base/ListAddCommand";
import ListMoveCommand from "webface/wef/base/ListMoveCommand";

import * as bekasi from "bekasi/directors";

import XCell from "padang/model/XCell";
import XPart from "padang/model/XPart";
import XMixture from "padang/model/XMixture";

import * as directors from "padang/directors";

import MixturePresentView from "padang/view/present/MixturePresentView";

import CellDragParticipant from "padang/directors/CellDragParticipant";

import MixtureResizeRequest from "padang/requests/present/MixtureResizeRequest";
import MixtureCellDropObjectRequest from "padang/requests/present/MixtureCellDropObjectRequest";

import MixtureLayoutSetCommand from "padang/commands/MixtureLayoutSetCommand";
import MixtureWeightsSetCommand from "padang/commands/MixtureWeightsSetCommand";

import PartPresentController from "padang/controller/present/PartPresentController";

export default class MixturePresentController extends PartPresentController {

	public static DELIMITER = ",";

	constructor() {
		super();
		this.addParticipant(directors.CELL_DRAG_PARTICIPANT, new MixtureCellDragParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(MixtureResizeRequest.REQUEST_NAME, new MixtureResizeHandler(this));
		super.installRequestHandler(MixtureCellDropObjectRequest.REQUEST_NAME, new MixtureCellDropObjectHandler(this));
	}

	public createView(): MixturePresentView {
		return new MixturePresentView(this);
	}

	public getModel(): XMixture {
		return <XMixture>super.getModel();
	}

	public getView(): MixturePresentView {
		return <MixturePresentView>super.getView();
	}

	public getModelChildren(): any {
		let model = this.getModel();
		let parts = model.getParts();
		return parts.toArray();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshLayout();
		this.refreshWeights();
		this.relayout();
	}

	public refreshLayout(): void {
		let model = this.getModel();
		let layout = model.getLayout();
		if (layout !== null) {
			let view = this.getView();
			view.setLayout(layout);
		}
	}

	public refreshWeights(): void {
		let model = this.getModel();
		let weights = model.getWeights();
		if (weights !== null) {
			let parts = weights.split(MixturePresentController.DELIMITER);
			let sizes: number[] = [];
			for (let part of parts) {
				let size = parseFloat(part);
				sizes.push(size);
			}
			let view = this.getView();
			view.setWeights(sizes);
		}
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	private selectChild(control: Controller): void {
		let manager = wef.getSelectionDirector(this);
		manager.select(control);
	}
	public notifyChanged(notification: Notification): void {

		super.notifyChanged(notification);
		if (!this.isActive()) {
			return; // Terjadi jika mixture di replace oleh single nested mixture
		}

		let feature = notification.getFeature();
		if (feature === XMixture.FEATURE_LAYOUT) {

			this.refreshLayout();

		} else if (feature === XMixture.FEATURE_PARTS) {

			this.refresh();
			let eventType = notification.getEventType();
			if (eventType === Notification.ADD) {
				let position = notification.getListPosition();
				let children = this.getChildren();
				this.selectChild(children[position]);
			}

		} else if (feature === XMixture.FEATURE_WEIGHTS) {

			this.refreshWeights();

		}
	}

}

class MixtureResizeHandler extends BaseHandler {

	public handle(request: MixtureResizeRequest, _callback: (data: any) => void): void {
		let controller = <MixturePresentController>this.controller;
		let sizes = <number[]>request.getData(MixtureResizeRequest.SIZES);
		let weights = sizes.join(MixturePresentController.DELIMITER);
		let model = controller.getModel()
		let command = new MixtureWeightsSetCommand();
		command.setMixture(model);
		command.setWeights(weights);
		this.controller.execute(command);
	}

}

class MixtureCellDragParticipant extends CellDragParticipant {

	constructor(controller: MixturePresentController) {
		super(controller);
	}

	public start(_data: ObjectMap<any>): void {
		let view = this.getView();
		view.dragStart(true);
	}

}

class MixtureCellDropObjectHandler extends BaseHandler {

	public handle(request: MixtureCellDropObjectRequest, _callback: (data: any) => void): void {

		let controller = <MixturePresentController>this.controller;
		let targetMixture = <XMixture>controller.getModel();
		let targetParts = targetMixture.getParts();
		let sourceCell = <XCell>request.getData(MixtureCellDropObjectRequest.CELL);
		let targetPosition = <number>request.getData(MixtureCellDropObjectRequest.TARGET_POSITION);
		let sourcePosition = <number>request.getData(MixtureCellDropObjectRequest.SOURCE_POSITION);

		let cells: XCell[] = [];
		let group = new CommandGroup();
		let director = directors.getViewsetPresentDirector(this.controller);

		if (targetParts.indexOf(sourceCell) !== -1) {

			// Cell di pindah masih dalam satu mixture
			if (targetPosition !== sourcePosition) {

				if (targetPosition > sourcePosition + 1 || targetPosition < sourcePosition) {

					cells.push(sourceCell);

					// Submit command
					let command = new ListMoveCommand();
					command.setList(targetParts);
					command.setElement(sourceCell);
					command.setPosition(targetPosition);
					group.add(command);

					// Execute command dalam konfirmasi move
					director.confirmOnmove(cells, () => {
						controller.execute(group);
					});
				}

			}

		} else {

			let sourceMixture = <XMixture>sourceCell.eContainer();
			let sourceParts = sourceMixture.getParts();
			if (sourceParts.size === 2 && sourceParts.indexOf(targetMixture) !== -1) {

				// Hapus source cell dari source mixture
				let cellRemoveCommand = new RemoveCommand();
				cellRemoveCommand.setModel(sourceCell);
				group.add(cellRemoveCommand);
				cells.push(sourceCell);

				// Kumpulkan cell yang dipindahkan
				let moved = <XCell[]>util.getDescendantsByModelClass(targetMixture, XCell);
				cells = cells.concat(moved);

				// Hapus semua present dari target mixture
				let removedParts: XPart[] = [];
				for (let targetPart of targetParts) {
					let cellRemoveCommand = new RemoveCommand();
					cellRemoveCommand.setModel(targetPart);
					group.add(cellRemoveCommand);
					removedParts.push(targetPart);
				}

				// Setting target layout ke source
				let layoutSetCommand = new MixtureLayoutSetCommand();
				let layout = targetMixture.getLayout();
				layoutSetCommand.setLayout(layout);
				layoutSetCommand.setMixture(sourceMixture);
				group.add(layoutSetCommand);

				// Setting target weights ke source
				let weightsSetCommand = new MixtureWeightsSetCommand();
				let weights = targetMixture.getWeights();
				weightsSetCommand.setWeights(weights);
				weightsSetCommand.setMixture(sourceMixture);
				group.add(weightsSetCommand);

				// Hapus target mixture yang sudah kosong
				let mixtureRemoveCommand = new RemoveCommand();
				mixtureRemoveCommand.setModel(targetMixture);
				group.add(mixtureRemoveCommand);

				// Pasang semua part yang di hapus dari target mixture
				for (let targetPresent of removedParts) {
					let cellAddCommand = new ListAddCommand();
					cellAddCommand.setList(sourceParts);
					cellAddCommand.setElement(targetPresent);
					group.add(cellAddCommand);
				}

				// Pasang kembali source cell ke source mixture dengan posisi baru
				let cellAddCommand = new ListAddCommand();
				cellAddCommand.setList(sourceParts);
				cellAddCommand.setElement(sourceCell);
				cellAddCommand.setPosition(targetPosition);
				group.add(cellAddCommand);

			} else {

				// Remove cell
				let removeCommand = director.removeCellCommand(sourceCell, cells, false);
				group.add(removeCommand);

				// Tambahkan cell ke target mixture yang tidak berpindah
				let addCommand = director.createCellAddCommand(targetMixture, sourceCell, targetPosition);
				group.add(addCommand);

			}

			// Tampilkan kembali selection
			let setCommand = director.createSelectionSetCommand(sourceCell);
			group.add(setCommand);

			// Execute command dalam konfirmasi move
			director.confirmOnmove(cells, () => {
				controller.execute(group);
			});

		}

	}

}