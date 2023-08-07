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

import MessageDialog from "webface/dialogs/MessageDialog";

import * as view from "padang/view/view";
import ViewAction from "padang/view/ViewAction";

import VariableAnatomyView from "padang/view/anatomy/VariableAnatomyView";
import ValueFieldAnatomyView from "padang/view/anatomy/ValueFieldAnatomyView";

import VariableFieldRemoveRequest from "padang/requests/anatomy/VariableFieldRemoveRequest";
import VariableFieldNameListRequest from "padang/requests/anatomy/VariableFieldNameListRequest";

export default class VariableFieldAnatomyView extends ValueFieldAnatomyView {

	private namePart: Composite = null;

	public adjustControl(control: Control): void {
		view.addClass(control, "padang-variable-field-anatomy-view");
	}

	protected createNameControl(parent: Composite): void {
		this.namePart = new Composite(parent);
		view.addClass(this.namePart, "padang-variable-field-anatomy-name-part");
		view.setGridLayout(this.namePart, 1, 0, 0);
	}

	protected getNameControl(): Control {
		return this.namePart;
	}

	protected adjustNameWidth(): number {
		let children = this.namePart.getChildren();
		if (children.length === 1) {
			let child = children[0];
			let panel = <VariableAnatomyView>child.getData();
			return panel.adjustWidth();
		}
		return ValueFieldAnatomyView.MIN_NAME_WIDTH;
	}

	protected getActions(callback: (actions: ViewAction[]) => void): void {
		callback([
			new ViewAction("Remove", () => {
				let request = new VariableFieldNameListRequest();
				this.conductor.submit(request, (names: string[]) => {
					if (names.length === 1) {
						let message = "A project must be containing at least one variable";
						MessageDialog.openError("Remove Error", message);
					} else {
						let request = new VariableFieldRemoveRequest();
						this.conductor.submit(request);
					}
				});
			}, "mdi-playlist-remove")
		]);
	}

	public addView(child: ConductorView, index: number): void {
		if (child instanceof VariableAnatomyView) {
			child.createControl(this.namePart, index);
			view.setGridData(child, true, true);
			view.setControlData(child);
		} else {
			super.addView(child, index);
		}
	}

}
