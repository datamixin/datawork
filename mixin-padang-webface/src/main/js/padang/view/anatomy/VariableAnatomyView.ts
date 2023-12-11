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

import ConductorView from "webface/wef/ConductorView";

import * as functions from "webface/functions";

import LabelTextPanel from "webface/ui/LabelTextPanel";

import MessageDialog from "webface/dialogs/MessageDialog";

import * as view from "padang/view/view";

import * as anatomy from "padang/view/anatomy/anatomy";

import VariableNameSetRequest from "padang/requests/VariableNameSetRequest";
import VariableNameValidationRequest from "padang/requests/VariableNameValidationRequest";

export default class VariableAnatomyView extends ConductorView {

	public static ICON_WIDTH = 30;

	private composite: Composite = null;
	private namePanel = new LabelTextPanel();

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);

		let element = this.composite.getElement();
		element.addClass("padang-variable-anatomy-view");
		element.css("line-height", (anatomy.ITEM_HEIGHT - 2) + "px");

		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);
		this.createNamePanel(this.composite);
	}

	private createNamePanel(parent: Composite): void {
		this.namePanel.createControl(parent);
		this.namePanel.onCommit((newText: string, oldText: string) => {
			let request = new VariableNameValidationRequest(newText);
			this.conductor.submit(request, (message: string) => {
				if (message === null) {
					let request = new VariableNameSetRequest(newText);
					this.conductor.submit(request);
				} else {
					MessageDialog.openError("Name Error", message, () => {
						this.namePanel.setText(oldText);
						this.namePanel.setShowEdit(true);
					});
				}
			});
		});
		view.setGridData(this.namePanel, true, true);
	}


	public setName(text: string): void {
		this.namePanel.setText(text);
	}

	public adjustWidth(): number {
		let text = this.namePanel.getText();
		let control = this.namePanel.getControl();
		return functions.measureTextWidth(control, text);
	}

	public adjustHeight(): number {
		return anatomy.ITEM_HEIGHT;
	}

	public getControl(): Control {
		return this.composite;
	}

}
