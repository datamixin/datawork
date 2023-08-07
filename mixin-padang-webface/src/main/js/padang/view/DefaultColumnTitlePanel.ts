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

import ConductorPanel from "webface/wef/ConductorPanel";

import VisageType from "bekasi/visage/VisageType";

import * as view from "padang/view/view";
import IconLabelPanel from "padang/view/IconLabelPanel";
import * as TypeDecoration from "padang/view/TypeDecoration";
import DefaultColumnLabel from "padang/view/DefaultColumnLabel";

import GridControlStyle from "padang/grid/GridControlStyle";
import GridColumnLabelPanel from "padang/grid/GridColumnLabelPanel";

export default class DefaultColumnTitlePanel extends ConductorPanel implements GridColumnLabelPanel {

	private composite: Composite = null;
	private titlePanel = new IconLabelPanel(5);
	private selected: boolean = false;
	private onSelection = () => { };

	public createControl(parent: Composite, index?: number) {

		this.composite = new Composite(parent, index);
		this.composite.setData(this);

		this.composite.onSelection(() => {
			this.onSelection();
		});

		let element = this.composite.getElement();
		element.addClass("padang-default-column-title-panel");

		view.setGridLayout(this.composite, 1, 0, 0, 0, 0);
		this.createIconLabelPanel(this.composite);
	}

	private createIconLabelPanel(parent: Composite): void {
		this.titlePanel.createControl(parent);
		this.titlePanel.setIconColor("#BBB");
		view.css(this.titlePanel, "line-height", GridControlStyle.HEADER_HEIGHT + "px");
		view.setGridData(this.titlePanel, true, GridControlStyle.HEADER_HEIGHT);
	}

	public setLabel(label: DefaultColumnLabel): void {

		let name = label.getLabel();
		this.titlePanel.setLabel(name);
		let control = this.titlePanel.getControl();
		let element = control.getElement();
		element.attr("title", name);

		let type = label.getType();
		this.titlePanel.setShowIcon(true);
		if (VisageType.isTemporal(type)) {
			type = VisageType.DATETIME;
		}
		let icon = TypeDecoration.ICON_MAP[type];
		this.titlePanel.setIcon(icon);
		this.composite.relayout();

	}

	public setProperty(_name: string, _value: any): void {

	}

	public setSelected(selected: boolean): void {
		this.selected = selected;
		view.setSelected(this.composite, this.selected);
	}

	public setOnSelection(callback: () => void): void {
		this.onSelection = callback;
	}

	public adjustWidth(): number {
		return GridControlStyle.MIN_COLUMN_WIDTH;
	}

	public getControl(): Control {
		return this.composite;
	}

}
