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
import Panel from "webface/wef/Panel";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ConductorView from "webface/wef/ConductorView";

import ButtonMenuPanel from "bekasi/panels/ButtonMenuPanel";

import * as view from "padang/view/view";
import LabelPanel from "padang/view/LabelPanel";

import PredictionTryoutDialog from "padang/dialogs/PredictionTryoutDialog";

import BuilderComposerOpenRequest from "padang/requests/present/BuilderComposerOpenRequest";

export default class BuilderPresentView extends ConductorView {

	private static TITLE_HEIGHT = 30;
	private static HEADER_HEIGHT = 50;
	private static BUTTON_WIDTH = 160;

	private composite: Composite = null;
	private headerPart: Composite = null;
	private titlePanel: LabelPanel = null;
	private composePanel: ButtonMenuPanel = null;
	private tryoutPanel: ButtonMenuPanel = null;
	private structurePart: Composite = null;
	private structurePanel: Panel = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);

		let element = this.composite.getElement();
		element.addClass("padang-builder-present-view");
		element.css("background", "#FFF");

		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);
		this.createHeaderPart(this.composite);
		this.createStructurePart(this.composite);

	}

	private createHeaderPart(parent: Composite): void {

		this.headerPart = new Composite(parent);
		view.css(this.headerPart, "border-bottom", "1px solid #E8E8E8");
		view.setGridLayout(this.headerPart, 3, 10, 10, 10, 0);
		view.setGridData(this.headerPart, true, BuilderPresentView.HEADER_HEIGHT);

		this.createTitlePanel(this.headerPart);
		this.createComposePanel(this.headerPart);
		this.createTryoutPanel(this.headerPart);
	}

	private createTitlePanel(parent: Composite): void {
		this.titlePanel = new LabelPanel();
		this.titlePanel.createControl(parent);
		this.titlePanel.setText("Model Builder");
		this.titlePanel.setLineHeight(BuilderPresentView.TITLE_HEIGHT);
		view.setGridData(this.titlePanel, true, true);
	}

	private createComposePanel(parent: Composite): void {
		this.composePanel = new ButtonMenuPanel("Prediction...", "mdi-office-building-cog-outline", "btn-primary")
		this.composePanel.createControl(parent);
		this.composePanel.onButtonSelection(() => {
			let request = new BuilderComposerOpenRequest();
			this.conductor.submit(request);
		});
		this.composePanel.setMenuActions([
		]);
		view.setGridData(this.composePanel, BuilderPresentView.BUTTON_WIDTH, true);
	}

	private createTryoutPanel(parent: Composite): void {
		let icon = "mdi-form-select";
		let buttonClass = "padang-builder-present-tryout";
		this.tryoutPanel = new ButtonMenuPanel("Tryout...", icon, buttonClass);
		this.tryoutPanel.createControl(parent);
		this.tryoutPanel.onButtonSelection(() => {
			let dialog = new PredictionTryoutDialog(this.conductor);
			dialog.open((_result: string) => {

			});
		});
		this.tryoutPanel.setMenuActions([
		]);
		view.setGridData(this.tryoutPanel, BuilderPresentView.BUTTON_WIDTH, true);
	}

	private createStructurePart(parent: Composite): void {
		this.structurePart = new Composite(parent);
		view.setGridLayout(this.structurePart, 1, 5, 5, 0, 0);
		view.setGridData(this.structurePart, true, true);
	}

	public setStructurePanel(panel: Panel): void {

		if (this.structurePanel !== null) {
			let control = this.structurePanel.getControl();
			control.dispose();
		}

		panel.createControl(this.structurePart);
		let control = panel.getControl();

		view.setGridData(control, true, true);

		this.structurePanel = panel;
		this.structurePart.relayout();

	}

	public relayout(): void {
		this.composite.relayout();
	}

	public getControl(): Control {
		return this.composite;
	}

}
