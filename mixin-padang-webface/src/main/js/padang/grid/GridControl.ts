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

import VisageMutation from "padang/visage/VisageMutation";

import * as view from "padang/view/view";

import * as grid from "padang/grid/grid";
import GridColumnLabel from "padang/grid/GridColumnLabel";
import GridCornerPanel from "padang/grid/GridCornerPanel";
import GridHeaderPanel from "padang/grid/GridHeaderPanel";
import GridControlStyle from "padang/grid/GridControlStyle";
import GridRowListPanel from "padang/grid/GridRowListPanel";
import GridEventAdapter from "padang/grid/GridEventAdapter";
import GridLabelExtender from "padang/grid/GridLabelExtender";
import GridScrollPosition from "padang/grid/GridScrollPosition";
import GridContentProvider from "padang/grid/GridContentProvider";
import GridColumnOrganizer from "padang/grid/GridColumnOrganizer";
import GridMarkerListPanel from "padang/grid/GridMarkerListPanel";
import GridRowRangeSideline from "padang/grid/GridRowRangeSideline";
import GridCellRangeFeedback from "padang/grid/GridCellRangeFeedback";
import GridColumnRangeUnderline from "padang/grid/GridColumnRangeUnderline";

export default class GridControl extends Control {

	private composite: Composite = null;
	private style = new GridControlStyle();
	private provider = new DefaultContentProvider();
	private adapter: GridEventAdapter = new DefaultEventAdapter();
	private cornerPanel = new GridCornerPanel(this.style);
	private organizer: GridColumnOrganizer = null;
	private position = new GridScrollPosition();
	private sideline: GridRowRangeSideline = null;
	private underline: GridColumnRangeUnderline = null;
	private headerPanel = new GridHeaderPanel(this.style, this.position);
	private markerListPanel = new GridMarkerListPanel(this.style, this.position);
	private rowListPanel = new GridRowListPanel(this.style, this.position);

	public constructor(parent: Composite, style?: GridControlStyle, index?: number) {
		super(jQuery("<div>"), parent, index);
		this.composite = new Composite(this.element, index);

		this.element.addClass("padang-grid-control");
		this.element.css("z-index", 0);
		this.element.css("background-color", grid.LIGHT_COLOR);

		view.setGridLayout(this.composite, 2, 0, 0, 0, 0);
		this.style = jQuery.extend(this.style, style);

		this.createCornerPanel(this.composite);
		this.createHeaderPanel(this.composite);
		this.createMarkerListPanel(this.composite);
		this.createRowListPanel(this.composite);
		this.createUnderline(this.composite);
		this.createSideline(this.composite);
		this.createFeedback(this.composite);

	}

	private createCornerPanel(parent: Composite): void {
		this.cornerPanel.createControl(parent);
		let width = this.style.markerVisible ? this.style.markerWidth : 0;
		let height = this.style.headerVisible ? this.style.headerHeight : 0;
		view.setGridData(this.cornerPanel, width, height);
	}

	private createHeaderPanel(parent: Composite): void {
		this.headerPanel.createControl(parent);
		let height = this.style.headerVisible ? this.style.headerHeight : 0;
		view.setGridData(this.headerPanel, true, height);
	}

	private createUnderline(parent: Composite): void {
		this.underline = new GridColumnRangeUnderline(this.composite, this.style, this.position);
		this.headerPanel.setUnderline(this.underline);
		this.rowListPanel.setUnderline(this.underline);
	}

	private createMarkerListPanel(parent: Composite): void {
		this.markerListPanel.createControl(parent);
		let width = this.style.markerVisible ? this.style.markerWidth : 0;
		view.setGridData(this.markerListPanel, width, true);
	}

	private createSideline(parent: Composite): void {
		this.sideline = new GridRowRangeSideline(parent, this.style, this.position);
		this.markerListPanel.setSideline(this.sideline);
		this.rowListPanel.setSideline(this.sideline);
	}

	private createFeedback(parent: Composite): void {
		let feedback = new GridCellRangeFeedback(parent, this.style, this.position);
		this.rowListPanel.setFeedback(feedback);
	}

	private createRowListPanel(parent: Composite): void {

		this.rowListPanel.createControl(parent);
		this.rowListPanel.setAdapter(this.adapter);
		this.rowListPanel.setArranger(this.markerListPanel);

		this.headerPanel.setConsolidator(this.rowListPanel);
		this.markerListPanel.setConsolidator(this.rowListPanel);
		view.setGridData(this.rowListPanel, true, true);

		this.organizer = this.headerPanel.getOrganizer();
		this.rowListPanel.setOrganizer(this.organizer);
	}

	protected sizeChanged(changed: boolean): void {
		if (changed === true) {
			this.composite.resized();
			this.rowListPanel.refreshContent();
			this.markerListPanel.refreshContent();
			this.relayout();
		}
	}

	public setExtender(extender: GridLabelExtender): void {
		this.cornerPanel.setExtender(extender);
		this.headerPanel.setExtender(extender);
		this.rowListPanel.setExtender(extender);
		this.markerListPanel.setExtender(extender);
	}

	public setProvider(provider: GridContentProvider): void {
		this.provider = provider;
		this.rowListPanel.setProvider(provider);
	}

	public setAdapter(adapter: GridEventAdapter): void {
		this.adapter = adapter;
		this.rowListPanel.setAdapter(adapter);
	}

	public refresh(callback: () => void): void {
		this.provider.getColumnLabels((labels: GridColumnLabel[]) => {
			this.organizer.refreshColumns(labels);
			this.refreshRows(() => {
				callback();
			});
		});
	}

	public refreshRows(callback: () => void): void {
		this.provider.getRowCount((count: number) => {
			this.setRequiredHeight(count);
			this.markerListPanel.refresh(count);
			this.rowListPanel.refresh(count);
			this.relayout();
			callback();
		});
	}

	private setRequiredHeight(count: number): void {
		let required = count * this.style.rowHeight;
		this.position.setRequiredHeight(required);
	}

	public mutate(mutation: VisageMutation): void {

		let rowCount = mutation.getRowCount();
		this.setRequiredHeight(rowCount);

		let columnStart = mutation.getColumnStart();
		let columnEnd = mutation.getColumnEnd();
		if (columnStart < columnEnd) {
			this.provider.getColumnLabels((labels: GridColumnLabel[]) => {

				let organizer = this.headerPanel.getOrganizer();
				let changed = organizer.refreshColumns(labels);
				if (changed > 0) {
					this.relayout();
				}
				this.mutateRow(mutation);

			});
		} else {
			this.mutateRow(mutation);
		}
	}

	public setLeftOrigin(left: number): void {
		this.headerPanel.setLeftOrigin(left);
		this.rowListPanel.setLeftOrigin(left);
	}

	public setTopOrigin(top: number): void {
		this.markerListPanel.setTopOrigin(top);
		this.rowListPanel.setTopOrigin(top);
	}

	public setSelectedRow(index: number): void {
		this.rowListPanel.selectRow(index, false);
	}

	public setSelectedCell(row: number, column: number): void {
		this.rowListPanel.selectCell(row, column, false);
	}

	public setSelectedColumn(index: number): void {
		this.rowListPanel.selectColumn(index, false);
	}

	private mutateRow(mutation: VisageMutation): void {
		this.markerListPanel.mutate(mutation);
		this.rowListPanel.mutate(mutation, () => {
			this.relayout();
		});
	}

	public relayout(): void {
		this.headerPanel.relayout();
		this.markerListPanel.relayout();
		this.rowListPanel.relayout();
	}

	public getControl(): Control {
		return this.composite;
	}

}

class DefaultEventAdapter implements GridEventAdapter {

}

class DefaultContentProvider implements GridContentProvider {

	public getColumnLabels(callback: (labels: GridColumnLabel[]) => void): void {
		callback([]);
	}

	public getRowCount(callback: (count: number) => void): void {
		callback(0);
	}

	public getRowRange(rowStart: number, rowEnd: number, columnStart: number, columnEnd: number,
		callback: (map: Map<any, any[]>) => void): void {
		let map = new Map<any, any[]>();
		callback(map);
	}

}
