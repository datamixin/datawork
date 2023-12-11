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

import BaseAction from "webface/wef/base/BaseAction";

import ConductorPanel from "webface/wef/ConductorPanel";

import WebFontImage from "webface/graphics/WebFontImage";

import LiteralFormula from "bekasi/LiteralFormula";

import * as view from "padang/view/view";

import GuideItemPanel from "padang/panels/GuideItemPanel";

import PresentToolPanel from "padang/view/present/PresentToolPanel";

import FormulaEditorDialog from "padang/dialogs/FormulaEditorDialog";
import OutcomeFormulaSelectionDialog from "padang/dialogs/OutcomeFormulaSelectionDialog";

import FigureCreateRequest from "padang/requests/FigureCreateRequest";
import OutcomeCreateRequest from "padang/requests/OutcomeCreateRequest";
import OutcomeFormulaListRequest from "padang/requests/OutcomeFormulaListRequest";

import CellRemoveRequest from "padang/requests/present/CellRemoveRequest";

export default class CellGuidePanel extends ConductorPanel {

	private static ITEM_HEIGHT = 48;

	private composite: Composite = null;
	private toolPanel: PresentToolPanel = null;
	private container: Composite = null;

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		view.addClass(this.composite, "padang-cell-guide-panel");
		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);

		this.createToolPanel(this.composite);
		this.createContainer(this.composite);
	}

	private createToolPanel(parent: Composite): void {

		this.toolPanel = new PresentToolPanel(this.conductor);
		this.toolPanel.createControl(parent);

		view.setGridData(this.toolPanel, true, PresentToolPanel.HEIGHT);

		let removeAction = new CellRemoveAction(this.conductor);
		this.toolPanel.addMenuItem(removeAction);
		this.toolPanel.setIconPartVisible(true);
		this.toolPanel.setTypeIcon("mdi-application-outline");
	}

	private createContainer(parent: Composite): void {

		this.container = new Composite(parent);

		view.addClass(this.container, "padang-cell-guide-container");
		view.css(this.container, "border-top", "1px solid #E8E8E8");
		view.setGridLayout(this.container, 1, 40, 40, 10, 10);
		view.setGridData(this.container, true, true);

		this.createOutcomePart(this.container);
		this.createVisualizationPart(this.container);
		this.createRoutinePart(this.container);
	}

	private createOutcomePart(parent: Composite): void {
		let panel = new GuideItemPanel(this.conductor);
		panel.createControl(parent);
		panel.setLabel("Outcome");
		panel.setIcon("mdi-application-variable-outline");
		panel.setDescription("Create new outcome from composed formula");
		panel.setOnSelection(() => {
			let request = new OutcomeFormulaListRequest();
			this.conductor.submit(request, (names: Map<string, string>) => {
				let zero = "=0";
				if (names.size > 0) {
					let dialog = new OutcomeFormulaSelectionDialog(this.conductor);
					dialog.open((result: string) => {
						if (result === OutcomeFormulaSelectionDialog.OK) {
							let formula = dialog.getSelection();
							let request = new OutcomeCreateRequest(formula);
							this.conductor.submit(request);
						} else if (result === OutcomeFormulaSelectionDialog.EDIT) {
							let literal = dialog.getSelection();
							if (literal === null) {
								literal = zero;
							}
							this.openFormulaEditorDialog(literal);
						}
					});
				} else {
					this.openFormulaEditorDialog(zero);
				}
			});
		});
		view.setGridData(panel, true, CellGuidePanel.ITEM_HEIGHT);
	}

	private openFormulaEditorDialog(literal: string): void {
		let formula = new LiteralFormula(literal);
		let editor = new FormulaEditorDialog(this.conductor, formula);
		editor.open((result: string) => {
			if (result === FormulaEditorDialog.OK) {
				let formula = editor.getFormula();
				let request = new OutcomeCreateRequest(formula.literal);
				this.conductor.submit(request);
			}
		});
	}

	private createVisualizationPart(parent: Composite): void {
		let panel = new GuideItemPanel(this.conductor);
		panel.createControl(parent);
		panel.setLabel("Data Visualization");
		panel.setIcon("mdi-chart-box-outline");
		panel.setDescription("Create new data visualization from existing dataset");
		panel.setOnSelection(() => {
			let request = new FigureCreateRequest(FigureCreateRequest.RENDERER_VISUALIZATION);
			this.conductor.submit(request);
		});
		view.setGridData(panel, true, CellGuidePanel.ITEM_HEIGHT);
	}

	private createRoutinePart(parent: Composite): void {
		let panel = new GuideItemPanel(this.conductor);
		panel.createControl(parent);
		panel.setLabel("Visualization Routine");
		panel.setIcon("mdi-chart-areaspline");
		panel.setDescription("Create new visualization routine from existing dataset");
		panel.setOnSelection(() => {
			let request = new FigureCreateRequest(FigureCreateRequest.RENDERER_ROUTINE);
			this.conductor.submit(request);
		});
		view.setGridData(panel, true, CellGuidePanel.ITEM_HEIGHT);
	}

	public getControl(): Control {
		return this.composite;
	}

}


class CellRemoveAction extends BaseAction {

	public getText(): string {
		return "Remove Cell";
	}

	public getImage(): WebFontImage {
		return new WebFontImage("mdi", "mdi-close");
	}

	public run(): void {
		let request = new CellRemoveRequest();
		this.conductor.submit(request);
	}

}
