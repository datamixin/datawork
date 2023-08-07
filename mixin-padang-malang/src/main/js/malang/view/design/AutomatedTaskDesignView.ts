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
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ConductorView from "webface/wef/ConductorView";

import LabelButtonPanel from "webface/ui/LabelButtonPanel";

import * as view from "padang/view/view";

import AutomatedTaskSelectionDialog from "malang/dialogs/AutomatedTaskSelectionDialog";

import AutomatedTaskNameSetRequest from "malang/requests/design/AutomatedTaskNameSetRequest";

export default class AutomatedTaskDesignView extends ConductorView {

	private static SPACING = 10;
	private static LABEL_HEIGHT = 24;
	private static NAME_HEIGHT = 26;

	private composite: Composite = null;
	private namePart: Composite = null;
	private labelPanel: LabelButtonPanel = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);
		view.addClass(this.composite, "malang-algorithm-design-view");
		view.setGridLayout(this.composite, 1, 0, 0, 0, AutomatedTaskDesignView.SPACING);

		this.createNamePart(this.composite);

	}

	private createNamePart(parent: Composite): void {

		this.namePart = new Composite(parent);
		view.addClass(this.namePart, "malang-automated-task-design-name-part");
		view.setGridLayout(this.namePart, 1, 0, 0, 0, 0);
		let height = AutomatedTaskDesignView.LABEL_HEIGHT + AutomatedTaskDesignView.NAME_HEIGHT;
		view.setGridData(this.namePart, true, height);

		this.createNameLabel(this.namePart);
		this.createNameDialogPanel(this.namePart);
	}

	private createNameLabel(parent: Composite): void {
		let label = new Label(parent);
		label.setText("Task:");
		view.css(label, "line-height", AutomatedTaskDesignView.LABEL_HEIGHT + "px");
		view.setGridData(label, true, AutomatedTaskDesignView.LABEL_HEIGHT);
	}

	private createNameDialogPanel(parent: Composite): void {

		this.labelPanel = new LabelButtonPanel();
		this.labelPanel.createControl(parent);
		this.labelPanel.setButtonText("Select...");
		view.css(this.labelPanel, "line-height", "24px");
		view.setGridData(this.labelPanel, true, AutomatedTaskDesignView.NAME_HEIGHT);

		this.labelPanel.setButtonCallback(() => {
			let dialog = new AutomatedTaskSelectionDialog(this.conductor);
			dialog.open((result: string) => {
				if (result === AutomatedTaskSelectionDialog.OK) {
					let selection = dialog.getSelection();
					let request = new AutomatedTaskNameSetRequest(selection);
					this.conductor.submit(request);
				}
			});
		});

		let labelControl = this.labelPanel.getLabelControl();
		view.css(labelControl, "background-color", "#FFFFFF");
	}

	public setLabel(name: string): void {
		this.labelPanel.setLabelText(name);
	}

	public adjustHeight(): number {
		let height = 0;
		height += AutomatedTaskDesignView.LABEL_HEIGHT;
		height += AutomatedTaskDesignView.NAME_HEIGHT;
		return height;
	}

	public getControl(): Control {
		return this.composite;
	}

}
