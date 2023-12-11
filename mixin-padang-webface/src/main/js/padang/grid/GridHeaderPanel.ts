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

import AbsoluteData from "webface/layout/AbsoluteData";

import * as view from "padang/view/view";

import * as grid from "padang/grid/grid";
import GridHeaderPart from "padang/grid/GridHeaderPart";
import GridControlStyle from "padang/grid/GridControlStyle";
import GridLabelExtender from "padang/grid/GridLabelExtender";
import GridScrollPosition from "padang/grid/GridScrollPosition";
import GridColumnListPart from "padang/grid/GridColumnListPart";
import GridColumnOrganizer from "padang/grid/GridColumnOrganizer";
import GridColumnListPanel from "padang/grid/GridColumnListPanel";
import GridCellConsolidator from "padang/grid/GridCellConsolidator";
import GridColumnRangeUnderline from "padang/grid/GridColumnRangeUnderline";

export default class GridHeaderPanel extends GridCellConsolidator implements GridHeaderPart {

	private style: GridControlStyle = null;
	private composite: Composite = null;
	private consolidator = new GridCellConsolidator();
	private listPanel: GridColumnListPanel = null;
	private position: GridScrollPosition = null;

	constructor(style: GridControlStyle, position: GridScrollPosition) {
		super();
		this.style = style;
		this.prepareListPanel();
		this.preparePosition(position);
	}

	private prepareListPanel(): void {
		this.listPanel = new GridColumnListPanel(this.style);
	}

	private preparePosition(position: GridScrollPosition): void {
		this.position = position;
		position.addLeftChanged((left: number) => {
			this.setLeft(left);
		});
	}

	private setLeft(left: number): void {
		let control = this.listPanel.getControl();
		let layoutData = view.getAbsoluteData(control);
		layoutData.left = left;
		this.composite.relayout();
	}

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("padang-grid-header-panel");
		element.css("background-color", grid.SHADED_COLOR);
		if (this.style.headerVisible) {
			element.css("border-bottom", "1px solid " + grid.BORDER_COLOR);
		}
		element.css("z-index", "2");

		view.setAbsoluteLayout(this.composite);
		this.createListPanel(this.composite);
	}

	private createListPanel(parent: Composite): void {

		this.listPanel.createControl(parent);

		let width = this.listPanel.getExtraWidth();
		this.position.setRequiredWidthExtra(width);

		view.setControlData(this.listPanel);
		view.setAbsoluteData(this.listPanel, 0, 0, 0, "100%");
	}

	public addColumn(layoutData: AbsoluteData, index: number): void {
		this.consolidator.addColumn(layoutData, index);
	}

	public removeColumn(index: number): void {
		this.consolidator.removeColumn(index);
	}

	public columnsResized(): void {
		this.consolidator.columnsResized();
		this.relayout();
	}

	public setProperty(index: number, name: string, value: any): void {
		this.consolidator.setProperty(index, name, value);
	}

	public selectColumn(index: number, notify: boolean): void {
		this.consolidator.selectColumn(index, notify);
	}

	public setExtender(extender: GridLabelExtender): void {
		this.listPanel.setExtender(extender);
	}

	public setConsolidator(consolidator: GridCellConsolidator): void {
		this.listPanel.setConsolidator(this);
		this.consolidator = consolidator;
	}

	public setUnderline(underline: GridColumnRangeUnderline): void {
		this.listPanel.setUnderline(underline);
	}

	public getOrganizer(): GridColumnOrganizer {
		return this.listPanel;
	}

	public setLeftOrigin(left: number): void {
		this.setLeft(left);
	}

	public relayout(): void {
		let children = this.composite.getChildren();
		if (children.length > 0) {

			let child = <GridColumnListPart>children[0].getData();
			let width = child.adjustWidth();

			let layoutData = view.getAbsoluteData(this.listPanel);
			layoutData.width = width;
			this.composite.relayout();

			this.position.setRequiredWidth(width);
		}
	}

	public getControl(): Control {
		return this.composite;
	}

}