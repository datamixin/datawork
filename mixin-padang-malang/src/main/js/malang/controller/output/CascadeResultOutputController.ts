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
import Notification from "webface/model/Notification";

import ObjectMap from "webface/util/ObjectMap";

import CommandGroup from "webface/wef/CommandGroup";

import BaseHandler from "webface/wef/base/BaseHandler";
import RemoveCommand from "webface/wef/base/RemoveCommand";
import ListAddCommand from "webface/wef/base/ListAddCommand";
import ListMoveCommand from "webface/wef/base/ListMoveCommand";

import * as bekasi from "bekasi/directors";

import * as directors from "malang/directors";

import XResult from "malang/model/XResult";
import XInstantResult from "malang/model/XInstantResult";
import XCascadeResult from "malang/model/XCascadeResult";

import CascadeResultOutputView from "malang/view/output/CascadeResultOutputView";

import ResultOutputController from "malang/controller/output/ResultOutputController";

import InstantResultDragParticipant from "malang/directors/InstantResultDragParticipant";

import CascadeInstantDropObjectRequest from "malang/requests/output/CascadeInstantDropObjectRequest";

export default class CascadeResultOutputController extends ResultOutputController {

	constructor() {
		super();
		this.addParticipant(directors.INSTANT_RESULT_DRAG_PARTICIPANT, new CascadeInstantDragParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(CascadeInstantDropObjectRequest.REQUEST_NAME, new CascadeInstantDropObjectHandler(this));
	}

	public createView(): CascadeResultOutputView {
		let editable = this.isEditable();
		return new CascadeResultOutputView(this, editable);
	}

	public getView(): CascadeResultOutputView {
		return <CascadeResultOutputView>super.getView();
	}

	public getModel(): XCascadeResult {
		return <XCascadeResult>super.getModel();
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let results = model.getResults();
		return results.toArray();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshLayout();
	}

	private refreshLayout(): void {
		let model = this.getModel();
		let layout = model.getLayout();
		let view = this.getView();
		view.setLayout(layout);
	}

	public notifyChanged(notification: Notification): void {

		let feature = notification.getFeature();
		if (feature === XCascadeResult.FEATURE_LAYOUT) {

			this.refreshLayout();
			this.relayout();

		} else if (feature === XCascadeResult.FEATURE_RESULTS) {

			this.refreshChildren();
			this.relayout();

		}

	}

}

class CascadeInstantDragParticipant extends InstantResultDragParticipant {

	constructor(controller: CascadeResultOutputController) {
		super(controller);
	}

	public start(_data: ObjectMap<any>): void {
		let view = this.getView();
		view.dragStart(true);
	}

}

class CascadeInstantDropObjectHandler extends BaseHandler {

	public handle(request: CascadeInstantDropObjectRequest, _callback: (data: any) => void): void {

		let controller = <CascadeResultOutputController>this.controller;
		let targetCascade = <XCascadeResult>controller.getModel();
		let targetResults = targetCascade.getResults();
		let sourceInstant = <XInstantResult>request.getData(CascadeInstantDropObjectRequest.INSTANT);
		let targetPosition = <number>request.getData(CascadeInstantDropObjectRequest.TARGET_POSITION);
		let sourcePosition = <number>request.getData(CascadeInstantDropObjectRequest.SOURCE_POSITION);

		if (targetResults.indexOf(sourceInstant) !== -1) {

			// Cell di pindah masih dalam satu cascade
			if (targetPosition !== sourcePosition) {

				if (targetPosition > sourcePosition + 1 || targetPosition < sourcePosition) {

					// Submit command
					let command = new ListMoveCommand();
					command.setList(targetResults);
					command.setElement(sourceInstant);
					command.setPosition(targetPosition);
					controller.execute(command);
				}

			}

		} else {

			let group = new CommandGroup();
			let director = directors.getOutputPartDirector(this.controller);

			let sourceCascade = <XCascadeResult>sourceInstant.eContainer();
			let sourceResults = sourceCascade.getResults();
			if (sourceResults.size === 2 && sourceResults.indexOf(targetCascade) !== -1) {

				// Hapus source instant dari source cascade
				let instantRemoveCommand = new RemoveCommand();
				instantRemoveCommand.setModel(sourceInstant);
				group.add(instantRemoveCommand);

				// Hapus semua present dari target cascade
				let removedResult: XResult[] = [];
				for (let targetResult of targetResults) {
					let instantRemoveCommand = new RemoveCommand();
					instantRemoveCommand.setModel(targetResult);
					group.add(instantRemoveCommand);
					removedResult.push(targetResult);
				}

				// Setting target layout ke source
				let layout = targetCascade.getLayout();
				let layoutSetCommand = director.createCascadeSetLayoutCommand(sourceCascade, layout);
				group.add(layoutSetCommand);

				// Hapus target cascade yang sudah kosong
				let cascadeRemoveCommand = new RemoveCommand();
				cascadeRemoveCommand.setModel(targetCascade);
				group.add(cascadeRemoveCommand);

				// Pasang semua part yang di hapus dari target cascade
				for (let targetPresent of removedResult) {
					let instantAddCommand = new ListAddCommand();
					instantAddCommand.setList(sourceResults);
					instantAddCommand.setElement(targetPresent);
					group.add(instantAddCommand);
				}

				// Pasang kembali source instant ke source cascade dengan posisi baru
				let instantAddCommand = new ListAddCommand();
				instantAddCommand.setList(sourceResults);
				instantAddCommand.setElement(sourceInstant);
				instantAddCommand.setPosition(targetPosition);
				group.add(instantAddCommand);

			} else {

				// Remove instant
				let removeCommand = director.removeInstantCommand(sourceInstant);
				group.add(removeCommand);

				// Tambahkan instant ke target cascade yang tidak berpindah
				let addCommand = director.createInstantAddCommand(targetCascade, sourceInstant, targetPosition);
				group.add(addCommand);

			}

			// Execute command dalam konfirmasi move
			controller.execute(group);

		}

	}

}