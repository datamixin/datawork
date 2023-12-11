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

import * as padang from "padang/directors";

import XBuilder from "padang/model/XBuilder";

import * as widgets from "padang/widgets/widgets";

import BuilderPremise from "padang/ui/BuilderPremise";
import AnatomyPartViewer from "padang/ui/AnatomyPartViewer";

import BaseFieldDragDirector from "padang/directors/BaseFieldDragDirector";
import BaseVariableFieldDirector from "padang/directors/BaseVariableFieldDirector";

import AnatomyControllerFactory from "padang/controller/anatomy/AnatomyControllerFactory";

import XModeler from "malang/model/XModeler";

import * as directors from "malang/directors";

import DesignPartViewer from "malang/ui/DesignPartViewer";

import ModelerReference from "malang/dialogs/ModelerReference";

import BaseDesignPartDirector from "malang/directors/BaseDesignPartDirector";

import DesignControllerFactory from "malang/controller/design/DesignControllerFactory";
import ModelerDesignController from "malang/controller/design/ModelerDesignController";

export default class InputsDialogPage extends BaseWizardDialogPage implements ModelerReference {

	private premise: BuilderPremise = null;
	private composite: Composite = null;
	private composer: InputsComposer = null;

	constructor(container: WizardContainer, conductor: Conductor, premise: BuilderPremise) {
		super(container, conductor, "Inputs");
		this.premise = premise;
	}

	public createControl(parent: Composite): void {
		this.composite = new Composite(parent);
		widgets.setGridLayout(this.composite, 1);
		this.createComposer(this.composite);
	}

	private createComposer(parent: Composite): void {

		this.composer = new InputsComposer(this.premise);
		this.composer.createControl(parent);
		widgets.setGridData(this.composer, true, true);

		let controller = <Controller>this.conductor;
		let viewer = controller.getViewer();
		this.composer.setParent(viewer);
		this.composer.configure();
	}

	public refresh(): void {
		return this.composer.refresh();
	}

	public getModel(): XModeler {
		return this.composer.getModel();
	}

	public getControl(): Control {
		return this.composite;
	}

}

class InputsComposer extends BasePartViewer {

	private static ANATOMY_WIDTH = 240;

	private premise: BuilderPremise = null;
	private builder: XBuilder = null;
	private composite: Composite = null;

	private designPartViewer: DesignPartViewer = null;
	private anatomyPartViewer: AnatomyPartViewer = null;

	constructor(premise: BuilderPremise) {
		super();
		this.premise = premise;
		this.builder = <XBuilder>premise.getModel();

		this.designPartViewer = new DesignPartViewer(this.builder);
		this.designPartViewer.setProperty(ModelerDesignController.CHILDREN, [XModeler.FEATURE_INPUTS]);

		this.anatomyPartViewer = new AnatomyPartViewer();

		this.designPartViewer.setParent(this);
		this.anatomyPartViewer.setParent(this);

		// Directors
		this.registerFieldDragDirector();
		this.registerDesignPartDirector();
		this.registerVariableFieldDirector();
	}

	private registerFieldDragDirector(): void {
		let director = new BaseFieldDragDirector(this);
		this.registerDirector(padang.FIELD_DRAG_DIRECTOR, director);
	}

	private registerDesignPartDirector(): void {
		let director = new BaseDesignPartDirector(this.designPartViewer, this.premise);
		this.registerDirector(directors.DESIGN_PART_DIRECTOR, director);
	}

	private registerVariableFieldDirector(): void {
		let director = new BaseVariableFieldDirector(this.anatomyPartViewer);
		this.registerDirector(padang.VARIABLE_FIELD_DIRECTOR, director);
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("padang-inputs-composer");
		element.css("background", "#F8F8F8");
		element.css("border", "1px solid #E8E8E8");

		let layout = new GridLayout(2, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createDesignPartViewer(this.composite);
		this.createAnatomyPartViewer(this.composite);
	}

	private createDesignPartViewer(parent: Composite): void {

		this.designPartViewer.createControl(parent);
		let control = this.designPartViewer.getControl();

		let element = control.getElement();
		element.css("border-right", "1px solid #E8E8E8");

		let layoutData = new GridData(true, true);
		control.setLayoutData(layoutData);
	}

	private createAnatomyPartViewer(parent: Composite): void {

		this.anatomyPartViewer.createControl(parent);
		let control = this.anatomyPartViewer.getControl();

		let layoutData = new GridData(InputsComposer.ANATOMY_WIDTH, true);
		control.setLayoutData(layoutData);
	}

	public configure(): void {
		this.designPartViewer.setControllerFactory(new DesignControllerFactory());
		this.anatomyPartViewer.setControllerFactory(new AnatomyControllerFactory());
		this.anatomyPartViewer.setContents(this.builder);
		this.populateModel();
	}

	private populateModel(): void {
		this.createModel((model: XModeler) => {
			this.designPartViewer.setContents(model);
		});
	}

	private createModel(callback: (model: XModeler) => void): void {
		let director = directors.getDesignPartDirector(this.designPartViewer);
		director.createModel(callback);
	}

	public getModel(): XModeler {
		let rootController = this.designPartViewer.getRootController();
		let contents = rootController.getContents();
		return <XModeler>contents.getModel();
	}

	public refresh(): void {
		let director = <BaseVariableFieldDirector>this.getDirector(padang.VARIABLE_FIELD_DIRECTOR);
		director.refreshVariables();
	}

	public getControl(): Control {
		return this.composite;
	}

}
