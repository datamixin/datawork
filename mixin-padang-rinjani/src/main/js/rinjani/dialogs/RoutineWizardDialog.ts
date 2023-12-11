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
import Conductor from "webface/wef/Conductor";
import LayoutablePart from "webface/wef/LayoutablePart";

import Composite from "webface/widgets/Composite";

import WizardDialogPage from "webface/dialogs/WizardDialogPage";

import * as bekasi from "bekasi/bekasi";

import HomeMenuFactory from "bekasi/ui/HomeMenuFactory";

import GraphicPremise from "padang/ui/GraphicPremise";
import BlankProjectHomeMenu from "padang/ui/BlankProjectHomeMenu";

import GraphicWizardDialog from "padang/dialogs/GraphicWizardDialog";

import PlotDialogPage from "rinjani/dialogs/PlotDialogPage";
import RoutineDialogPage from "rinjani/dialogs/RoutineDialogPage";

import ProjectToolboxController from "padang/controller/toolbox/ProjectToolboxController";

import GraphicWizardDialogRequest from "padang/requests/toolbox/GraphicWizardDialogRequest";

export default class RoutineWizardDialog extends GraphicWizardDialog {

	constructor(conductor: Conductor, premise: GraphicPremise) {
		super(conductor, premise);
		this.setDialogSize(980, 640);
		this.setWindowTitle("Exploration Routine Wizard Dialog");
		this.setTitle("Exploration Routine Wizard");
		this.setMessage("Please specify exploration routine requirements");
	}

	protected addPages(parent: Composite): void {
		let dialogPage = new PlotDialogPage(this, this.conductor, this.premise);
		let reference = <PlotDialogPage>this.addPage(parent, dialogPage);
		this.addPage(parent, new RoutineDialogPage(this, this.conductor, this.premise, reference));
	}

	protected postPageSelected(page: WizardDialogPage): void {
		this.refreshRoutinePage(page);
		let part = <LayoutablePart><any>page;
		if (part.relayout) {
			part.relayout();
		}
	}

	private refreshRoutinePage(page: WizardDialogPage): void {
		if (page instanceof RoutineDialogPage) {
			page.refresh();
		}
	}

}

class RoutineWizardHomeMenu extends BlankProjectHomeMenu {

	public getLabel(): string {
		return "Exploration Routine Wizard"
	}

	public getIcon(): string {
		return "mdi-image-auto-adjust";
	}

	public getDescription(): string {
		return "Create new exploration from available prepared visualization";
	}

	protected postProjectOpen(controller: ProjectToolboxController): void {
		let request = new GraphicWizardDialogRequest();
		controller.submit(request);
	}

}

let factory = HomeMenuFactory.getInstance();
factory.register(bekasi.CATEGORY_WIZARDS, <any>RoutineWizardHomeMenu, []);
