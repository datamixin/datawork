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

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import GraphicPremise from "padang/ui/GraphicPremise";
import PreformPartViewer from "padang/ui/PreformPartViewer";

import XRoutine from "rinjani/model/XRoutine";

import * as directors from "rinjani/directors";

import TopbarPartViewer from "rinjani/ui/TopbarPartViewer";
import DesignPartViewer from "rinjani/ui/DesignPartViewer";
import OutputPartViewer from "rinjani/ui/OutputPartViewer";

import RoutineDesignView from "rinjani/view/design/RoutineDesignView";

import BasePlotPlanDirector from "rinjani/directors/BasePlotPlanDirector";
import BaseDesignPartDirector from "rinjani/directors/BaseDesignPartDirector";
import BaseOutputPartDirector from "rinjani/directors/BaseOutputPartDirector";
import BaseInputFieldDragDirector from "rinjani/directors/BaseInputFieldDragDirector";

import TopbarControllerFactory from "rinjani/controller/topbar/TopbarControllerFactory";
import DesignControllerFactory from "rinjani/controller/design/DesignControllerFactory";
import OutputControllerFactory from "rinjani/controller/output/OutputControllerFactory";

export default class RinjaniPartViewer extends PreformPartViewer {

	private static TOPBAR_PART_HEIGHT = 56;
	private static DESIGN_PART_WIDTH = 300;

	private premise: GraphicPremise = null;

	private composite: Composite = null;
	private topbarPartViewer: TopbarPartViewer = null;
	private designPartViewer: DesignPartViewer = null;
	private outputPartViewer: OutputPartViewer = null;

	constructor(premise: GraphicPremise) {
		super();
		this.premise = premise;

		this.topbarPartViewer = new TopbarPartViewer(premise);
		this.outputPartViewer = new OutputPartViewer(premise);
		this.designPartViewer = new DesignPartViewer(premise);

		this.topbarPartViewer.setParent(this);
		this.outputPartViewer.setParent(this);
		this.designPartViewer.setParent(this);

		// Register directors
		this.registerPlotPlanDirector();
		this.registerDesignPartDirector();
		this.registerOutputPartDirector();
		this.registerInputFieldDragDirector();
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

	private registerInputFieldDragDirector(): void {
		let director = new BaseInputFieldDragDirector(this.designPartViewer);
		this.registerDirector(directors.INPUT_FIELD_DRAG_DIRECTOR, director);
	}

	public createControl(parent: Composite, index?: number): void {

		this.composite = new Composite(parent, index);
		let element = this.composite.getElement();
		element.css("border-right", "1px solid #D8D8D8");

		let layout = new GridLayout(2, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createTopbarPartViewer(this.composite);
		this.createOutputPartViewer(this.composite);
		this.createDesignPartViewer(this.composite);

	}

	private createTopbarPartViewer(parent: Composite): void {

		this.topbarPartViewer.createControl(parent);
		let control = this.topbarPartViewer.getControl();

		let element = control.getElement();
		element.css("background-color", "#F8F8F8");
		element.css("border-bottom", "1px solid #E8E8E8");

		let layoutData = new GridData(true, RinjaniPartViewer.TOPBAR_PART_HEIGHT);
		layoutData.horizontalSpan = 2;
		control.setLayoutData(layoutData);

	}

	private createOutputPartViewer(parent: Composite): void {

		this.outputPartViewer.createControl(parent);
		let control = this.outputPartViewer.getControl();

		let layoutData = new GridData(true, true);
		control.setLayoutData(layoutData);

	}

	private createDesignPartViewer(parent: Composite): void {

		this.designPartViewer.createControl(parent);
		let control = this.designPartViewer.getControl();

		let element = control.getElement();
		element.css("border-left", "1px solid #E8E8E8");

		let layoutData = new GridData(RinjaniPartViewer.DESIGN_PART_WIDTH, true);
		control.setLayoutData(layoutData);

	}

	public configure(): void {
		this.topbarPartViewer.setControllerFactory(new TopbarControllerFactory());
		this.outputPartViewer.setControllerFactory(new OutputControllerFactory());
		this.designPartViewer.setControllerFactory(new DesignControllerFactory());
	}

	public postOpen(): void {
		this.configure();
		this.populateRoutine();
		this.initDesignSelection();
	}

	private populateRoutine(): void {
		this.createRoutine((routine: XRoutine, pristine: boolean) => {
			this.designPartViewer.setContents(routine);
			this.topbarPartViewer.setContents(routine);
			this.outputPartViewer.setContents(routine);
			if (pristine) {
				let controller = this.designPartViewer.getRootController();
				let contents = controller.getContents();
				let view = <RoutineDesignView>contents.getView();
				view.promptSelection();
			} else {
				this.refreshResult();
			}
		});
	}

	private createRoutine(callback: (routine: XRoutine, pristine: boolean) => void): void {
		let director = directors.getDesignPartDirector(this.designPartViewer);
		director.createRoutine(callback);
	}

	private refreshResult(): void {

	}

	private initDesignSelection(): void {

	}

	public getControl(): Control {
		return this.composite;
	}

}
