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
import WebFontIcon from "webface/widgets/WebFontIcon";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

export default class WorkspaceConsoleMenuPanel {

	public static HEIGHT = 30;
	public static ICON_WIDTH = 32;

	private composite: Composite = null;
	private icon: WebFontIcon = null;
	private label: Label = null;
	private onSelection = () => { };

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("bekasi-workspace-console-menu-panel");

		let layout = new GridLayout(2, 0, 0);
		this.composite.setLayout(layout);

		this.composite.onSelection(() => {
			this.onSelection();
		});

		this.createIcon(this.composite);
		this.createLabel(this.composite);

	}

	private createIcon(parent: Composite): void {

		this.icon = new WebFontIcon(parent);

		let element = this.icon.getElement();
		element.css("font-size", "24px");
		element.css("line-height", WorkspaceConsoleMenuPanel.HEIGHT + "px");

		let layoutData = new GridData(WorkspaceConsoleMenuPanel.ICON_WIDTH, true);
		layoutData.horizontalIndent = 15;
		this.icon.setLayoutData(layoutData);
	}

	private createLabel(parent: Composite): void {

		this.label = new Label(parent);

		let element = this.label.getElement();
		element.css("line-height", WorkspaceConsoleMenuPanel.HEIGHT + "px");

		let layoutData = new GridData(true, true);
		this.label.setLayoutData(layoutData);
	}

	public setIcon(icon: string): void {
		this.icon.addClasses("mdi", icon);
	}

	public setText(text: string): void {
		this.label.setText(text);
	}

	public getLabel(): string {
		return this.label.getText();
	}

	public setSelected(state: boolean): void {
		let element = this.composite.getElement();
		if (state === true) {
			element.addClass("selected");
		} else {
			element.removeClass("selected");
		}
	}

	public setOnSelection(callback: () => void): void {
		this.onSelection = callback;
	}

	public getControl(): Control {
		return this.composite;
	}

}