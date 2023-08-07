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

import BasePartViewer from "webface/wef/base/BasePartViewer";

import * as directors from "padang/directors";

import XPreparation from "padang/model/XPreparation";

import ToolsetPartViewer from "padang/ui/ToolsetPartViewer";
import PreparePartViewer from "padang/ui/PreparePartViewer";

import ToolsetControllerFactory from "padang/controller/toolset/ToolsetControllerFactory";
import PrepareControllerFactory from "padang/controller/prepare/PrepareControllerFactory";

import BasePreparationMutationDirector from "padang/directors/BasePreparationMutationDirector";

export default class PreparationFullDeckComposer extends BasePartViewer {

	private static TOOLSET_HEIGHT = 56;

	private preparation: XPreparation = null;
	private composite: Composite = null;

	private toolsetPartViewer = new ToolsetPartViewer();
	private preparePartViewer = new PreparePartViewer();

	constructor(preparation: XPreparation) {
		super();
		this.preparation = preparation;
		this.toolsetPartViewer.setParent(this);
		this.preparePartViewer.setParent(this);
		this.registerPreparationMutationDirector();
	}

	private registerPreparationMutationDirector(): void {
		let director = new BasePreparationMutationDirector(this.preparePartViewer);
		this.registerDirector(directors.PREPARATION_MUTATION_DIRECTOR, director);
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("preparation-composer");
		element.css("background", "#F8F8F8");
		element.css("border", "1px solid #E8E8E8");

		let layout = new GridLayout(1, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createToolsetPart(this.composite);
		this.createPreparePartViewer(this.composite);
	}

	private createToolsetPart(parent: Composite): void {

		let toolsetPart = new Composite(parent);

		let element = toolsetPart.getElement();
		element.css("border-bottom", "1px solid #D8D8D8");

		let layout = new GridLayout(1, 5, 4);
		toolsetPart.setLayout(layout);

		let layoutData = new GridData(true, PreparationFullDeckComposer.TOOLSET_HEIGHT);
		toolsetPart.setLayoutData(layoutData);

		this.createToolsetPartViewer(toolsetPart);
	}

	private createToolsetPartViewer(parent: Composite): void {
		this.toolsetPartViewer.createControl(parent);
		let control = this.toolsetPartViewer.getControl();
		let layoutData = new GridData(true, true);
		control.setLayoutData(layoutData);
	}

	private createPreparePartViewer(parent: Composite): void {

		this.preparePartViewer.createControl(parent);
		let control = this.preparePartViewer.getControl();

		let layoutData = new GridData(true, true);
		control.setLayoutData(layoutData);
	}

	public configure(): void {
		this.toolsetPartViewer.setControllerFactory(new ToolsetControllerFactory());
		this.preparePartViewer.setControllerFactory(new PrepareControllerFactory());
		this.populateContents();
	}

	private populateContents(): void {
		let display = this.preparation.getDisplay();
		this.toolsetPartViewer.setContents(display);
		this.preparePartViewer.setContents(this.preparation);
	}

	public getControl(): Control {
		return this.composite;
	}

}