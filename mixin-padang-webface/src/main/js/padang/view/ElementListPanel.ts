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

import ConductorView from "webface/wef/ConductorView";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import * as view from "padang/view/view";
import ElementPanel from "padang/view/ElementPanel";

export default class ElementListPanel {

	private itemHeight = 30;
	private verticalSpacing = 5;
	private marginWidth: number = 10;
	private marginHeight: number = 10;
	private composite: Composite = null;
	private elementPanels: ElementPanel[] = [];
	private onNewPanel = (child: ConductorView): ElementPanel => { throw new Error("Not implemented") };
	private onPostNew = (panel: ElementPanel) => { };

	constructor(itemHeight?: number, verticalSpacing?: number, marginWidth?: number, marginHeight?: number) {
		this.itemHeight = itemHeight === undefined ? this.itemHeight : itemHeight;
		this.verticalSpacing = verticalSpacing === undefined ? this.verticalSpacing : verticalSpacing;
		this.marginWidth = marginWidth === undefined ? this.marginWidth : marginWidth;
		this.marginHeight = marginHeight === undefined ? this.marginHeight : marginHeight;
	}

	public createControl(parent: Composite, index?: number) {

		this.composite = new Composite(parent);

		view.addClass(this.composite, "padang-list-container-panel");
		view.setGridLayout(this.composite, 1, this.marginWidth, this.marginHeight, 0, this.verticalSpacing);

	}

	private updateLabels(): void {
		for (let panel of this.elementPanels) {
			panel.updateLabel();
		}
	}

	public setOnNewPanel(callback: (child: ConductorView) => ElementPanel): void {
		this.onNewPanel = callback;
	}

	public setOnPostNew(callback: (panel: ElementPanel) => void): void {
		this.onPostNew = callback;
	}

	public adjustHeight(): number {
		if (this.elementPanels.length === 0) {
			return 0;
		} else {
			let part = new GridCompositeAdjuster(this.composite);
			let height = part.adjustHeight();
			return height;
		}
	}

	public getSize(): number {
		return this.elementPanels.length;
	}

	public addView(child: ConductorView, index: number): void {

		// Buat element panel untuk menampung view
		let panel = this.onNewPanel(child);

		// Add ke daftar panel
		this.elementPanels.splice(index, 0, panel);

		panel.createControl(this.composite, index);
		view.setControlData(panel);
		view.setGridData(panel, true, this.itemHeight);

		this.updateLabels();
		this.onPostNew(panel);
	}

	public moveView(child: ConductorView, index: number): void {

		// Looping ke semua element panel
		for (let i = 0; i < this.elementPanels.length; i++) {
			let panel = this.elementPanels[i];
			if (panel.getView() === child) {

				// Move di daftar panel
				this.elementPanels.splice(i, 1);
				this.elementPanels.splice(index, 0, panel);

				// Move di container
				let control = panel.getControl();
				this.composite.moveControl(control, index);
				break;
			}
		}
		this.updateLabels();

	}

	public removeView(child: ConductorView): void {

		// Looping ke semua element panel
		for (let i = 0; i < this.elementPanels.length; i++) {
			let panel = this.elementPanels[i];
			if (panel.getView() === child) {

				// Remove di element panels
				this.elementPanels.splice(i, 1);

				// Remove di container
				view.dispose(panel);
				break;
			}
		}
		this.updateLabels();
	}

	public getControl(): Control {
		return this.composite;
	}

}