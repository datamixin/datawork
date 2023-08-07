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

import BuilderPremise from "padang/ui/BuilderPremise";
import PreformPartViewer from "padang/ui/PreformPartViewer";

import * as directors from "malang/directors";

import TopbarPartViewer from "malang/ui/TopbarPartViewer";
import DesignPartViewer from "malang/ui/DesignPartViewer";
import OutputPartViewer from "malang/ui/OutputPartViewer";
import ExposePartViewer from "malang/ui/ExposePartViewer";

import XModeler from "malang/model/XModeler";
import XBuilder from "padang/model/XBuilder";

import BaseDesignPartDirector from "malang/directors/BaseDesignPartDirector";
import BaseOutputPartDirector from "malang/directors/BaseOutputPartDirector";
import BaseExposePartDirector from "malang/directors/BaseExposePartDirector";
import BaseLibraryPlanDirector from "malang/directors/BaseLibraryPlanDirector";
import BaseAlgorithmPlanDirector from "malang/directors/BaseAlgorithmPlanDirector";
import BasePreprocessingDirector from "malang/directors/BasePreprocessingDirector";
import BaseInputFeatureDragDirector from "malang/directors/BaseInputFeatureDragDirector";
import BaseInstantResultDragDirector from "malang/directors/BaseInstantResultDragDirector";

import TopbarControllerFactory from "malang/controller/topbar/TopbarControllerFactory";
import DesignControllerFactory from "malang/controller/design/DesignControllerFactory";
import OutputControllerFactory from "malang/controller/output/OutputControllerFactory";
import ExposeControllerFactory from "malang/controller/expose/ExposeControllerFactory";

export default class MalangPartViewer extends PreformPartViewer {

	private static TOPBAR_PART_HEIGHT = 56;
	private static DESIGN_PART_WIDTH = 280;
	private static EXPOSE_PART_HEIGHT = 320;

	private premise: BuilderPremise = null;

	private composite: Composite = null;
	private topbarPartViewer: TopbarPartViewer = null;
	private designPartViewer: DesignPartViewer = null;
	private outputExposePart: Composite = null;
	private outputPartViewer: OutputPartViewer = null;
	private exposePartViewer: ExposePartViewer = null;

	constructor(premise: BuilderPremise) {
		super();
		this.premise = premise;

		let builder = <XBuilder>premise.getModel();
		this.topbarPartViewer = new TopbarPartViewer(builder);
		this.outputPartViewer = new OutputPartViewer(builder);
		this.designPartViewer = new DesignPartViewer(builder);
		this.exposePartViewer = new ExposePartViewer(builder);

		this.topbarPartViewer.setParent(this);
		this.outputPartViewer.setParent(this);
		this.designPartViewer.setParent(this);
		this.exposePartViewer.setParent(this);

		// Directors
		this.registerDesignPartDirector();
		this.registerOutputPartDirector();
		this.registerExposePartDirector();
		this.registerLibraryPlanDirector();
		this.registerAlgorithmPlanDirector();
		this.registerPreprocessingDirector();
		this.registerInputFeatureDragDirector();
		this.registerInstantResultDragDirector();
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

	private registerDesignPartDirector(): void {
		let director = new BaseDesignPartDirector(this.designPartViewer, this.premise);
		this.registerDirector(directors.DESIGN_PART_DIRECTOR, director);
	}

	private registerOutputPartDirector(): void {
		let director = new BaseOutputPartDirector(this.outputPartViewer, this.premise);
		this.registerDirector(directors.OUTPUT_PART_DIRECTOR, director);
	}

	private registerExposePartDirector(): void {
		let director = new BaseExposePartDirector(this.exposePartViewer, this.premise);
		this.registerDirector(directors.EXPOSE_PART_DIRECTOR, director);
	}

	private registerInputFeatureDragDirector(): void {
		let director = new BaseInputFeatureDragDirector(this.designPartViewer);
		this.registerDirector(directors.INPUT_FEATURE_DRAG_DIRECTOR, director);
	}

	private registerInstantResultDragDirector(): void {
		let director = new BaseInstantResultDragDirector(this.outputPartViewer);
		this.registerDirector(directors.INSTANT_RESULT_DRAG_DIRECTOR, director);
	}

	public createControl(parent: Composite, index?: number): void {

		this.composite = new Composite(parent, index);
		let element = this.composite.getElement();
		element.css("border-right", "1px solid #D8D8D8");

		let layout = new GridLayout(2, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createTopbarPartViewer(this.composite);
		this.createOutputExposePart(this.composite);
		this.createDesignPartViewer(this.composite);

	}

	private createTopbarPartViewer(parent: Composite): void {

		this.topbarPartViewer.createControl(parent);
		let control = this.topbarPartViewer.getControl();

		let element = control.getElement();
		element.css("background-color", "#F8F8F8");
		element.css("border-bottom", "1px solid #E8E8E8");

		let layoutData = new GridData(true, MalangPartViewer.TOPBAR_PART_HEIGHT);
		layoutData.horizontalSpan = 2;
		control.setLayoutData(layoutData);

	}

	public createOutputExposePart(parent: Composite, index?: number): void {

		this.outputExposePart = new Composite(parent, index);

		let element = this.outputExposePart.getElement();
		element.css("background-color", "#F8F8F8");
		element.css("border-left", "1px solid #E8E8E8");

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.outputExposePart.setLayout(layout);

		this.createOutputPartViewer(this.outputExposePart);
		this.createExposePartViewer(this.outputExposePart);

		let layoutData = new GridData(true, true);
		this.outputExposePart.setLayoutData(layoutData);
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
		element.css("background-color", "#F8F8F8");
		element.css("border-top", "1px solid #E8E8E8");

		let layoutData = new GridData(true, MalangPartViewer.EXPOSE_PART_HEIGHT);
		control.setLayoutData(layoutData);

	}

	private createDesignPartViewer(parent: Composite): void {

		this.designPartViewer.createControl(parent);
		let control = this.designPartViewer.getControl();

		let element = control.getElement();
		element.css("border-left", "1px solid #E8E8E8");

		let layoutData = new GridData(MalangPartViewer.DESIGN_PART_WIDTH, true);
		control.setLayoutData(layoutData);

	}

	public configure(): void {
		this.topbarPartViewer.setControllerFactory(new TopbarControllerFactory());
		this.outputPartViewer.setControllerFactory(new OutputControllerFactory());
		this.designPartViewer.setControllerFactory(new DesignControllerFactory());
		this.exposePartViewer.setControllerFactory(new ExposeControllerFactory());
	}

	public postOpen(): void {
		this.configure();
		this.populateModel();
		this.initDesignSelection();
	}

	private populateModel(): void {
		this.createModel((model: XModeler, pristine: boolean) => {
			this.designPartViewer.setContents(model);
			this.topbarPartViewer.setContents(model);
			this.exposePartViewer.setContents(model);
			this.outputPartViewer.setContents(model);
			if (!pristine) {
				this.refreshResult();
			}
		});
	}

	private createModel(callback: (model: XModeler, pristine: boolean) => void): void {
		let director = directors.getDesignPartDirector(this.designPartViewer);
		director.createModel(callback);
	}

	private refreshResult(): void {

	}

	private initDesignSelection(): void {

	}

	public getControl(): Control {
		return this.composite;
	}

}
