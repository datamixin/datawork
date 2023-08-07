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
import Conductor from "webface/wef/Conductor";
import PartViewer from "webface/wef/PartViewer";
import LayoutablePart from "webface/wef/LayoutablePart";

import Composite from "webface/widgets/Composite";

import WizardDialogPage from "webface/dialogs/WizardDialogPage";

import * as bekasi from "bekasi/bekasi";

import HomeMenuFactory from "bekasi/ui/HomeMenuFactory";
import BlankProjectHomeMenu from "padang/ui/BlankProjectHomeMenu";

import BuilderPremise from "padang/ui/BuilderPremise";

import BuilderWizardDialog from "padang/dialogs/BuilderWizardDialog";

import ProjectToolboxController from "padang/controller/toolbox/ProjectToolboxController";

import BuilderWizardDialogRequest from "padang/requests/toolbox/BuilderWizardDialogRequest";

import ModelDialogPage from "malang/dialogs/ModelDialogPage";
import InputsDialogPage from "malang/dialogs/InputsDialogPage";
import LearningDialogPage from "malang/dialogs/LearningDialogPage";
import PredictionDialogPage from "malang/dialogs/PredictionDialogPage";

export default class ModelerWizardDialog extends BuilderWizardDialog {

	constructor(conductor: Conductor, premise: BuilderPremise) {
		super(conductor, premise);
		this.setDialogSize(960, 720);
		this.setWindowTitle("Prediction Modeler Wizard");
		this.setTitle("Prediction Modeler Wizard");
		this.setMessage("Please specify prediction model requirements");
	}

	protected addPages(parent: Composite): void {
		let dialogPage = new InputsDialogPage(this, this.conductor, this.premise);
		let reference = <InputsDialogPage>this.addPage(parent, dialogPage);
		this.addPage(parent, new LearningDialogPage(this, this.conductor, this.premise, reference));
		this.addPage(parent, new ModelDialogPage(this, this.conductor, this.premise, reference));
		this.addPage(parent, new PredictionDialogPage(this, this.conductor, this.premise));
	}

	protected postPageSelected(page: WizardDialogPage): void {
		this.refreshInputsPage(page);
		this.refreshLearningPage(page);
		this.refreshExecutionPage(page);
		this.refreshPredictionPage(page);
		let part = <LayoutablePart><any>page;
		if (part.relayout) {
			part.relayout();
		}
	}

	private refreshInputsPage(page: WizardDialogPage): void {
		if (page instanceof InputsDialogPage) {
			page.refresh();
		}
	}

	private refreshLearningPage(page: WizardDialogPage): void {
		if (page instanceof LearningDialogPage) {
			page.refresh();
		}
	}

	private refreshExecutionPage(page: WizardDialogPage): void {
		if (page instanceof ModelDialogPage) {
			page.refresh();
		}
	}

	private refreshPredictionPage(page: WizardDialogPage): void {
		if (page instanceof PredictionDialogPage) {
			page.refresh();
		}
	}

}

class ModelerWizardHomeMenu extends BlankProjectHomeMenu {

	constructor(viewer: PartViewer) {
		super(viewer);
	}

	public getLabel(): string {
		return "Prediction Modeler Wizard"
	}

	public getIcon(): string {
		return "mdi-bullseye-arrow";
	}

	public getDescription(): string {
		return "Create new prediction modeler from selected dataset";
	}

	protected postProjectOpen(controller: ProjectToolboxController): void {
		let request = new BuilderWizardDialogRequest();
		controller.submit(request);
	}

}

let factory = HomeMenuFactory.getInstance();
factory.register(bekasi.CATEGORY_WIZARDS, <any>ModelerWizardHomeMenu, []);
