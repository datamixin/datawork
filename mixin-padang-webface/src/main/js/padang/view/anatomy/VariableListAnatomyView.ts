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
import Event from "webface/widgets/Event";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import BaseAction from "webface/wef/base/BaseAction";

import ConductorView from "webface/wef/ConductorView";
import HeightAdjustablePart from "webface/wef/HeightAdjustablePart";

import LiteralFormula from "bekasi/LiteralFormula";

import * as view from "padang/view/view";
import ElementPanel from "padang/view/ElementPanel";
import ViewPopupAction from "padang/view/ViewPopupAction";
import LabelIconPanel from "padang/view/LabelIconPanel";
import OnsideElementPanel from "padang/view/OnsideElementPanel";
import ScrollableListPanel from "padang/panels/ScrollableListPanel";

import * as anatomy from "padang/view/anatomy/anatomy";

import FunctionEditorDialog from "padang/dialogs/FormulaEditorDialog";
import PointerSelectionDialog from "padang/dialogs/PointerSelectionDialog";

import VariableListFormulaAddRequest from "padang/requests/anatomy/VariableListFormulaAddRequest";

export default class VariableListAnatomyView extends ConductorView implements HeightAdjustablePart {

	private static HEADER_HEIGHT = 24;
	private static LABEL_HEIGHT = 32;

	private composite: Composite = null;
	private headerPanel = new LabelIconPanel();
	private containerPanel = new ScrollableListPanel(anatomy.ITEM_HEIGHT);

	public createControl(parent: Composite, index: number): void {
		this.composite = new Composite(parent, index);
		view.addClass(this.composite, "padang-variable-list-anatomy-view");
		view.setGridLayout(this.composite, 1, 5, 5, 0, 0);
		this.createHeaderPanel(this.composite);
		this.createContainerPanel(this.composite);
	}

	private createHeaderPanel(parent: Composite): void {
		this.headerPanel.createControl(parent);
		this.headerPanel.setLabel("Variables");
		this.headerPanel.setLabelIndent(5);
		this.headerPanel.setIcon("mdi-menu");
		this.headerPanel.setOnIconSelection((event: Event) => {
			let actions = [
				new SelectPointerAction(this.conductor),
				new AddFormulaAction(this.conductor)
			];
			let action = new ViewPopupAction(actions);
			action.open(event);
		});
		view.css(this.headerPanel, "line-height", VariableListAnatomyView.HEADER_HEIGHT + "px");
		view.setGridData(this.headerPanel, true, VariableListAnatomyView.HEADER_HEIGHT);
	}

	private createContainerPanel(parent: Composite): void {

		this.containerPanel.createControl(parent);
		view.addClass(this.containerPanel, "padang-variable-list-anatomy-container-panel");
		this.containerPanel.setOnNewPanel((child: ConductorView): ElementPanel => {

			// Buat element panel untuk menampung view
			let panel = new OnsideElementPanel(child, anatomy.ITEM_HEIGHT);
			panel.setOnLabel((index: number) => {
				return index + 1;
			});
			return panel;
		});

		view.setGridData(this.containerPanel, true, true);
	}

	public adjustHeight(): number {
		let height = view.getGridLayoutHeight(this.composite, [VariableListAnatomyView.LABEL_HEIGHT]);
		height += view.adjustGridDataHeight(this.containerPanel);
		return height + 1;
	}

	public getControl(): Control {
		return this.composite;
	}

	public addView(child: ConductorView, index: number): void {
		this.containerPanel.addView(child, index);
	}

	public moveView(child: ConductorView, index: number): void {
		this.containerPanel.moveView(child, index);
	}

	public removeView(child: ConductorView): void {
		this.containerPanel.removeView(child);
	}

}

class SelectPointerAction extends BaseAction {

	public getText(): string {
		return "Select Variable...";
	}

	public run(): void {
		let dialog = new PointerSelectionDialog(this.conductor);
		dialog.open((result: string) => {
			if (result === PointerSelectionDialog.OK) {
				let literal = dialog.getLiteral();
				let request = new VariableListFormulaAddRequest(literal);
				this.conductor.submit(request);
			}
		});
	}

}

class AddFormulaAction extends BaseAction {

	public getText(): string {
		return "Add Formula..."
	}

	public run(): void {
		let formula = new LiteralFormula("=GenerateDataset((x) -> x * x, -10, 10)");
		let dialog = new FunctionEditorDialog(this.conductor, formula);
		dialog.open((result: string) => {
			if (result === PointerSelectionDialog.OK) {
				let formula = dialog.getFormula();
				let request = new VariableListFormulaAddRequest(formula.literal);
				this.conductor.submit(request);
			}
		});
		dialog.updatePageComplete();
	}

}
