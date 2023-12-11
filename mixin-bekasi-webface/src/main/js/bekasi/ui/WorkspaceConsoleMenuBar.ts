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

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import PartViewer from "webface/wef/PartViewer";

import ConfirmationDialog from "webface/dialogs/ConfirmationDialog";

import BaseSelectionProvider from "webface/wef/base/BaseSelectionProvider";

import * as directors from "bekasi/directors";

import WorkspaceConsoleMenuPanel from "bekasi/ui/WorkspaceConsoleMenuPanel";

export default class WorkspaceConsoleMenuBar extends BaseSelectionProvider {

	private composite: Composite = null;
	private panels: WorkspaceConsoleMenuPanel[] = [];
	private selected: WorkspaceConsoleMenuPanel = null;

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("bekasi-workspace-console-menu-bar");

		let layout = new GridLayout(1, 0, 10, 0, 0);
		this.composite.setLayout(layout);

	}

	public addMainMenu(icon: string, label: string, callback: () => void): void {

		let panel = new WorkspaceConsoleMenuPanel();
		panel.createControl(this.composite);
		let control = panel.getControl();

		let layoutData = new GridData(true, WorkspaceConsoleMenuPanel.HEIGHT);
		control.setLayoutData(layoutData);

		panel.setIcon(icon);
		panel.setText(label);
		panel.setOnSelection(() => {
			this.setSelected(label);
			callback();
		});
		this.panels.push(panel);
	}

	public completeMenu(viewer: PartViewer): void {

		let space = new Label(this.composite);
		let spaceData = new GridData(true, true);
		space.setLayoutData(spaceData);

		let panel = new WorkspaceConsoleMenuPanel();
		panel.createControl(this.composite);
		let control = panel.getControl();

		let layoutData = new GridData(true, WorkspaceConsoleMenuPanel.HEIGHT);
		control.setLayoutData(layoutData);

		panel.setIcon("mdi-location-exit");
		panel.setText("Logout");
		panel.setOnSelection(() => {

			let dialog = new ConfirmationDialog();
			dialog.setWindowTitle("Logout");
			dialog.setPrompt("Are you sure want to logout?");
			dialog.open((result: string) => {
				if (result === ConfirmationDialog.OK) {
					let director = directors.getConsoleDirector(viewer);
					director.logout();
				}
			});
		});

	}

	public setSelected(label: string): void {
		for (let panel of this.panels) {
			if (panel.getLabel() === label) {
				if (this.selected !== null) {
					this.selected.setSelected(false);
				}
				panel.setSelected(true);
				this.selected = panel;
				break;
			}
		}
	}

	public getControl(): Control {
		return this.composite;
	}

}