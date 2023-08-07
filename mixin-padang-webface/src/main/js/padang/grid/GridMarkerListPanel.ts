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
import Panel from "webface/wef/Panel";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import AbsoluteData from "webface/layout/AbsoluteData";

import VisageMutation from "padang/visage/VisageMutation";

import * as view from "padang/view/view";

import * as grid from "padang/grid/grid";
import GridMarkerPanel from "padang/grid/GridMarkerPanel";
import GridControlStyle from "padang/grid/GridControlStyle";
import GridLabelExtender from "padang/grid/GridLabelExtender";
import GridMarkerArranger from "padang/grid/GridMarkerArranger";
import GridScrollPosition from "padang/grid/GridScrollPosition";
import GridElementListPart from "padang/grid/GridElementListPart";
import GridElementListPanel from "padang/grid/GridElementListPanel";
import GridRowRangeSideline from "padang/grid/GridRowRangeSideline";
import GridCellConsolidator from "padang/grid/GridCellConsolidator";

export default class GridMarkerListPanel implements GridMarkerArranger, GridElementListPart {

	private style: GridControlStyle = null;
	private extender: GridLabelExtender = null;
	private consolidator = new GridCellConsolidator();
	private position: GridScrollPosition = null;
	private composite: Composite = null;
	private listPanel: GridElementListPanel = null;
	private extraPanel: Panel = null;
	private sideline: GridRowRangeSideline = null;
	private selectedPanel: GridMarkerPanel = null;

	constructor(style: GridControlStyle, position: GridScrollPosition) {
		this.style = style;
		this.prepareListPanel(position);
		this.preparePosition(position);
	}

	private preparePosition(position: GridScrollPosition): void {
		this.position = position;
	}

	private prepareListPanel(position: GridScrollPosition): void {
		this.listPanel = new GridElementListPanel(this.style, position, this);
	}

	public createControl(parent: Composite, index?: number) {

		this.composite = new Composite(parent, index);

		let element = this.composite.getElement();
		element.addClass("padang-grid-marker-list-panel");
		element.css("background-color", grid.SHADED_COLOR);
		if (this.style.markerVisible) {
			element.css("border-right", "1px solid " + grid.BORDER_COLOR);
		}
		element.css("line-height", this.style.rowHeight + "px");
		element.css("z-index", 2);

		view.setAbsoluteLayout(this.composite);

		this.createListPanel(this.composite);

	}

	private createListPanel(parent: Composite): void {
		this.listPanel.createControl(parent);
		view.setAbsoluteData(this.listPanel, 0, 0, this.style.markerWidth, 0);
	}

	public indicateHasSelection(row: number): AbsoluteData {
		let panel = this.listPanel.getPanelAt(row);
		if (panel !== null) {
			let topIndex = this.listPanel.getTopIndex();
			let layoutData = view.getAbsoluteData(panel);
			let absoluteData = Object.create(layoutData);
			absoluteData.top = <number>layoutData.top + topIndex * this.style.rowHeight;
			this.indicateSelection(<number>absoluteData.top, <number>absoluteData.height);
			return absoluteData;
		} else {
			return null;
		}
	}

	public getFullHeight(): number {
		let layoutData = view.getAbsoluteData(this.listPanel);
		return <number>layoutData.height;
	}

	private indicateSelection(top: number, height: number): void {
		this.sideline.update(top, height);
		this.clearSelection();
	}

	public setSideline(sideline: GridRowRangeSideline): void {
		this.sideline = sideline;
	}

	public refresh(count: number): void {
		this.listPanel.refresh(count);
	}

	public refreshContent(): void {
		this.listPanel.refreshContent();
	}

	public mutate(mutation: VisageMutation): void {
		this.listPanel.mutate(mutation);
	}

	public createElementPanel(): GridMarkerPanel {
		return new GridMarkerPanel(this.style, this.extender);
	}

	public postElementCreate(panel: GridMarkerPanel): void {
		panel.setOnSelection((control: Control) => {
			let index = this.listPanel.getPositionOf(control);
			let top = this.position.getTop();
			let topIndex = -top / this.style.rowHeight;
			this.consolidator.selectRow(index + topIndex, true);
		});
	}

	public refreshElementRange(offset: number, start: number, end: number): void {
		if (start < end) {
			for (let i = offset; i < offset + end - start; i++) {
				let position = start + i - offset
				let panel = <GridMarkerPanel>this.listPanel.getPanelAt(position);
				if (panel !== null) {
					panel.setLabel(position + 1);
				}
			}
		}
	}

	public setConsolidator(consolidator: GridCellConsolidator): void {
		this.consolidator = consolidator;
	}

	private clearSelection(): void {
		if (this.selectedPanel !== null) {
			this.selectedPanel.setSelected(false);
		}
		this.selectedPanel = null;
	}

	public setExtender(extender: GridLabelExtender): void {
		this.extender = extender;
		if (this.extender.getMarkerExtraPanel !== undefined) {
			this.extraPanel = this.extender.getMarkerExtraPanel();
			this.extraPanel.createControl(this.composite);
			view.setAbsoluteData(this.extraPanel, 0, 0, this.style.markerWidth, this.style.rowHeight);
		}
		this.position.setRequiredHeightExtra(this.style.rowHeight);
	}

	public lastShownElement(panel: GridMarkerPanel): void {
		if (this.extraPanel !== null) {
			let layoutData = view.getAbsoluteData(panel);
			let extraData = view.getAbsoluteData(this.extraPanel);
			extraData.top = <number>layoutData.top + <number>layoutData.height;
		}

		this.composite.relayout();
	}

	public setTopOrigin(top: number): void {
		this.listPanel.scrollTo(top);
	}

	public relayout(): void {

		// Adjust
		let width = this.style.markerWidth;
		this.listPanel.forEachElement((panel: GridMarkerPanel) => {
			panel.adjustHeight();
			let layoutData = view.getAbsoluteData(panel);
			layoutData.width = width;
		});

		// Layout
		let height = this.position.getRequiredHeight();
		let listData = view.getAbsoluteData(this.listPanel);
		listData.width = width;
		listData.height = height;

		// Extra panel
		if (this.extraPanel !== null) {
			let extraData = view.getAbsoluteData(this.extraPanel);
			extraData.top = height;
		}

		this.composite.relayout();
	}

	public getControl(): Control {
		return this.composite;
	}

}
