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

import ButtonMenuPanel from "bekasi/panels/ButtonMenuPanel";

import * as view from "padang/view/view";

import ViewAction from "padang/view/ViewAction";
import SourcePresentView from "padang/view/present/SourcePresentView";

import SourceFigureAddRequest from "padang/requests/present/SourceFigureAddRequest";
import SourceBuilderAddRequest from "padang/requests/present/SourceBuilderAddRequest";
import PreparationCreateNewRequest from "padang/requests/present/PreparationCreateNewRequest";
import PreparationComposerOpenRequest from "padang/requests/present/PreparationComposerOpenRequest";

export default class PreparationPresentView extends SourcePresentView {

	private composite: Composite = null;
	private preparationPanel: ButtonMenuPanel = null;
	private modelPanel: ButtonMenuPanel = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);

		let element = this.composite.getElement();
		element.addClass("padang-preparation-present-view");

		view.setGridLayout(this.composite, 2, 0, 0, 10, 0);

		this.createPreparationPanel(this.composite);
		this.createFigurePanel(this.composite);
	}

	private createPreparationPanel(parent: Composite): void {
		this.preparationPanel = new ButtonMenuPanel("Preparation...", "mdi-table-edit", "btn-primary")
		this.preparationPanel.createControl(parent);
		this.preparationPanel.onButtonSelection(() => {
			let request = new PreparationComposerOpenRequest();
			this.conductor.submit(request);
		});
		this.preparationPanel.setMenuActions([
			new ViewAction("Create New...", () => {
				let request = new PreparationCreateNewRequest();
				this.conductor.submit(request);
			}, "mdi-table-plus")
		]);
		view.setGridData(this.preparationPanel, SourcePresentView.BUTTON_WIDTH, SourcePresentView.BUTTON_HEIGHT);
	}

	private createFigurePanel(parent: Composite): void {
		let icon = "mdi-cogs";
		let buttonClass = "padang-preparation-present-figure";
		this.modelPanel = new ButtonMenuPanel("Prediction...", icon, buttonClass)
		this.modelPanel.createControl(parent);
		this.modelPanel.onButtonSelection(() => {
			let request = new SourceBuilderAddRequest(SourceBuilderAddRequest.STRUCTURE_MODEL);
			this.conductor.submit(request);
		});
		this.modelPanel.setMenuActions([
			new ViewAction("Exploration...", () => {
				let request = new SourceFigureAddRequest(SourceFigureAddRequest.RENDERER_ROUTINE);
				this.conductor.submit(request);
			}, "mdi-chart-bar"),
			new ViewAction("Visualization...", () => {
				let request = new SourceFigureAddRequest(SourceFigureAddRequest.RENDERER_VISUALIZATION);
				this.conductor.submit(request);
			}, "mdi-chart-areaspline")
		]);
		view.setGridData(this.modelPanel, SourcePresentView.BUTTON_WIDTH, SourcePresentView.BUTTON_HEIGHT);
	}

	public relayout(): void {
		this.composite.relayout();
	}

	public getControl(): Control {
		return this.composite;
	}

}
