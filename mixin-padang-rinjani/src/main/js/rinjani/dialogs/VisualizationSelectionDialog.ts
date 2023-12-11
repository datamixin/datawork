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
import Conductor from "webface/wef/Conductor";

import Composite from "webface/widgets/Composite";

import TitleAreaDialog from "webface/dialogs/TitleAreaDialog";

import * as widgets from "padang/widgets/widgets";

import VisualizationSelectionPanel from "rinjani/panels/VisualizationSelectionPanel";

export default class VisualizationSelectionDialog extends TitleAreaDialog {

	public static LIST_WIDTH = 260;
	public static ITEM_HEIGHT = 24;
	public static INIT_WIDTH = 800;
	public static INIT_HEIGHT = 600;

	private conductor: Conductor = null;
	private selectionPanel: VisualizationSelectionPanel = null;

	constructor(conductor: Conductor) {
		super();
		this.conductor = conductor;
		this.setDialogSize(VisualizationSelectionDialog.INIT_WIDTH, VisualizationSelectionDialog.INIT_HEIGHT);
		this.setWindowTitle("Visualization Selection Dialog");
		this.setTitle("Visualization Selection");
		this.setMessage("Please select a visualization routine");
	}

	protected createControl(parent: Composite): void {
		let composite = new Composite(parent);
		widgets.setGridLayout(composite, 1);
		this.createSelectionPanel(composite);
	}

	private createSelectionPanel(parent: Composite): void {
		this.selectionPanel = new VisualizationSelectionPanel(this.conductor);
		this.selectionPanel.createControl(parent);
		this.selectionPanel.setOnComplete(() => {
			this.updatePageComplete();
		});
		widgets.setGridData(this.selectionPanel, true, true);
	}

	public getSelection(): string {
		return this.selectionPanel.getSelection();
	}

	private updatePageComplete(): void {

		this.setErrorMessage(null);
		this.okButton.setEnabled(false);

		// Pastikan minimal ada key atau value
		let selectedName = this.selectionPanel.getSelection();
		if (selectedName === null) {
			this.setErrorMessage("Please select a routine");
			return;
		}

		this.okButton.setEnabled(true);
	}

}

