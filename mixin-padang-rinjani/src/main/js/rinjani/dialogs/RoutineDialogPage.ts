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
import Controller from "webface/wef/Controller";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import BasePartViewer from "webface/wef/base/BasePartViewer";

import WizardContainer from "webface/dialogs/WizardContainer";

import BaseWizardDialogPage from "webface/wef/base/BaseWizardDialogPage";

import * as padang from "padang/directors";

import XGraphic from "padang/model/XGraphic";

import * as widgets from "padang/widgets/widgets";

import GraphicPremise from "padang/ui/GraphicPremise";
import AnatomyPartViewer from "padang/ui/AnatomyPartViewer";

import BaseFieldDragDirector from "padang/directors/BaseFieldDragDirector";

import AnatomyControllerFactory from "padang/controller/anatomy/AnatomyControllerFactory";

import * as directors from "rinjani/directors";

import DesignPartViewer from "rinjani/ui/DesignPartViewer";
import OutputPartViewer from "rinjani/ui/OutputPartViewer";

import RoutineReference from "rinjani/dialogs/RoutineReference";

import BasePlotPlanDirector from "rinjani/directors/BasePlotPlanDirector";
import BaseDesignPartDirector from "rinjani/directors/BaseDesignPartDirector";
import BaseOutputPartDirector from "rinjani/directors/BaseOutputPartDirector";
import BaseVariableFieldDirector from "padang/directors/BaseVariableFieldDirector";
import BaseInputFieldDragDirector from "rinjani/directors/BaseInputFieldDragDirector";

import OutputControllerFactory from "rinjani/controller/output/OutputControllerFactory";

import DesignControllerFactory from "rinjani/controller/design/DesignControllerFactory";

export default class RoutineDialogPage extends BaseWizardDialogPage {

	private premise: GraphicPremise = null;
	private reference: RoutineReference = null;
	private composite: Composite = null;
	private composer: RoutineComposer = null;

	constructor(container: WizardContainer, conductor: Conductor,
		premise: GraphicPremise, reference: RoutineReference) {
		super(container, conductor, "Routine Mapping");
		this.premise = premise;
		this.reference = reference;
	}

	public createControl(parent: Composite): void {
		this.composite = new Composite(parent);
		widgets.setGridLayout(this.composite, 1, 0, 0);
		this.createComposer(this.composite);
	}

	private createComposer(parent: Composite): void {

		this.composer = new RoutineComposer(this.premise, this.reference);
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

class RoutineComposer extends BasePartViewer {

	private static DESIGN_PART_WIDTH = 200;
	private static ANATOMY_PART_WIDTH = 200;

	private premise: GraphicPremise = null;
	private graphic: XGraphic = null;
	private composite: Composite = null;
	private reference: RoutineReference = null;

	private outputPartViewer: OutputPartViewer = null;
	private designPartViewer: DesignPartViewer = null;
	private anatomyPartViewer: AnatomyPartViewer = null;

	constructor(premise: GraphicPremise, reference: RoutineReference) {
		super();
		this.premise = premise;
		this.graphic = <XGraphic>premise.getModel();
		this.reference = reference;

		this.outputPartViewer = new OutputPartViewer(this.premise);
		this.designPartViewer = new DesignPartViewer(this.premise);
		this.anatomyPartViewer = new AnatomyPartViewer();

		this.outputPartViewer.setParent(this);
		this.designPartViewer.setParent(this);
		this.anatomyPartViewer.setParent(this);

		// Directors
		this.registerPlotPlanDirector();
		this.registerFieldDragDirector();
		this.registerDesignPartDirector();
		this.registerOutputPartDirector();
		this.registerVariableFieldDirector();
		this.registerInputFieldDragDirector();
	}

	private registerFieldDragDirector(): void {
		let director = new BaseFieldDragDirector(this);
		this.registerDirector(padang.FIELD_DRAG_DIRECTOR, director);
	}

	private registerPlotPlanDirector(): void {
		let director = new BasePlotPlanDirector(this.premise);
		this.registerDirector(directors.PLOT_PLAN_DIRECTOR, director);
	}

	private registerDesignPartDirector(): void {
		let director = new BaseDesignPartDirector(this.designPartViewer, this.premise);
		this.registerDirector(directors.DESIGN_PART_DIRECTOR, director);
	}

	private registerOutputPartDirector(): void {
		let director = new BaseOutputPartDirector(this.outputPartViewer, this.premise);
		this.registerDirector(directors.OUTPUT_PART_DIRECTOR, director);
	}

	private registerVariableFieldDirector(): void {
		let director = new BaseVariableFieldDirector(this.anatomyPartViewer);
		this.registerDirector(padang.VARIABLE_FIELD_DIRECTOR, director);
	}

	private registerInputFieldDragDirector(): void {
		let director = new BaseInputFieldDragDirector(this.designPartViewer);
		this.registerDirector(directors.INPUT_FIELD_DRAG_DIRECTOR, director);
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("padang-inputs-composer");
		element.css("background", "#F8F8F8");
		element.css("border", "1px solid #E8E8E8");

		widgets.setGridLayout(this.composite, 3, 0, 0, 0, 0);

		this.createOutputPartViewer(this.composite);
		this.createDesignPartViewer(this.composite);
		this.createAnatomyPartViewer(this.composite);
	}

	private createOutputPartViewer(parent: Composite): void {
		this.outputPartViewer.createControl(parent);
		widgets.setGridData(this.outputPartViewer, true, true);
		widgets.css(this.outputPartViewer, "border-right", "1px solid #E8E8E8");
	}

	private createDesignPartViewer(parent: Composite): void {
		this.designPartViewer.createControl(parent);
		widgets.setGridData(this.designPartViewer, RoutineComposer.DESIGN_PART_WIDTH, true);
		widgets.css(this.designPartViewer, "border-right", "1px solid #E8E8E8");
	}

	private createAnatomyPartViewer(parent: Composite): void {
		this.anatomyPartViewer.createControl(parent);
		widgets.setGridData(this.anatomyPartViewer, RoutineComposer.ANATOMY_PART_WIDTH, true);
	}

	public configure(): void {
		this.outputPartViewer.setControllerFactory(new OutputControllerFactory());
		this.designPartViewer.setControllerFactory(new DesignControllerFactory());
		this.anatomyPartViewer.setControllerFactory(new AnatomyControllerFactory());
		this.anatomyPartViewer.setContents(this.graphic);
	}

	public refresh(): void {
		let modeler = this.reference.getModel();
		this.designPartViewer.setContents(modeler);
		this.outputPartViewer.setContents(modeler);
		let director = <BaseVariableFieldDirector>this.getDirector(padang.VARIABLE_FIELD_DIRECTOR);
		director.refreshVariables();
	}

	public getControl(): Control {
		return this.composite;
	}

}
