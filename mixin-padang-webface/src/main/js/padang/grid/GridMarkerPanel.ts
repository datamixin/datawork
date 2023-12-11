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

import * as view from "padang/view/view";

import * as grid from "padang/grid/grid";
import GridLabelPanel from "padang/grid/GridLabelPanel";
import GridElementPanel from "padang/grid/GridElementPanel";
import GridControlStyle from "padang/grid/GridControlStyle";
import GridLabelExtender from "padang/grid/GridLabelExtender";
import GridDefaultLabelPanel from "padang/grid/GridDefaultLabelPanel";

export default class GridMarkerPanel extends GridElementPanel {

	private style: GridControlStyle = null;
	private extender: GridLabelExtender = null;
	private composite: Composite = null;
	private selected: boolean = false;
	private labelPanel: GridLabelPanel = null;

	constructor(style: GridControlStyle, extender: GridLabelExtender) {
		super();
		this.style = style;
		this.extender = extender;
	}

	public createControl(parent: Composite, index?: number) {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);

		let element = this.composite.getElement();
		element.addClass("padang-grid-marker-panel");
		element.css("border-bottom", "1px solid " + grid.BORDER_COLOR);
		element.css("line-height", this.style.rowHeight + "px");

		this.composite.onSelection(() => {
			if (this.selected === false) {
				this.onSelection(this.composite, 0);
			}
		});

		view.setGridLayout(this.composite, 1, 5, 0, 0, 0);
		this.createLabelPanel(this.composite);
	}

	public createLabelPanel(parent: Composite): void {
		if (this.extender.getMarkerLabelPanel !== undefined) {
			this.labelPanel = this.extender.getMarkerLabelPanel();
		} else {
			this.labelPanel = new GridDefaultLabelPanel();
		}
		this.labelPanel.createControl(parent);
		view.setGridData(this.labelPanel, true, true);
	}

	public setLabel(label: any): void {
		this.labelPanel.setLabel(label);
	}

	public setOnSelection(callback: (control: Control, index: number) => void): void {
		this.onSelection = callback;
	}

	public setSelected(selected: boolean): void {
		this.selected = selected;
		view.setSelected(this.composite, this.selected);
	}

	public getControl(): Control {
		return this.composite;
	}

}
