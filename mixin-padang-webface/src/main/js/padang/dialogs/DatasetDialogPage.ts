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
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import Conductor from "webface/wef/Conductor";
import Controller from "webface/wef/Controller";
import LayoutablePart from "webface/wef/LayoutablePart";

import WebFontImage from "webface/graphics/WebFontImage";

import WizardContainer from "webface/dialogs/WizardContainer";

import BaseWizardDialogPage from "webface/wef/base/BaseWizardDialogPage";

import ButtonPanel from "bekasi/panels/ButtonPanel";

import XMutation from "padang/model/XMutation";

import * as widgets from "padang/widgets/widgets";

import ReadCsv from "padang/functions/source/ReadCsv";

import InstoreComposer from "padang/ui/InstoreComposer";

import StarterGuidePanel from "padang/panels/StarterGuidePanel";

import DatasetPreparationApplyRequest from "padang/requests/toolbox/DatasetPreparationApplyRequest";
import DatasetPreparationSampleModelRequest from "padang/requests/toolbox/DatasetPreparationSampleModelRequest";
import DatasetPreparationUploadModelRequest from "padang/requests/toolbox/DatasetPreparationUploadModelRequest";
import DatasetPreparationStarterModelRequest from "padang/requests/toolbox/DatasetPreparationStarterModelRequest";

export default class DatasetDialogPage extends BaseWizardDialogPage implements LayoutablePart {

	private static BUTTONS_PART_HEIGHT = 32;
	private static BUTTON_WIDTH = 100;

	private dataset: string = null;
	private composite: Composite = null;
	private buttonsPart: Composite = null;
	private captionLabel: Label = null;
	private changeButton: ButtonPanel = null;
	private resultPart: Composite = null;
	private sourcePart: Composite = null;
	private guidePanel: SourceGuidePanel = null;
	private composerPart: Composite = null;
	private starterComposer: InstoreComposer = null;

	constructor(container: WizardContainer, conductor: Conductor, dataset: string) {
		super(container, conductor, "Dataset");
		this.dataset = dataset;
	}

	public createControl(parent: Composite): void {
		this.composite = new Composite(parent);
		widgets.addClass(this.composite, "padang-dataset-dialog-page");
		widgets.setGridLayout(this.composite, 1, 0, 0);
		this.createButtonsPart(this.composite);
		this.createResultPart(this.composite);
		this.setShowResult(false);
	}

	private createButtonsPart(parent: Composite): void {
		this.buttonsPart = new Composite(parent);
		widgets.addClass(this.buttonsPart, "padang-dataset-dialog-page-buttons-part");
		widgets.setGridLayout(this.buttonsPart, 2, 0, 0);
		this.createTitleLabel(this.buttonsPart);
		this.createChangeButton(this.buttonsPart);
	}

	private createTitleLabel(parent: Composite): void {
		this.captionLabel = new Label(parent);
		widgets.css(this.captionLabel, "line-height", DatasetDialogPage.BUTTONS_PART_HEIGHT + "px");
		widgets.setGridData(this.captionLabel, true, true);
	}

	private createChangeButton(parent: Composite): void {
		let image = new WebFontImage("mdi", "mdi-undo");
		this.changeButton = new ButtonPanel("Change", image);
		this.changeButton.createControl(parent);
		widgets.setGridData(this.changeButton, DatasetDialogPage.BUTTON_WIDTH, true);
		this.changeButton.onSelection(() => {
			this.setShowResult(false);
			this.resetComposer();
			this.updatePageComplete();
		});
	}

	private createResultPart(parent: Composite): void {
		this.resultPart = new Composite(parent);
		widgets.addClass(this.resultPart, "padang-dataset-dialog-page-result-part");
		widgets.setGridLayout(this.resultPart, 1, 0, 0);
		this.createSourcePart(this.resultPart);
		this.createComposerPart(this.resultPart);
		widgets.setGridData(this.resultPart, true, true);
	}

	private createSourcePart(parent: Composite): void {
		this.sourcePart = new Composite(parent);
		widgets.addClass(this.sourcePart, "padang-dataset-dialog-page-source-part");
		widgets.setGridLayout(this.sourcePart, 1, 0, 0);
		this.guidePanel = new SourceGuidePanel(this.conductor, this.dataset);
		this.guidePanel.createControl(this.sourcePart);
		this.guidePanel.setOnResult((type: string, model: any) => {
			this.populateComposer(type, model);
		});
		widgets.setGridData(this.guidePanel, true, true);
		widgets.setGridData(this.sourcePart, true, true);
	}

	private resetComposer(): void {
		if (this.starterComposer !== null) {
			let control = this.starterComposer.getControl();
			control.dispose();
			this.starterComposer = null;
		}
	}

	private populateComposer(name: string, model: XMutation): void {

		this.resetComposer();
		this.captionLabel.setText("Source Function: " + name);

		this.starterComposer = new InstoreComposer(model);
		let controller = <Controller>this.conductor;
		let viewer = controller.getViewer();
		this.starterComposer.setParent(viewer);
		this.starterComposer.createControl(this.composerPart);
		this.starterComposer.configure();
		let control = this.starterComposer.getControl();
		widgets.setGridData(control, true, true);
		this.setShowResult(true);
		this.updatePageComplete();
	}

	private createComposerPart(parent: Composite): void {
		this.composerPart = new Composite(parent);
		widgets.addClass(this.composerPart, "padang-dataset-dialog-page-sample-part");
		widgets.setGridLayout(this.composerPart, 1, 0, 0);
		widgets.setGridData(this.composerPart, true, 0);
	}

	private setShowResult(state: boolean): void {
		widgets.setGridData(this.buttonsPart, true, state ? DatasetDialogPage.BUTTONS_PART_HEIGHT : 0);
		widgets.setGridData(this.sourcePart, true, state ? 0 : true);
		widgets.setGridData(this.composerPart, true, state ? true : 0);
		if (state === true) {
			let request = new DatasetPreparationApplyRequest(this.dataset);
			this.conductor.submit(request);
		}
		this.composite.relayout();
	}

	public canFlipToNextPage(): boolean {
		if (this.starterComposer === null) {
			return false;
		} else {
			return true;
		}
	}

	public relayout(): void {
		this.guidePanel.relayout();
	}

	public getControl(): Control {
		return this.composite;
	}

}

class SourceGuidePanel extends StarterGuidePanel {

	private dataset: string = null;
	private onResult = (_type: string, _model: any) => { }

	constructor(conductor: Conductor, dataset: string) {
		super(conductor, 10);
		this.dataset = dataset;
	}

	public onStarter(type: string): void {
		let request = new DatasetPreparationStarterModelRequest(this.dataset, type);
		this.conductor.submit(request, (model: any) => {
			this.onResult(type, model);
		});
	}

	public onSample(filePath: string, options: string): void {
		let request = new DatasetPreparationSampleModelRequest(this.dataset, filePath, options);
		this.conductor.submit(request, (model: any) => {
			this.onResult(ReadCsv.FUNCTION_NAME, model);
		});
	}

	public onUpload(filePath: string): void {
		let request = new DatasetPreparationUploadModelRequest(this.dataset, filePath);
		this.conductor.submit(request, (model: any) => {
			this.onResult(ReadCsv.FUNCTION_NAME, model);
		});
	}

	public setOnResult(onResult: (type: string, model: any) => void): void {
		this.onResult = onResult;
	}

}

