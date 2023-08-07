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

import ButtonPanel from "bekasi/panels/ButtonPanel";
import ButtonMenuPanel from "bekasi/panels/ButtonMenuPanel";

import * as view from "padang/view/view";

import SourcePresentView from "padang/view/present/SourcePresentView";

import SourceFigureAddRequest from "padang/requests/present/SourceFigureAddRequest";

export default class IngestionPresentView extends SourcePresentView {

	private composite: Composite = null;
	private ingestionPanel: ButtonPanel = null;
	private preparePanel: ButtonPanel = null;
	private visualizePanel: ButtonMenuPanel = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);

		let element = this.composite.getElement();
		element.addClass("padang-ingestion-present-view");

		view.setGridLayout(this.composite, 3, 0, 0, 10, 0);

		this.createIngestionPanel(this.composite);
		this.createPreparePanel(this.composite);
		this.createVisualizePanel(this.composite);
	}

	private createIngestionPanel(parent: Composite): void {
		this.ingestionPanel = new ButtonPanel("Ingestion...", "mdi-file-table-outline", "btn-primary")
		this.ingestionPanel.createControl(parent);
		view.setGridData(this.ingestionPanel, SourcePresentView.BUTTON_WIDTH, SourcePresentView.BUTTON_HEIGHT);
	}

	private createPreparePanel(parent: Composite): void {
		this.preparePanel = new ButtonPanel("Prepare...", "mdi-table-plus", "btn-success")
		this.preparePanel.createControl(parent);
		view.setGridData(this.preparePanel, SourcePresentView.BUTTON_WIDTH, SourcePresentView.BUTTON_HEIGHT);
	}

	private createVisualizePanel(parent: Composite): void {
		let icon = "mdi-chart-areaspline";
		let buttonClass = "padang-ingestion-present-visualization";
		this.visualizePanel = new ButtonMenuPanel("Visualization...", icon, buttonClass)
		this.visualizePanel.createControl(parent);
		this.visualizePanel.onButtonSelection(() => {
			let request = new SourceFigureAddRequest(SourceFigureAddRequest.RENDERER_VISUALIZATION);
			this.conductor.submit(request);
		});
		view.setGridData(this.visualizePanel, SourcePresentView.BUTTON_WIDTH, SourcePresentView.BUTTON_HEIGHT);
	}

	public relayout(): void {
		this.composite.relayout();
	}

	public getControl(): Control {
		return this.composite;
	}

}
