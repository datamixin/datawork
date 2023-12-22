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
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ConductorView from "webface/wef/ConductorView";

import LabelButtonPanel from "webface/ui/LabelButtonPanel";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import * as view from "padang/view/view";

import RoutineNameSetRequest from "rinjani/requests/design/RoutineNameSetRequest";
import RoutineSourceNameRequest from "rinjani/requests/design/RoutineSourceNameRequest";

import RoutineSelectionDialog from "rinjani/dialogs/RoutineSelectionDialog";

export default class RoutineDesignView extends ConductorView {

	private static MARGIN_HEIGHT = 10;
	private static VERTICAL_SPACING = 20;
	private static ROUTINE_LABEL_HEIGHT = 24;
	private static ROUTINE_NAME_HEIGHT = 26;

	private composite: Composite = null;
	private namePart: Composite = null;
	private namePanel: LabelButtonPanel = null;
	private container: Composite = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);

		let element = this.composite.getElement();
		element.addClass("rinjani-routine-design-view");

		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);
		this.createNamePart(this.composite);
		this.createContainer(this.composite);

	}

	private createNamePart(parent: Composite): void {
		this.namePart = new Composite(parent);
		view.setGridLayout(this.namePart, 1, 10, RoutineDesignView.MARGIN_HEIGHT, 0, 0);
		let height = RoutineDesignView.MARGIN_HEIGHT * 2;
		height += RoutineDesignView.ROUTINE_LABEL_HEIGHT;
		height += RoutineDesignView.ROUTINE_NAME_HEIGHT;
		view.setGridData(this.namePart, true, height);
		this.createNameLabel(this.namePart);
		this.createNameDialogPanel(this.namePart);
	}

	private createNameLabel(parent: Composite): void {
		let label = new Label(parent);
		label.setText("Routine:");
		view.setGridData(label, true, RoutineDesignView.ROUTINE_LABEL_HEIGHT);
	}

	private createNameDialogPanel(parent: Composite): void {

		this.namePanel = new LabelButtonPanel();
		this.namePanel.createControl(parent);
		this.namePanel.setButtonText("Select...");
		view.css(this.namePanel, "line-height", "24px");
		view.setGridData(this.namePanel, true, RoutineDesignView.ROUTINE_NAME_HEIGHT);

		this.namePanel.setButtonCallback(() => {
			this.promptSelection();
		});

		let labelControl = this.namePanel.getLabelControl();
		view.css(labelControl, "background-color", "#FFFFFF");
	}

	private createContainer(parent: Composite): void {
		this.container = new Composite(parent);
		view.addClass(this.container, "rinjani-routine-design-container");
		view.setGridLayout(this.container, 1, 10, 5, 0, RoutineDesignView.VERTICAL_SPACING);
		view.setGridData(this.container, true, true);
	}

	public setName(name: string): void {
		this.namePanel.setLabelText(name);
	}

	public adjustHeight(): number {
		let part = new GridCompositeAdjuster(this.container);
		return part.adjustHeight();
	}

	public promptSelection(): void {
		let request = new RoutineSourceNameRequest();
		this.conductor.submit(request, (_source: string) => {
			let dialog = new RoutineSelectionDialog(this.conductor);
			dialog.open((result: string) => {
				if (result === RoutineSelectionDialog.OK) {
					let selection = dialog.getSelection();
					let request = new RoutineNameSetRequest(selection);
					this.conductor.submit(request);
				}
			});
		});
	}

	public getControl(): Control {
		return this.composite;
	}

	public addView(child: ConductorView, index: number): void {
		child.createControl(this.container, index);
		view.setGridData(child, true, 0);
	}

	public removeView(child: ConductorView): void {
		view.dispose(child);
	}

}
