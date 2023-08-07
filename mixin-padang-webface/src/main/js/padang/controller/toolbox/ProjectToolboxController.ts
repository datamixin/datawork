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
import * as util from "webface/model/util";
import EObject from "webface/model/EObject";
import Notification from "webface/model/Notification";

import BaseHandler from "webface/wef/base/BaseHandler";
import EObjectController from "webface/wef/base/EObjectController";
import BaseContentAdapter from "webface/wef/base/BaseContentAdapter";

import * as bekasi from "bekasi/directors";

import BaseContentLayoutParticipant from "bekasi/directors/BaseContentLayoutParticipant";

import XProject from "padang/model/XProject";
import XDataset from "padang/model/XDataset";

import * as directors from "padang/directors";

import DatasetAddRequest from "padang/requests/DatasetAddRequest";
import OutcomeAddRequest from "padang/requests/OutcomeAddRequest";
import FigureCreateRequest from "padang/requests/FigureCreateRequest";
import OutcomeCreateRequest from "padang/requests/OutcomeCreateRequest";
import FormulaValidationRequest from "padang/requests/FormulaValidationRequest";
import OutcomeFormulaListRequest from "padang/requests/OutcomeFormulaListRequest";
import OutcomeFormulaResultRequest from "padang/requests/OutcomeFormulaResultRequest";

import DatasetAddHandler from "padang/handlers/DatasetAddHandler";
import OutcomeAddHandler from "padang/handlers/OutcomeAddHandler";
import FigureCreateHandler from "padang/handlers/FigureCreateHandler";
import OutcomeCreateHandler from "padang/handlers/OutcomeCreateHandler";
import FormulaValidationHandler from "padang/handlers/FormulaValidationHandler";
import OutcomeFormulaListHandler from "padang/handlers/OutcomeFormulaListHandler";
import OutcomeFormulaResultHandler from "padang/handlers/OutcomeFormulaResultHandler";

import ProjectSaveAction from "padang/actions/ProjectSaveAction";
import ProjectSaveAsAction from "padang/actions/ProjectSaveAsAction";

import ProjectToolboxView from "padang/view/toolbox/ProjectToolboxView";

import ProjectSaveRequest from "padang/requests/toolbox/ProjectSaveRequest";
import ProjectSaveAsRequest from "padang/requests/toolbox/ProjectSaveAsRequest";
import DatasetPreparationApplyRequest from "padang/requests/toolbox/DatasetPreparationApplyRequest";
import DatasetPreparationUploadModelRequest from "padang/requests/toolbox/DatasetPreparationUploadModelRequest";
import DatasetPreparationSampleModelRequest from "padang/requests/toolbox/DatasetPreparationSampleModelRequest";
import DatasetPreparationStarterModelRequest from "padang/requests/toolbox/DatasetPreparationStarterModelRequest";

import UploadFileListRequest from "padang/requests/UploadFileListRequest";
import SampleFileContentRequest from "padang/requests/SampleFileContentRequest";

import UploadFileListHandler from "padang/handlers/UploadFileListHandler";
import SampleFileContentHandler from "padang/handlers/SampleFileContentHandler";

import PointerFeatureMapRequest from "padang/requests/toolbox/PointerFeatureMapRequest";
import GraphicWizardDialogRequest from "padang/requests/toolbox/GraphicWizardDialogRequest";
import BuilderWizardDialogRequest from "padang/requests/toolbox/BuilderWizardDialogRequest";

import PointerFeatureMapHandler from "padang/handlers/toolbox/PointerFeatureMapHandler";
import GraphicWizardDialogHandler from "padang/handlers/toolbox/GraphicWizardDialogHandler";
import BuilderWizardDialogHandler from "padang/handlers/toolbox/BuilderWizardDialogHandler";

import DatasetPreparationApplyHandler from "padang/handlers/toolbox/DatasetPreparationApplyHandler";
import DatasetPreparationUploadModelHandler from "padang/handlers/toolbox/DatasetPreparationUploadModelHandler";
import DatasetPreparationSampleModelHandler from "padang/handlers/toolbox/DatasetPreparationSampleModelHandler";
import DatasetPreparationStarterModelHandler from "padang/handlers/toolbox/DatasetPreparationStarterModelHandler";

export default class ProjectToolboxController extends EObjectController {

	private adapter = new DatasetAdapter(this);

	constructor() {
		super();
		this.addParticipant(bekasi.CONTENT_LAYOUT_PARTICIPANT, new BaseContentLayoutParticipant(this));
	}

	public createRequestHandlers(): void {
		super.createRequestHandlers();

		this.installRequestHandler(ProjectSaveRequest.REQUEST_NAME, new ProjectSaveHandler(this));
		this.installRequestHandler(ProjectSaveAsRequest.REQUEST_NAME, new ProjectSaveAsHandler(this));

		this.installRequestHandler(PointerFeatureMapRequest.REQUEST_NAME, new PointerFeatureMapHandler(this));
		this.installRequestHandler(GraphicWizardDialogRequest.REQUEST_NAME, new GraphicWizardDialogHandler(this));
		this.installRequestHandler(BuilderWizardDialogRequest.REQUEST_NAME, new BuilderWizardDialogHandler(this));

		this.installRequestHandler(DatasetAddRequest.REQUEST_NAME, new DatasetAddHandler(this));
		this.installRequestHandler(OutcomeAddRequest.REQUEST_NAME, new OutcomeAddHandler(this));
		this.installRequestHandler(FigureCreateRequest.REQUEST_NAME, new FigureCreateHandler(this));
		this.installRequestHandler(OutcomeCreateRequest.REQUEST_NAME, new OutcomeCreateHandler(this));
		this.installRequestHandler(FormulaValidationRequest.REQUEST_NAME, new FormulaValidationHandler(this));
		this.installRequestHandler(OutcomeFormulaListRequest.REQUEST_NAME, new OutcomeFormulaListHandler(this));
		this.installRequestHandler(OutcomeFormulaResultRequest.REQUEST_NAME, new OutcomeFormulaResultHandler(this));

		this.installRequestHandler(UploadFileListRequest.REQUEST_NAME, new UploadFileListHandler(this));
		this.installRequestHandler(SampleFileContentRequest.REQUEST_NAME, new SampleFileContentHandler(this));

		this.installRequestHandler(DatasetPreparationApplyRequest.REQUEST_NAME, new DatasetPreparationApplyHandler(this));
		this.installRequestHandler(DatasetPreparationUploadModelRequest.REQUEST_NAME, new DatasetPreparationUploadModelHandler(this));
		this.installRequestHandler(DatasetPreparationSampleModelRequest.REQUEST_NAME, new DatasetPreparationSampleModelHandler(this));
		this.installRequestHandler(DatasetPreparationStarterModelRequest.REQUEST_NAME, new DatasetPreparationStarterModelHandler(this));

	}

	public createView(): ProjectToolboxView {
		return new ProjectToolboxView(this);
	}

	public getView(): ProjectToolboxView {
		return <ProjectToolboxView>super.getView();
	}

	public getModel(): XProject {
		return <XProject>super.getModel();
	}

	public refreshVisuals(): void {
		super.refreshVisuals();
		this.refreshDatasetExist();
	}

	private refreshDatasetExist(): void {
		let model = <EObject><any>this.getModel();
		let project = <XProject>util.getRootContainer(model);
		let sheets = project.getSheets();
		let exists = false;
		for (let sheet of sheets) {
			let foresee = sheet.getForesee();
			if (foresee instanceof XDataset) {
				let source = foresee.getSource();
				if (source !== null) {
					exists = true;
					break;
				}
			}
		}
		let view = this.getView();
		view.setDatasetExists(exists);
	}

	public getCustomAdapters(): BaseContentAdapter[] {
		return [this.adapter];
	}

}

class DatasetAdapter extends BaseContentAdapter {

	public notifyChanged(notification: Notification): void {
		let feature = notification.getFeature();
		let controller = <ProjectToolboxController>this.controller;
		let eventType = notification.getEventType();
		if (feature === XDataset.FEATURE_SOURCE) {
			if (eventType === Notification.SET) {
				controller.refresh();
			}
		}
	}

}

class ProjectSaveHandler extends BaseHandler {

	public handle(_request: ProjectSaveRequest, _callback: (data: any) => void): void {
		let director = directors.getProjectComposerDirector(this.controller);
		let file = director.getFile();
		if (file.isUntitled() === true) {
			let action = new ProjectSaveAsAction(this.controller, file);
			action.run();
		} else {
			let action = new ProjectSaveAction(this.controller, file);
			action.run();
		}
	}
}

class ProjectSaveAsHandler extends BaseHandler {

	public handle(_request: ProjectSaveAsRequest, _callback: (data: any) => void): void {
		let director = directors.getProjectComposerDirector(this.controller);
		let file = director.getFile();
		let action = new ProjectSaveAsAction(this.controller, file);
		action.run();
	}
}
