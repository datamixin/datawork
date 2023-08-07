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

import BaseHandler from "webface/wef/base/BaseHandler";

import * as bekasi from "bekasi/directors";

import BaseContentLayoutParticipant from "bekasi/directors/BaseContentLayoutParticipant";

import XDataset from "padang/model/XDataset";
import XMutation from "padang/model/XMutation";
import XPreparation from "padang/model/XPreparation";
import PadangCreator from "padang/model/PadangCreator";

import * as directors from "padang/directors";

import SampleFileStarter from "padang/directors/SampleFileStarter";
import UploadFileStarter from "padang/directors/UploadFileStarter";

import DatasetPresentView from "padang/view/present/DatasetPresentView";

import DatasetSourceSetCommand from "padang/commands/DatasetSourceSetCommand";

import UploadFileListRequest from "padang/requests/UploadFileListRequest";
import SampleFileContentRequest from "padang/requests/SampleFileContentRequest";

import UploadFileListHandler from "padang/handlers/UploadFileListHandler";
import SampleFileContentHandler from "padang/handlers/SampleFileContentHandler";

import ReceiptPresentController from "padang/controller/present/ReceiptPresentController";

import DatasetPreparationUploadSelectRequest from "padang/requests/DatasetPreparationUploadSelectRequest";
import DatasetPreparationSampleSelectRequest from "padang/requests/DatasetPreparationSampleSelectRequest";
import DatasetPreparationStarterSelectRequest from "padang/requests/DatasetPreparationStarterSelectRequest";
import DatasetPreparationStarterComposeRequest from "padang/requests/DatasetPreparationStarterComposeRequest";

export default class DatasetPresentController extends ReceiptPresentController {

	constructor() {
		super();
		super.addParticipant(bekasi.CONTENT_LAYOUT_PARTICIPANT, new BaseContentLayoutParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();
		super.installRequestHandler(UploadFileListRequest.REQUEST_NAME, new UploadFileListHandler(this));
		super.installRequestHandler(SampleFileContentRequest.REQUEST_NAME, new SampleFileContentHandler(this));
		super.installRequestHandler(DatasetPreparationUploadSelectRequest.REQUEST_NAME, new DatasetPreparationUploadModelHandler(this));
		super.installRequestHandler(DatasetPreparationSampleSelectRequest.REQUEST_NAME, new DatasetPreparationSampleModelHandler(this));
		super.installRequestHandler(DatasetPreparationStarterSelectRequest.REQUEST_NAME, new DatasetPreparationStarterSelectHandler(this));
		super.installRequestHandler(DatasetPreparationStarterComposeRequest.REQUEST_NAME, new DatasetPreparationStarterModelHandler(this));
	}

	public createView(): DatasetPresentView {
		return new DatasetPresentView(this);
	}

	public getModel(): XDataset {
		return <XDataset>super.getModel();
	}

	public getView(): DatasetPresentView {
		return <DatasetPresentView>super.getView();
	}

	public getModelChildren(): any[] {
		let model = this.getModel();
		let source = model.getSource();
		let display = model.getDisplay();
		return [source, display];
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshShowGuide();
		this.relayout();
	}

	private refreshShowGuide(): void {
		let model = this.getModel();
		let view = this.getView();
		let source = model.getSource();
		view.setShowGuide(source === null);
	}

	private relayout(): void {
		let director = bekasi.getContentLayoutDirector(this);
		director.relayout(this);
	}

	public notifyChanged(notification: Notification): void {

		let eventType = notification.getEventType();
		let feature = notification.getFeature();
		if (eventType === Notification.SET) {

			if (feature === XDataset.FEATURE_SOURCE) {

				let oldValue = notification.getOldValue();
				let newValue = notification.getNewValue();
				if (oldValue === null && newValue instanceof XPreparation) {

					// Open mutation composer
					let director = directors.getDatasetPresentDirector(this);
					let mutations = newValue.getMutations();
					let mutation = mutations.get(0);
					director.openInstoreComposer(this, mutation);

				}
				this.refresh();

			} else if (feature === XDataset.FEATURE_DISPLAY) {

				this.refresh();

			}

		}
	}

}

abstract class DatasetPreparationHandler extends BaseHandler {

	protected setPreparationCommand(mutation: XMutation): void {

		let dataset = <XDataset>this.controller.getModel();

		// Source mutation
		let creator = PadangCreator.eINSTANCE;
		let preparation = creator.createPreparation();
		let mutations = preparation.getMutations();
		mutations.add(mutation);

		// Add command
		let command = new DatasetSourceSetCommand();
		command.setDataset(dataset);
		command.setSource(preparation);
		this.controller.execute(command);
	}

}

class DatasetPreparationUploadModelHandler extends DatasetPreparationHandler {

	public handle(request: DatasetPreparationUploadSelectRequest): void {
		let filePath = <string>request.getData(DatasetPreparationUploadSelectRequest.FILE_PATH);
		let starter = new UploadFileStarter();
		let mutation = starter.createMutation(filePath);
		this.setPreparationCommand(mutation);
	}

}

class DatasetPreparationSampleModelHandler extends DatasetPreparationHandler {

	public handle(request: DatasetPreparationSampleSelectRequest): void {
		let filePath = <string>request.getData(DatasetPreparationSampleSelectRequest.FILE_PATH);
		let options = <string>request.getData(DatasetPreparationSampleSelectRequest.OPTIONS);
		let starter = new SampleFileStarter();
		let mutation = starter.createMutation(filePath, options);
		this.setPreparationCommand(mutation);
	}

}

class DatasetPreparationStarterSelectHandler extends DatasetPreparationHandler {

	public handle(request: DatasetPreparationStarterSelectRequest): void {
		let planName = request.getStringData(DatasetPreparationStarterSelectRequest.PLAN);
		let creator = PadangCreator.eINSTANCE;
		let mutation = creator.createStarterMutation(planName);
		this.setPreparationCommand(mutation);
	}

}

class DatasetPreparationStarterModelHandler extends BaseHandler {

	public handle(_request: DatasetPreparationStarterSelectRequest): void {

		let model = <XDataset>this.controller.getModel();
		let preparation = <XPreparation>model.getSource();
		let mutations = preparation.getMutations();
		let mutation = mutations.get(0);

		let director = directors.getDatasetPresentDirector(this.controller);
		director.openInstoreComposer(this.controller, mutation);
	}

}
