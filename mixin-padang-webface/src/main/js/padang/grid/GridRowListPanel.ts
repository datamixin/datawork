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

import AbsoluteData from "webface/layout/AbsoluteData";

import VisageMutation from "padang/visage/VisageMutation";

import * as view from "padang/view/view";

import GridRowPanel from "padang/grid/GridRowPanel";
import GridControlStyle from "padang/grid/GridControlStyle";
import GridEventAdapter from "padang/grid/GridEventAdapter";
import GridLabelExtender from "padang/grid/GridLabelExtender";
import GridCellSelection from "padang/grid/GridCellSelection";
import GridScrollPosition from "padang/grid/GridScrollPosition";
import GridMarkerArranger from "padang/grid/GridMarkerArranger";
import GridElementListPart from "padang/grid/GridElementListPart";
import GridContentProvider from "padang/grid/GridContentProvider";
import GridColumnOrganizer from "padang/grid/GridColumnOrganizer";
import GridRowListScroller from "padang/grid/GridRowListScroller";
import GridElementListPanel from "padang/grid/GridElementListPanel";
import GridCellConsolidator from "padang/grid/GridCellConsolidator";
import GridRowRangeSideline from "padang/grid/GridRowRangeSideline";
import GridCellRangeFeedback from "padang/grid/GridCellRangeFeedback";
import GridColumnRangeUnderline from "padang/grid/GridColumnRangeUnderline";

export default class GridRowListPanel implements GridCellConsolidator, GridElementListPart {

	private style: GridControlStyle = null;
	private composite: Composite = null;
	private extender: GridLabelExtender = null;
	private provider: GridContentProvider = null;
	private position: GridScrollPosition = null;
	private adapter: GridEventAdapter = null;
	private listPanel: GridElementListPanel = null;
	private organizer = new GridColumnOrganizer();
	private arranger = new GridMarkerArranger();
	private selection: GridCellSelection = null;
	private scroller: GridRowListScroller = null;

	constructor(style: GridControlStyle, position: GridScrollPosition) {
		this.style = style;
		this.prepareListPanel(style, position);
		this.preparePosition(position);
	}

	private prepareListPanel(style: GridControlStyle, position: GridScrollPosition): void {
		this.listPanel = new GridElementListPanel(style, position, this);
	}

	private preparePosition(position: GridScrollPosition): void {
		this.position = position;
		this.position.addLeftChanged((left: number) => {
			this.setLeft(left);
			if (this.adapter.getOnTopOriginChanged !== undefined) {
				let leftOriginChanged = this.adapter.getOnLeftOriginChanged();
				leftOriginChanged(left);
			}
		});
		this.position.addTopChanged((top: number) => {
			this.setTop(top);
			if (this.adapter.getOnTopOriginChanged !== undefined) {
				let topOriginChanged = this.adapter.getOnTopOriginChanged();
				topOriginChanged(top);
			}
		});
	}

	private setLeft(left: number): void {
		let target = this.listPanel.getControl();
		let element = target.getElement();
		element.css("left", left);
		let listData = view.getAbsoluteData(this.listPanel);
		listData.left = left;
		this.selection.enterSelection();
	}

	private setTop(top: number): void {
		this.listPanel.scrollTo(top);
		this.selection.enterSelection();
	}

	public createControl(parent: Composite, index?: number) {

		this.composite = new Composite(parent, index);

		let element = this.composite.getElement();
		element.addClass("padang-grid-row-list-panel");
		view.css(this.composite, "z-index", 1);
		view.setAbsoluteLayout(this.composite);

		this.scroller = new GridRowListScroller(this.style, this.position);
		this.scroller.installOn(element);

		this.prepareSelection(this.composite);

		this.createElementListPanel(this.composite);
	}

	private prepareSelection(parent: Composite): void {
		this.selection = new GridCellSelection(this.style, this.listPanel, this.scroller);
		this.selection.setOnRowExpand((): boolean => {
			if (this.adapter.getOnRowExpand !== undefined) {
				let rowExpand = this.adapter.getOnRowExpand();
				return rowExpand();
			} else {
				return false;
			}
		});
		let element = parent.getElement();
		this.selection.installOn(element);
	}

	private createElementListPanel(parent: Composite): void {
		this.listPanel.createControl(parent);
		view.setAbsoluteData(this.listPanel, 0, 0, 0, 0);
	}

	public setOrganizer(organizer: GridColumnOrganizer): void {
		this.organizer = organizer;
		this.selection.setOrganizer(organizer);
	}

	public setArranger(arranger: GridMarkerArranger): void {
		this.arranger = arranger;
		this.selection.setArranger(arranger);
	}

	public setFeedback(feedback: GridCellRangeFeedback): void {
		this.selection.setFeedback(feedback);
	}

	public setSideline(sideline: GridRowRangeSideline): void {
		this.selection.setSideline(sideline);
	}

	public setUnderline(underline: GridColumnRangeUnderline): void {
		this.selection.setUnderline(underline);
	}

	public addColumn(layoutData: AbsoluteData, index: number): void {
		this.selection.revampAddColumn(index);
		this.listPanel.forEachElement((rowPanel: GridRowPanel) => {
			rowPanel.addCell(this.style, this.extender, this.organizer, layoutData, index);
		});
	}

	public removeColumn(index: number): void {
		this.selection.revampRemoveColumn(index);
		this.listPanel.forEachElement((rowPanel: GridRowPanel) => {
			rowPanel.removeCell(index);
		});
	}

	public setProperty(index: number, name: string, value: any): void {
		this.listPanel.forEachElement((rowPanel: GridRowPanel) => {
			rowPanel.setProperty(index, name, value);
		});
	}

	public columnsResized(): void {
		this.relayout();
		this.selection.relayoutIndication();
	}

	public setLeftOrigin(left: number): void {
		this.scroller.setLeftOrigin(left, false);
		this.setLeft(left);
	}

	public setTopOrigin(top: number): void {
		this.scroller.setTopOrigin(top, false);
		this.setTop(top);
	}

	public selectRow(index: number, notify: boolean): void {
		this.selection.focusSelection(index, -1);
		this.arranger.indicateHasSelection(index);
		if (notify && this.adapter.getOnRowSelection !== undefined) {
			let rowSelection = this.adapter.getOnRowSelection();
			rowSelection(index);
		}
	}

	public selectCell(row: number, column: number, notify: boolean): void {
		this.selection.focusSelection(row, column);
		if (notify === true && this.adapter.getOnCellSelection !== undefined) {
			let label = this.organizer.getColumnLabel(column);
			let cellSelection = this.adapter.getOnCellSelection();
			cellSelection(row, column, label);
		}
	}

	public selectColumn(index: number, notify: boolean): void {
		this.selection.focusSelection(-1, index);
		this.organizer.indicateHasSelection(index);
		if (notify === true && this.adapter.getOnColumnSelection !== undefined) {
			let label = this.organizer.getColumnLabel(index);
			let columnSelection = this.adapter.getOnColumnSelection();
			columnSelection(index, label);
		}
	}

	public refresh(count: number): void {
		this.listPanel.refresh(count);
		this.selection.refreshSelection();
	}

	public refreshContent(): void {
		this.scroller.refreshSize();
		this.listPanel.refreshContent();
	}

	public mutate(mutation: VisageMutation, callback: () => void): void {
		this.listPanel.mutate(mutation, callback);
	}

	public createElementPanel(): GridRowPanel {
		return new GridRowPanel();
	}

	public postElementCreate(panel: GridRowPanel): void {
		this.createCellList(panel);
	}

	public refreshElementRange(offset: number, start: number, end: number, callback?: () => void): void {
		if (start < end) {

			// Reset values
			for (let i = offset; i < offset + end - start; i++) {
				let position = start - offset + i;
				let panel = <GridRowPanel>this.listPanel.getPanelAt(position);
				if (panel !== null) {
					panel.resetValues();
				}
			}

			// Progress indicator
			let element = this.composite.getElement();
			element.css("cursor", "progress");

			// Request rows
			let columns = this.organizer.getColumnCount();
			this.provider.getRowRange(start, end, 0, columns, (map: Map<any, any[]>) => {
				for (let i = offset; i < offset + end - start; i++) {
					let position = start - offset + i;
					let panel = <GridRowPanel>this.listPanel.getPanelAt(position);
					if (panel !== null) {
						if (map.has(position)) {
							let values = map.get(position);
							panel.setValues(position, values);
						}
					}
				}
				if (callback !== undefined) {
					callback();
				}
				element.css("cursor", "default");

				// Scroll scroller adjustment
				let top = this.position.getTop();
				let requiredHeight = this.position.getRequiredHeight();
				if (top < -requiredHeight) {
					this.scroller.scrollVerticalEnd();
				}
			});
		}
	}

	private createCellList(panel: GridRowPanel): void {

		let list = this.organizer.getLayoutDataList();
		for (let i = 0; i < list.length; i++) {

			let layoutData = list[i];
			panel.addCell(this.style, this.extender, this.organizer, layoutData, i);

			panel.setCellSelection((control: Control, cell: number) => {
				let row = this.listPanel.getPositionOf(control);
				let topIndex = this.listPanel.getTopIndex();
				this.selectCell(topIndex + row, cell, true);
			});

			panel.setCellEditing((control: Control, cell: number) => {
				let rowPanel = <GridRowPanel>control.getData();
				let cellPanel = rowPanel.getPanelAt(cell);
				this.selection.enterAuthoring(cellPanel);
			});

			panel.setCellCommit(() => {
				this.selection.enterSelection();
			});

		}

	}

	public setExtender(extender: GridLabelExtender): void {
		this.extender = extender;
	}

	public setProvider(provider: GridContentProvider): void {
		this.provider = provider;
	}

	public setAdapter(adapter: GridEventAdapter): void {
		this.adapter = adapter;
	}

	public lastShownElement(_panel: GridRowPanel): void {

	}

	public relayout(): void {

		// Lebar
		let width = 0;
		let list = this.organizer.getLayoutDataList();
		for (let layoutData of list) {
			width += <number>layoutData.width;
		}

		// Adjust
		this.listPanel.forEachElement((panel: GridRowPanel) => {
			panel.adjustHeight();
			let layoutData = view.getAbsoluteData(panel);
			layoutData.width = width;
			panel.adjustCells(list);
		});

		// Layout
		let height = this.position.getRequiredHeight();
		let listData = view.getAbsoluteData(this.listPanel);
		listData.width = width;
		listData.height = height;

		this.composite.relayout();

		// Selection
		if (this.listPanel.getElementCount() > 0) {
			if (this.selection.isMaxRowFlag()) {
				let count = this.listPanel.getElementCount();
				this.selection.focusSelection(count - 1, 0);
			} else {
				if (document.activeElement === undefined) {
					this.selection.enterSelection();
				}
			}
		}

		// Scroller
		this.scroller.refreshSize();

	}

	public getControl(): Control {
		return this.composite;
	}

}
