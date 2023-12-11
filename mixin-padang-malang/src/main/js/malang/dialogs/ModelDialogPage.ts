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

import * as directors from "malang/directors";

import TopbarPartViewer from "malang/ui/TopbarPartViewer";
import OutputPartViewer from "malang/ui/OutputPartViewer";
import ExposePartViewer from "malang/ui/ExposePartViewer";

import ModelerReference from "malang/dialogs/ModelerReference";

import BaseOutputPartDirector from "malang/directors/BaseOutputPartDirector";
import BaseExposePartDirector from "malang/directors/BaseExposePartDirector";
import BasePreprocessingDirector from "malang/directors/BasePreprocessingDirector";

import TopbarControllerFactory from "malang/controller/topbar/TopbarControllerFactory";

import OutputControllerFactory from "malang/controller/output/OutputControllerFactory";

import ExposeControllerFactory from "malang/controller/expose/ExposeControllerFactory";

export default class ModelDialogPage extends BaseWizardDialogPage {

	private premise: BuilderPremise = null;
	private reference: ModelerReference = null;
	private composite: Composite = null;
	private composer: ExecutionComposer = null;

	constructor(container: WizardContainer, conductor: Conductor,
		premise: BuilderPremise, reference: ModelerReference) {
		super(container, conductor, "Model");
		this.premise = premise;
		this.reference = reference;
	}

	public createControl(parent: Composite): void {
		this.composite = new Composite(parent);
		widgets.setGridLayout(this.composite, 1);
		this.createComposer(this.composite);
	}

	private createComposer(parent: Composite): void {

		this.composer = new ExecutionComposer(this.premise, this.reference);
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

class ExecutionComposer extends BasePartViewer {

	private static TOPBAR_PART_HEIGHT = 56;
	private static EXPOSE_PART_HEIGHT = 200;

	private premise: BuilderPremise = null;
	private reference: ModelerReference = null;
	private composite: Composite = null;

	private topbarPartViewer: TopbarPartViewer = null;
	private outputPartViewer: OutputPartViewer = null;
	private exposePartViewer: ExposePartViewer = null;

	constructor(premise: BuilderPremise, reference: ModelerReference) {
		super();
		this.premise = premise;
		this.reference = reference;

		let builder = <XBuilder>this.premise.getModel();
		this.outputPartViewer = new OutputPartViewer(builder);
		this.outputPartViewer.setParent(this);

		this.topbarPartViewer = new TopbarPartViewer(builder);
		this.topbarPartViewer.setParent(this);

		this.exposePartViewer = new ExposePartViewer(builder);
		this.exposePartViewer.setParent(this);

		// Directors
		this.registerOutputPartDirector();
		this.registerExposePartDirector();
		this.registerPreprocessingDirector();
	}

	private registerOutputPartDirector(): void {
		let director = new BaseOutputPartDirector(this.outputPartViewer, this.premise);
		this.registerDirector(directors.OUTPUT_PART_DIRECTOR, director);
	}

	private registerExposePartDirector(): void {
		let director = new BaseExposePartDirector(this.exposePartViewer, this.premise);
		this.registerDirector(directors.EXPOSE_PART_DIRECTOR, director);
	}

	private registerPreprocessingDirector(): void {
		let director = new BasePreprocessingDirector(this.premise);
		this.registerDirector(directors.PREPROCESSING_DIRECTOR, director);
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("padang-execution-composer");
		element.css("background", "#F8F8F8");
		element.css("border", "1px solid #E8E8E8");

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createTopbarPartViewer(this.composite);
		this.createOutputPartViewer(this.composite);
		this.createExposePartViewer(this.composite);
	}

	private createTopbarPartViewer(parent: Composite): void {

		this.topbarPartViewer.createControl(parent);
		let control = this.topbarPartViewer.getControl();

		let element = control.getElement();
		element.css("background", "#F8F8F8");
		element.css("border-bottom", "1px solid #E8E8E8");

		let layoutData = new GridData(true, ExecutionComposer.TOPBAR_PART_HEIGHT);
		control.setLayoutData(layoutData);
	}

	private createOutputPartViewer(parent: Composite): void {

		this.outputPartViewer.createControl(parent);
		let control = this.outputPartViewer.getControl();

		let layoutData = new GridData(true, true);
		control.setLayoutData(layoutData);
	}

	private createExposePartViewer(parent: Composite): void {

		this.exposePartViewer.createControl(parent);
		let control = this.exposePartViewer.getControl();

		let element = control.getElement();
		element.css("background", "#F8F8F8");
		element.css("border-top", "1px solid #E8E8E8");

		let layoutData = new GridData(true, ExecutionComposer.EXPOSE_PART_HEIGHT);
		control.setLayoutData(layoutData);
	}

	public configure(): void {
		this.topbarPartViewer.setControllerFactory(new TopbarControllerFactory());
		this.outputPartViewer.setControllerFactory(new OutputControllerFactory());
		this.exposePartViewer.setControllerFactory(new ExposeControllerFactory());
	}

	public refresh(): void {
		let modeler = this.reference.getModel();
		this.topbarPartViewer.setContents(modeler);
		this.outputPartViewer.setContents(modeler);
		this.exposePartViewer.setContents(modeler);
	}

	public getControl(): Control {
		return this.composite;
	}

}
