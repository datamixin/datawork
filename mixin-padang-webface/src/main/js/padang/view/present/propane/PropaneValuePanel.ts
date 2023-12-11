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

import Conductor from "webface/wef/Conductor";
import ConductorPanel from "webface/wef/ConductorPanel";

import GroupAction from "webface/action/GroupAction";

import * as view from "padang/view/view";

import Propane from "padang/view/present/propane/Propane";
import PropaneMenuPanel from "padang/view/present/propane/PropaneMenuPanel";

export default class PropaneValuePanel extends ConductorPanel {

	private composite: Composite = null;
	private textLabel: Label = null;
	private menuPanel: PropaneMenuPanel = null;
	private onSelection = () => { };
	private action: GroupAction = null;
	private count: number = 0;
	private inspect: number = null;

	constructor(conductor: Conductor, action?: GroupAction) {
		super(conductor);
		this.action = action !== undefined ? action : null;
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);
		this.composite.setData(this);
		view.addClass(this.composite, "padang-propane-value-panel");
		view.css(this.composite, "line-height", (Propane.BAR_HEIGHT - 3) + "px");
		view.setGridLayout(this.composite, 2, 0, 0, 0, 0);

		this.createTextLabel(this.composite);
		if (this.action !== null) {
			let actions = this.action.getActions();
			if (actions.length > 0) {
				this.createMenuPanel(this.composite);
			}
		}

		this.composite.onSelection(() => {
			this.onSelection();
		})
	}

	private createTextLabel(parent: Composite): void {
		this.textLabel = new Label(parent);
		view.addClass(this.textLabel, "padang-propane-value-panel-text-label");
		view.css(this.textLabel, "line-height", "11px");
		view.css(this.textLabel, "font-size", "11px");
		view.css(this.textLabel, "text-indent", "3px");
		view.setGridData(this.textLabel, true, true);
	}

	private createMenuPanel(parent: Composite): void {
		this.menuPanel = new PropaneMenuPanel(this.conductor, this.action);
		this.menuPanel.createControl(parent);
		view.addClass(this.menuPanel, "padang-propane-value-panel-menu-panel");
		view.setGridData(this.menuPanel, 24, true);
	}

	public getLabel(): string {
		return this.textLabel.getText();
	}

	public setLabel(value: string): void {
		this.textLabel.setText(value);
	}

	public setTextCss(name: string, style: string): void {
		view.css(this.textLabel, name, style);
	}

	public setCount(count: number): void {
		this.count = count;
	}

	public setInspect(inspect: number): void {
		this.inspect = inspect;
	}

	public updateHint(): void {
		let text = this.textLabel.getText();
		let hint = text + ": " + this.count + " values";
		if (this.inspect !== null) {
			hint = text + ": " + this.inspect + "/" + this.count + " values";
		}
		view.attr(this.textLabel, "title", hint);
	}

	public setOnSelection(callback: () => void): void {
		this.onSelection = callback;
	}

	public getControl(): Control {
		return this.composite;
	}

}

