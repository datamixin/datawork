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

import * as view from "padang/view/view";

import LibrarySelectionDialog from "malang/dialogs/LibrarySelectionDialog";

import LibraryNameSetRequest from "malang/requests/design/LibraryNameSetRequest";

export default class LibraryDesignView extends ConductorView {

	private static SPACING = 10;
	private static LABEL_HEIGHT = 24;
	private static NAME_HEIGHT = 26;

	private composite: Composite = null;
	private namePart: Composite = null;
	private namePanel: LabelButtonPanel = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);
		view.addClass(this.composite, "malang-library-design-view");
		view.setGridLayout(this.composite, 1, 0, 0, 0, LibraryDesignView.SPACING);

		this.createNamePart(this.composite);

	}

	private createNamePart(parent: Composite): void {

		this.namePart = new Composite(parent);
		view.addClass(this.namePart, "malang-library-design-name-part");
		view.setGridLayout(this.namePart, 1, 0, 0, 0, 0);
		let height = LibraryDesignView.LABEL_HEIGHT + LibraryDesignView.NAME_HEIGHT;
		view.setGridData(this.namePart, true, height);

		this.createNameLabel(this.namePart);
		this.createNameDialogPanel(this.namePart);
	}

	private createNameLabel(parent: Composite): void {
		let label = new Label(parent);
		label.setText("Library:");
		view.css(label, "line-height", LibraryDesignView.LABEL_HEIGHT + "px");
		view.setGridData(label, true, LibraryDesignView.LABEL_HEIGHT);
	}

	private createNameDialogPanel(parent: Composite): void {

		this.namePanel = new LabelButtonPanel();
		this.namePanel.createControl(parent);
		this.namePanel.setButtonText("Select...");
		view.css(this.namePanel, "line-height", "24px");
		view.setGridData(this.namePanel, true, LibraryDesignView.NAME_HEIGHT);

		this.namePanel.setButtonCallback(() => {
			let dialog = new LibrarySelectionDialog(this.conductor);
			dialog.open((result: string) => {
				if (result === LibrarySelectionDialog.OK) {
					let selection = dialog.getSelection();
					let request = new LibraryNameSetRequest(selection);
					this.conductor.submit(request);
				}
			});
		});

		let labelControl = this.namePanel.getLabelControl();
		view.css(labelControl, "background-color", "#FFFFFF");
	}

	public setName(name: string): void {
		this.namePanel.setLabelText(name);
	}

	public adjustHeight(): number {
		let height = 0;
		height += LibraryDesignView.LABEL_HEIGHT;
		height += LibraryDesignView.NAME_HEIGHT;
		return height;
	}

	public getControl(): Control {
		return this.composite;
	}

}
