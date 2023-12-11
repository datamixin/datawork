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
import Point from "webface/graphics/Point";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import TableViewer from "webface/viewers/TableViewer";
import ContentProvider from "webface/viewers/ContentProvider";
import TableViewerStyle from "webface/viewers/TableViewerStyle";
import TableLabelProvider from "webface/viewers/TableLabelProvider";

import VisageTable from "bekasi/visage/VisageTable";
import VisageRecord from "bekasi/visage/VisageRecord";

import * as view from "padang/view/view";

import SurfaceRegistry from "padang/view/present/surface/SurfaceRegistry";

import BasePreloadPanel from "malang/directors/preloads/BasePreloadPanel";

export default class DatasetPreloadPanel extends BasePreloadPanel {

	private static DEFAULT_WIDTH = 480;
	private static DEFAULT_HEIGHT = 240;

	private size: Point = null;
	private table: VisageTable = null;
	private tableViewer: TableViewer = null;
	private labelProvider: TableSurfaceLabelProvider = null;
	private contentProvider: TableSurfaceContentProvider = null;

	constructor(caption: string, table: VisageTable, size: Point) {
		super(caption)
		this.table = table;
		this.size = size;
	}

	protected createContentControl(parent: Composite): void {
		let style = <TableViewerStyle>{
			marker: true,
			headerVisible: true
		}
		this.labelProvider = new TableSurfaceLabelProvider();
		this.contentProvider = new TableSurfaceContentProvider();
		this.tableViewer = new TableViewer(parent, style);
		this.tableViewer.setLabelProvider(this.labelProvider);
		this.tableViewer.setContentProvider(this.contentProvider);
		view.addClass(this.tableViewer, "malang-dataset-preload-panel");
		view.css(this.tableViewer, "border", "1px solid #E8E8E8");
		this.tableViewer.setInput(this.table);
	}

	public getRequiredSize(): Point {
		let width = this.size.x;
		let height = this.size.y;
		width = width === null || width === 0 ? DatasetPreloadPanel.DEFAULT_WIDTH : width;
		height = height === null || height === 0 ? DatasetPreloadPanel.DEFAULT_HEIGHT : height;
		return new Point(width, height);
	}

	public getContentControl(): Control {
		return this.tableViewer;
	}

}

class TableSurfaceLabelProvider implements TableLabelProvider {

	public getColumnCount(input: VisageTable): number {
		let columns = input.getColumns();
		return columns.length - 1;
	}

	public getColumnTitle(input: VisageTable, columnIndex: number): string {
		let columns = input.getColumns();
		let column = columns[columnIndex + 1];
		return column.getKey();
	}

	public getColumnText(record: VisageRecord, columnIndex: number): string {
		let value = record.get(columnIndex + 1);
		let registry = SurfaceRegistry.getInstance();
		return registry.getText(value);
	}

}

class TableSurfaceContentProvider implements ContentProvider {

	public getElementCount(input: VisageTable): number {
		return input.recordCount();
	}

	public getElement(input: VisageTable, index: number): any {
		return input.getRecord(index);
	}

}