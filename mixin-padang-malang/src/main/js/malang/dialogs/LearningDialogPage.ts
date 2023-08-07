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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import Conductor from "webface/wef/Conductor";
import Controller from "webface/wef/Controller";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import BasePartViewer from "webface/wef/base/BasePartViewer";

import WizardContainer from "webface/dialogs/WizardContainer";

import BaseWizardDialogPage from "webface/wef/base/BaseWizardDialogPage";

import XBuilder from "padang/model/XBuilder";

import * as widgets from "padang/widgets/widgets";

import BuilderPremise from "padang/ui/BuilderPremise";

import XModeler from "malang/model/XModeler";

import * as directors from "malang/directors";

import DesignPartViewer from "malang/ui/DesignPartViewer";

import ModelerReference from "malang/dialogs/ModelerReference";

import BaseDesignPartDirector from "malang/directors/BaseDesignPartDirector";
import BaseLibraryPlanDirector from "malang/directors/BaseLibraryPlanDirector";
import BaseAlgorithmPlanDirector from "malang/directors/BaseAlgorithmPlanDirector";
import BasePreprocessingDirector from "malang/directors/BasePreprocessingDirector";

import DesignControllerFactory from "malang/controller/design/DesignControllerFactory";
import ModelerDesignController from "malang/controller/design/ModelerDesignController";

export default class LearningDialogPage extends BaseWizardDialogPage {

	private premise: BuilderPremise = null;
	private reference: ModelerReference = null;
	private composite: Composite = null;
	private composer: LearningComposer = null;

	constructor(container: WizardContainer, conductor: Conductor,
		premise: BuilderPremise, reference: ModelerReference) {
		super(container, conductor, "Learning");
		this.premise = premise;
		this.reference = reference;
	}

	public createControl(parent: Composite): void {
		this.composite = new Composite(parent);
		widgets.setGridLayout(this.composite, 1);
		this.createComposer(this.composite);
	}

	private createComposer(parent: Composite): void {

		this.composer = new LearningComposer(this.premise, this.reference);
		this.composer.createControl(parent);
		widgets.setGridData(this.composer, true, true);

		let controller = <Controller>this.conductor;
		let viewer = controller.getViewer();
		this.composer.setParent(viewer);
		this.composer.configure();
	}

	public refresh(): void {
		this.composer.refresh();
	}

	public getControl(): Control {
		return this.composite;
	}

}

class LearningComposer extends BasePartViewer {

	private premise: BuilderPremise = null;
	private reference: ModelerReference = null;
	private composite: Composite = null;

	private designPartViewer: DesignPartViewer = null;

	constructor(premise: BuilderPremise, reference: ModelerReference) {
		super();
		this.premise = premise;
		this.reference = reference;

		let builder = <XBuilder>this.premise.getModel();
		this.designPartViewer = new DesignPartViewer(builder);
		this.designPartViewer.setProperty(ModelerDesignController.CHILDREN, [XModeler.FEATURE_LEARNING]);
		this.designPartViewer.setParent(this);

		// Directors
		this.registerDesignPartDirector();
		this.registerLibraryPlanDirector();
		this.registerAlgorithmPlanDirector();
		this.registerPreprocessingDirector();
	}

	private registerDesignPartDirector(): void {
		let director = new BaseDesignPartDirector(this.designPartViewer, this.premise);
		this.registerDirector(directors.DESIGN_PART_DIRECTOR, director);
	}

	private registerLibraryPlanDirector(): void {
		let director = new BaseLibraryPlanDirector();
		this.registerDirector(directors.LIBRARY_PLAN_DIRECTOR, director);
	}

	private registerAlgorithmPlanDirector(): void {
		let director = new BaseAlgorithmPlanDirector();
		this.registerDirector(directors.ALGORITHM_PLAN_DIRECTOR, director);
	}

	private registerPreprocessingDirector(): void {
		let director = new BasePreprocessingDirector(this.premise);
		this.registerDirector(directors.PREPROCESSING_DIRECTOR, director);
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("padang-learning-composer");
		element.css("background", "#F8F8F8");
		element.css("border", "1px solid #E8E8E8");

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createDesignPartViewer(this.composite);
	}

	private createDesignPartViewer(parent: Composite): void {

		this.designPartViewer.createControl(parent);
		let control = this.designPartViewer.getControl();

		let layoutData = new GridData(true, true);
		control.setLayoutData(layoutData);
	}

	public configure(): void {
		this.designPartViewer.setControllerFactory(new DesignControllerFactory());
	}

	public refresh(): void {
		let modeler = this.reference.getModel();
		this.designPartViewer.setContents(modeler);
	}

	public getControl(): Control {
		return this.composite;
	}

}
