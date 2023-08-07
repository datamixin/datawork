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

import ConductorView from "webface/wef/ConductorView";

import LabelTextPanel from "webface/ui/LabelTextPanel";

import MessageDialog from "webface/dialogs/MessageDialog";

import * as view from "padang/view/view";
import MenuPanel from "padang/view/MenuPanel";
import ViewAction from "padang/view/ViewAction";
import FormulaPanel from "padang/view/FormulaPanel";

import InputSelectRequest from "padang/requests/overtop/InputSelectRequest";
import InputRemoveRequest from "padang/requests/overtop/InputRemoveRequest";
import InputNameSetRequest from "padang/requests/overtop/InputNameSetRequest";
import InputNameValidationRequest from "padang/requests/overtop/InputNameValidationRequest";

export default class InputOvertopView extends ConductorView {

	private static HEIGHT = 30;

	private static LABEL_WIDTH = 120;

	private composite: Composite = null;
	private namePanel = new LabelTextPanel();
	private valuePanel: FormulaPanel = null;
	private menuPanel = new MenuPanel();

	public createControl(parent: Composite, index: number): void {
		this.composite = new Composite(parent, index);
		view.addClass(this.composite, "padang-input-overtop-view");
		view.css(this.composite, "line-height", (InputOvertopView.HEIGHT - 2) + "px");
		view.setGridLayout(this.composite, 3, 0, 0, 0,);
		this.createNamePanel(this.composite);
		this.createLiteralPanel(this.composite);
		this.createMenuPanel(this.composite);
		this.composite.onSelection(() => {
			let request = new InputSelectRequest();
			this.conductor.submit(request);
		});
	}

	private createNamePanel(parent: Composite): void {
		this.namePanel.createControl(parent);
		this.namePanel.onCommit((newText: string, oldText: string) => {
			let request = new InputNameValidationRequest(newText);
			this.conductor.submit(request, (message: string) => {
				if (message === null) {
					let request = new InputNameSetRequest(newText);
					this.conductor.submit(request);
				} else {
					MessageDialog.openError("Input Name Error", message, () => {
						this.namePanel.setText(oldText);
						this.namePanel.setShowEdit(true);
					});
				}
			});
		});
		view.setGridData(this.namePanel, InputOvertopView.LABEL_WIDTH, true);
	}

	private createLiteralPanel(parent: Composite): void {
		this.valuePanel = new FormulaPanel(this.conductor);
		this.valuePanel.createControl(parent);
		view.setGridData(this.valuePanel, true, true);
	}

	private createMenuPanel(parent: Composite): void {
		this.menuPanel.createControl(parent);
		this.menuPanel.setActions([
			new ViewAction("Remove", () => {
				let request = new InputRemoveRequest();
				this.conductor.submit(request);
			}, "mdi-trash-can-outline")
		]);
		view.setGridData(this.menuPanel, InputOvertopView.HEIGHT, true);
	}

	public setName(name: string): void {
		this.namePanel.setText(name);
	}

	public setValue(value: string): void {
		this.valuePanel.setFormula(value);
	}

	public setSelected(selected: boolean): void {
		view.setSelected(this.composite, selected);
	}

	public adjustHeight(): number {
		return InputOvertopView.HEIGHT;
	}

	public getControl(): Control {
		return this.composite;
	}

}
