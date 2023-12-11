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
import * as wef from "webface/wef";

import EObject from "webface/model/EObject";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import * as functions from "webface/wef/functions";

import SelectionChangedEvent from "webface/viewers/SelectionChangedEvent";
import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

import GraphicPremise from "padang/ui/GraphicPremise";
import PreformPartViewer from "padang/ui/PreformPartViewer";

import XOutlook from "vegazoo/model/XOutlook";
import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";

import * as directors from "vegazoo/directors";

import TopbarPartViewer from "vegazoo/ui/TopbarPartViewer";
import DesignPartViewer from "vegazoo/ui/DesignPartViewer";
import CustomPartViewer from "vegazoo/ui/CustomPartViewer";
import OutputPartViewer from "vegazoo/ui/OutputPartViewer";

import BaseDesignPartDirector from "vegazoo/directors/BaseDesignPartDirector";
import BaseCustomPartDirector from "vegazoo/directors/BaseCustomPartDirector";
import BaseOutputPartDirector from "vegazoo/directors/BaseOutputPartDirector";
import BaseFieldDefDragDirector from "vegazoo/directors/BaseFieldDefDragDirector";

import TopbarControllerFactory from "vegazoo/controller/topbar/TopbarControllerFactory";
import DesignControllerFactory from "vegazoo/controller/design/DesignControllerFactory";
import CustomControllerFactory from "vegazoo/controller/custom/CustomControllerFactory";
import OutputControllerFactory from "vegazoo/controller/output/OutputControllerFactory";

import TopLevelSpecDesignController from "vegazoo/controller/design/TopLevelSpecDesignController";

export default class VegazooPartViewer extends PreformPartViewer {

	private static TOPBAR_PART_HEIGHT = 56;
	private static CUSTOM_PART_HEIGHT = 300;
	private static DESIGN_CUSTOM_PART_WIDTH = 260;

	private premise: GraphicPremise = null;

	private composite: Composite = null;
	private designCustomPart: Composite = null;
	private topbarPartViewer: TopbarPartViewer = null;
	private designPartViewer: DesignPartViewer = null;
	private customPartViewer: CustomPartViewer = null;
	private outputPartViewer: OutputPartViewer = null;

	constructor(premise: GraphicPremise) {
		super();
		this.premise = premise;

		this.topbarPartViewer = new TopbarPartViewer(premise);
		this.outputPartViewer = new OutputPartViewer(premise);
		this.designPartViewer = new DesignPartViewer(premise);
		this.customPartViewer = new CustomPartViewer(premise);

		this.topbarPartViewer.setParent(this);
		this.outputPartViewer.setParent(this);
		this.designPartViewer.setParent(this);
		this.customPartViewer.setParent(this);

		// Register directors
		this.registerDesignPartDirector();
		this.registerCustomPartDirector();
		this.registerOutputPartDirector();
		this.registerFieldDefDragDirector();
	}

	private registerDesignPartDirector(): void {
		let director = new BaseDesignPartDirector(this.designPartViewer, this.premise);
		this.registerDirector(directors.DESIGN_PART_DIRECTOR, director);
	}

	private registerCustomPartDirector(): void {
		let director = new BaseCustomPartDirector(this.customPartViewer);
		this.registerDirector(directors.CUSTOM_PART_DIRECTOR, director);
	}

	private registerOutputPartDirector(): void {
		let director = new BaseOutputPartDirector(this.outputPartViewer, this.premise);
		this.registerDirector(directors.OUTPUT_PART_DIRECTOR, director);
	}

	private registerFieldDefDragDirector(): void {
		let director = new BaseFieldDefDragDirector(this.designPartViewer);
		this.registerDirector(directors.POSITION_FIELD_DEF_DRAG_DIRECTOR, director);
	}

	public createControl(parent: Composite, index?: number): void {

		this.composite = new Composite(parent, index);
		let element = this.composite.getElement();
		element.css("border-right", "1px solid #D8D8D8");

		let layout = new GridLayout(2, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createTopbarPartViewer(this.composite);
		this.createOutputPartViewer(this.composite);
		this.createDesignCustomPart(this.composite);

	}

	private createTopbarPartViewer(parent: Composite): void {

		this.topbarPartViewer.createControl(parent);
		let control = this.topbarPartViewer.getControl();

		let element = control.getElement();
		element.css("background-color", "#F8F8F8");
		element.css("border-bottom", "1px solid #E8E8E8");

		let layoutData = new GridData(true, VegazooPartViewer.TOPBAR_PART_HEIGHT);
		layoutData.horizontalSpan = 2;
		control.setLayoutData(layoutData);

	}

	private createOutputPartViewer(parent: Composite): void {

		this.outputPartViewer.createControl(parent);
		let control = this.outputPartViewer.getControl();

		let layoutData = new GridData(true, true);
		control.setLayoutData(layoutData);

	}

	public createDesignCustomPart(parent: Composite, index?: number): void {

		this.designCustomPart = new Composite(parent, index);

		let element = this.designCustomPart.getElement();
		element.css("background-color", "#F8F8F8");
		element.css("border-left", "1px solid #D8D8D8");

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.designCustomPart.setLayout(layout);

		this.createDesignPartViewer(this.designCustomPart);
		this.createCustomPartViewer(this.designCustomPart);

		let layoutData = new GridData(VegazooPartViewer.DESIGN_CUSTOM_PART_WIDTH, true);
		this.designCustomPart.setLayoutData(layoutData);
	}

	private createDesignPartViewer(parent: Composite): void {

		this.designPartViewer.createControl(parent);
		let control = this.designPartViewer.getControl();

		let layoutData = new GridData(true, true);
		control.setLayoutData(layoutData);

	}

	private createCustomPartViewer(parent: Composite): void {

		this.customPartViewer.createControl(parent);
		let control = this.customPartViewer.getControl();

		let layoutData = new GridData(true, VegazooPartViewer.CUSTOM_PART_HEIGHT);
		control.setLayoutData(layoutData);

	}

	public configure(): void {
		this.topbarPartViewer.setControllerFactory(new TopbarControllerFactory());
		this.outputPartViewer.setControllerFactory(new OutputControllerFactory());
		this.designPartViewer.setControllerFactory(new DesignControllerFactory());
		this.customPartViewer.setControllerFactory(new CustomControllerFactory());
	}

	public postOpen(): void {
		this.configure();
		this.wireDesignCustomSelection();
		this.wireDesignOutputSelection();
		this.wireOutputDesignSelection();
		this.populateDesignOutput();
		this.initDesignSelection();
	}

	private populateDesignOutput(): void {
		let outlook = this.createOutlook();
		this.topbarPartViewer.setContents(outlook);
		this.designPartViewer.setContents(outlook);
		this.outputPartViewer.setContents(outlook);
	}

	private createOutlook(): XOutlook {
		let director = directors.getDesignPartDirector(this.designPartViewer);
		let outlook = director.createOutlook();
		return outlook;
	}

	private wireDesignCustomSelection(): void {
		let director = wef.getSelectionDirector(this.designPartViewer);
		director.addSelectionChangedListener(<SelectionChangedListener>{
			selectionChanged: (event: SelectionChangedEvent) => {
				let selection = event.getSelection();
				if (selection.isEmpty() === false) {
					let controller = selection.getFirstElement();
					let model = controller.getModel();
					this.customPartViewer.setContents(model);
				}
			}
		})
	}

	private wireDesignOutputSelection(): void {
		let director = wef.getSelectionDirector(this.designPartViewer);
		director.addSelectionChangedListener(<SelectionChangedListener>{
			selectionChanged: (event: SelectionChangedEvent) => {
				let selection = event.getSelection();
				if (selection.isEmpty() === false) {
					let controller = selection.getFirstElement();
					let model = <EObject>controller.getModel();
					let rootController = this.outputPartViewer.getRootController();
					let target = functions.getFirstDescendantByModel(rootController, model);
					let director = wef.getSelectionDirector(this.outputPartViewer);
					if (target !== null) {
						director.select(target);
					} else {
						director.clear();
					}
				}
			}
		})
	}

	private wireOutputDesignSelection(): void {
		let director = wef.getSelectionDirector(this.outputPartViewer);
		director.addSelectionChangedListener(<SelectionChangedListener>{
			selectionChanged: (event: SelectionChangedEvent) => {
				let selection = event.getSelection();
				if (selection.isEmpty() === false) {
					let controller = selection.getFirstElement();
					let model = <EObject>controller.getModel();
					let rootController = this.designPartViewer.getRootController();
					let target = functions.getFirstDescendantByModel(rootController, model);
					if (target !== null) {
						let director = wef.getSelectionDirector(this.designPartViewer);
						director.select(target);
					}
				}
			}
		})
	}

	private initDesignSelection(): void {
		let controller = this.designPartViewer.getRootController();
		let contents = controller.getContents();
		let spec = functions.getFirstDescendantByModelClass(contents, XTopLevelSpec);
		if (spec instanceof TopLevelSpecDesignController) {
			spec.refreshSelection();
		}
	}

	public getControl(): Control {
		return this.composite;
	}

}
