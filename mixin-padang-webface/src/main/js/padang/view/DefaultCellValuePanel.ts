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

import ConductorPanel from "webface/wef/ConductorPanel";

import VisageValue from "bekasi/visage/VisageValue";

import * as view from "padang/view/view";

import GridValuePanel from "padang/grid/GridValuePanel";
import GridControlStyle from "padang/grid/GridControlStyle";

import SurfacePanel from "padang/view/present/surface/SurfacePanel";
import SurfaceRegistry from "padang/view/present/surface/SurfaceRegistry";
import { NumberSurfacePanel } from "padang/view/present/surface/NumberSurface";

export default class DefaultCellValuePanel extends ConductorPanel implements GridValuePanel {

	private composite: Composite = null;
	private delayLabel: Label = null;
	private type: string = null;
	private surfacePanel: SurfacePanel = null;
	private format: string = null;

	public createControl(parent: Composite, index: number): void {

		this.composite = new Composite(parent, index);
		view.addClass(this.composite, "padang-default-cell-value-panel");
		view.setAbsoluteLayout(this.composite);

		this.createDelayLabel(this.composite);
	}

	private createDelayLabel(parent: Composite): void {
		this.delayLabel = new Label(parent);
		view.css(this.delayLabel, "text-indent", "5px");
		this.setCommonStyle(this.delayLabel);
		let element = this.delayLabel.getElement();
		element.html("&#8230;");
	}

	public setValue(rowPos: number, columnPos: number, value?: VisageValue): void {

		if (value !== undefined) {

			let type = value.xLeanName();
			if (type !== this.type) {

				// Dispose surface terakhir
				if (this.surfacePanel !== null) {
					view.dispose(this.surfacePanel);
				}

				// Buat surface baru
				let registry = SurfaceRegistry.getInstance();
				let surface = registry.get(value);
				this.surfacePanel = surface.createPanel(this.conductor, false);
				this.surfacePanel.createControl(this.composite);
				let surfaceControl = this.surfacePanel.getControl();
				this.setCommonStyle(surfaceControl);
			}

			// Isi surface
			this.surfacePanel.setValue(value);
			this.refreshFormat();
			this.setShowDelay(false);
			this.type = type;

		}
	}

	protected setCommonStyle(control: Control): void {
		view.css(control, "line-height", GridControlStyle.ROW_HEIGHT + "px");
		view.css(control, "font-family", "Menlo, Consolas, monospace");
		view.css(control, "left", 0);
		view.css(control, "top", 0);
		view.css(control, "width", "100%");
		view.css(control, "height", "100%");
	}

	public setSelected(selected: boolean): void {
		if (this.surfacePanel !== null) {
			this.surfacePanel.setSelected(selected);
		}
	}

	private refreshFormat(): void {
		if (this.surfacePanel !== null) {
			if (this.surfacePanel instanceof NumberSurfacePanel) {
				this.surfacePanel.applyFormat(this.format);
			}
		}
	}

	public setProperty(name: string, value: any): void {
		if (name === "format") {
			this.format = value;
			this.refreshFormat();
		}
	}

	private setShowDelay(state: boolean): void {
		if (this.surfacePanel !== null) {
			view.css(this.delayLabel, "opacity", state ? 1 : 0);
			view.css(this.surfacePanel, "opacity", state ? 0 : 1);
		}
	}

	public delayValue(): void {
		this.setShowDelay(true);
	}

	public getControl(): Control {
		return this.composite;
	}

}