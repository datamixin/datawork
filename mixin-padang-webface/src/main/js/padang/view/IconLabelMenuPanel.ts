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

import Action from "webface/action/Action";

import GridLayout from "webface/layout/GridLayout";

import HeightAdjustablePart from "webface/wef/HeightAdjustablePart";

import * as view from "padang/view/view";
import MenuPanel from "padang/view/MenuPanel";
import IconLabelPanel from "padang/view/IconLabelPanel";

export default class IconLabelMenuPanel implements HeightAdjustablePart {

	private static HEIGHT = 30;

	private menuWidth: number = 24;
	private composite: Composite = null;
	private labelPanel = new IconLabelPanel();
	private menuPanel = new MenuPanel();
	private onSelection = () => { };

	constructor(menuWidth?: number) {
		this.menuWidth = menuWidth === undefined ? this.menuWidth : menuWidth;
	}

	public createControl(parent: Composite, index?: number) {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);

		let element = this.composite.getElement();
		element.addClass("padang-icon-name-menu-panel");

		let layout = new GridLayout(2, 0, 0, 0, 0);
		this.composite.setLayout(layout);

		this.createLabelPanel(this.composite);
		this.createMenuPanel(this.composite);

		this.composite.onSelection(() => {
			this.onSelection();
		});
	}

	private createLabelPanel(parent: Composite): void {
		this.labelPanel.createControl(parent);
		view.setGridData(this.labelPanel, true, true);
	}

	private createMenuPanel(parent: Composite): void {
		this.menuPanel.createControl(parent);
		view.setGridData(this.menuPanel, this.menuWidth, true);
	}

	public setActions(actions: Action[]): void {
		this.menuPanel.setActions(actions);
	}

	public setIcon(icon: string): void {
		this.labelPanel.setIcon(icon);
	}

	public setLabel(text: string): void {
		this.labelPanel.setLabel(text);
	}

	public setTooltip(info: string): void {
		this.labelPanel.setTooltip(info);
	}

	public setOnSelection(callback: () => void): void {
		this.onSelection = callback;
	}

	public setMenuEnabled(enabled: boolean): void {
		this.menuPanel.setEnabled(enabled);
	}

	public adjustHeight(): number {
		return IconLabelMenuPanel.HEIGHT;
	}

	public getControl(): Control {
		return this.composite;
	}

}
