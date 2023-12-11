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

import * as functions from "webface/functions";

import * as view from "padang/view/view";
import LabelPanel from "padang/view/LabelPanel";
import ViewAction from "padang/view/ViewAction";

import ValueFieldAnatomyView from "padang/view/anatomy/ValueFieldAnatomyView";

import PointerFieldActionListRequest from "padang/requests/anatomy/PointerFieldActionListRequest";

export default class PointerFieldAnatomyView extends ValueFieldAnatomyView {

	private namePanel = new LabelPanel();

	protected adjustControl(control: Control): void {
		view.addClass(control, "padang-pointer-field-anatomy-view");
	}

	protected createNameControl(parent: Composite): void {
		this.namePanel.createControl(parent);
		view.addClass(this.namePanel, "padang-pointer-field-anatomy-name-panel");
	}

	protected getNameControl(): Control {
		return this.namePanel.getControl();
	}

	protected adjustNameWidth(): number {
		let text = this.namePanel.getText();
		let control = this.namePanel.getControl();
		return functions.measureTextWidth(control, text);
	}

	protected getActions(callback: (actions: ViewAction[]) => void): void {
		let request = new PointerFieldActionListRequest();
		this.conductor.submit(request, callback);
	}

	public setName(name: string): void {
		this.namePanel.setText(name);
	}

}
