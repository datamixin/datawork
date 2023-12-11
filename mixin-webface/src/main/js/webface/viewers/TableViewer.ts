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
import * as webface from "webface/webface";
import * as functions from "webface/functions";

import Event from "webface/widgets/Event";
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";
import ScrollBar from "webface/widgets/ScrollBar";
import ScrollListener from "webface/widgets/ScrollListener";

import Viewer from "webface/viewers/Viewer";
import Selection from "webface/viewers/Selection";
import ContentProvider from "webface/viewers/ContentProvider";
import TableMarkerPane from "webface/viewers/TableMarkerPane";
import TableViewerCell from "webface/viewers/TableViewerCell";
import TableColumnMaker from "webface/viewers/TableColumnMaker";
import TableViewerStyle from "webface/viewers/TableViewerStyle";
import TableLabelProvider from "webface/viewers/TableLabelProvider";
import TableColumnTitlePane from "webface/viewers/TableColumnTitlePane";

import * as util from "webface/util/functions";

import FillLayout from "webface/layout/FillLayout";

import WebFontImage from "webface/graphics/WebFontImage";

export default class TableViewer extends Viewer {

	public static ITEM_HEIGHT: number = TableViewerStyle.ITEM_HEIGHT;
	public static HEADER_HEIGHT: number = TableViewerStyle.HEADER_HEIGHT;
	public static CELL_WIDTH: number = TableViewerStyle.CELL_WIDTH;
	public static MARKER_WIDTH: number = TableViewerStyle.MARKER_WIDTH;
	public static SCROLL_SPACE: number = 12;  // Lebar space sebelah kanan atau bawah.
	public static SCROLL_STEPS: number = 1;   // Jumlah index yang akan di lewati untuk satu tahap scroll.

	private style = new TableViewerStyle();
	private labelProvider: TableLabelProvider;
	private contentProvider: ContentProvider;
	private input: any = null;

	private horizontalScroll: ScrollBar;
	private verticalScroll: ScrollBar;

	private viewPort: ViewPort;
	private header: Header;
	private body: Body;

	private cellListeners: Listener[] = [];
	private markerListeners: Listener[] = [];
	private markerHeaderListeners: Listener[] = [];
	private columnHeaderListeners: Listener[] = [];
	private columnWidthListeners: Listener[] = [];
	private leftOriginListeners: Listener[] = [];
	private columnWidthChangedListeners: Listener[] = [];
	private itemDoubleClickListeners: Listener[] = [];

	constructor(parent: Composite, style?: TableViewerStyle, index?: number) {

		super(jQuery("<div>"), parent, index);
		this.element.addClass("scrollable");
		this.element.addClass("viewers-tableViewer");
		this.element.css({
			"position": "absolute",
			"overflow": "hidden"
		});

		util.bindMouseWheel(this.element, (deltaX: number, deltaY: number): number => {
			let step = deltaY * TableViewer.SCROLL_STEPS;
			let topIndex = this.getTopIndex();
			this.setTopIndex(topIndex - step);
			let newTopIndex = this.getTopIndex();
			return newTopIndex - topIndex;
		});

		this.style = jQuery.extend(new TableViewerStyle(), style);

		this.viewPort = new ViewPort(this.element, this.style,
			<WidthListener>{
				width: (index: number, width: number, total: number, post: boolean) => {

					let header = this.viewPort.getHeader();
					let value = header.getColumnsLeft();
					this.horizontalScroll.setRequired(total + (ResizeControl.WIDTH / 2));
					this.horizontalScroll.setValue(-value);

					let data: any = {};
					data.index = index;
					data.width = width;
					data.post = post;

					// Notify column width listener
					this.columnWidthListeners.forEach((listener) => {
						let event = this.createDataEvent(data);
						listener.handleEvent(event);
					});

				}
			},
			<OriginListener>{
				changed: (origin: number, stop: boolean) => {

					// Notify column width listener
					this.leftOriginListeners.forEach((listener) => {
						let data: any = {};
						data.origin = origin;
						data.stop = stop;
						let event = this.createDataEvent(data);
						listener.handleEvent(event);
					});

				}
			}
		);

		// Vertical scroll listener dimana value dalam pixel.
		let verticalScrollListener = <ScrollListener>{
			moved: (value: number, stop: boolean) => {
				let index = Math.round(value / this.style.itemHeight);
				this.setTopIndex(index);
			}
		}

		// Horizontal scroll listtener dimana value dalam pixel.
		let horizontalScrollListener = <ScrollListener>{
			moved: (value: number, stop: boolean) => {
				this.viewPort.setLeft(-value, true, stop);
			}
		}

		let oneScroll = this.style.itemHeight * TableViewer.SCROLL_STEPS;

		// Pembuatan vertical scrollbar
		this.verticalScroll = new ScrollBar(this.element, true, oneScroll, verticalScrollListener);

		// Pembuatan horizontal scrollbar
		this.horizontalScroll = new ScrollBar(this.element, false, 100, horizontalScrollListener);

		this.body = this.viewPort.getBody();
		this.header = this.viewPort.getHeader();

		this.body.addMarkerHeaderClickListener({

			click: (data: any) => {

				// Notify marker header listener
				this.markerHeaderListeners.forEach((listener) => {
					let event = this.createDataEvent(data);
					listener.handleEvent(event);
				});
			}
		});

		this.body.addMarkerClickListener({

			click: (row: number) => {

				// Notify selection changed listener 
				let element = this.contentProvider.getElement(this.input, row);
				this.notifySelectionChangedListener(element);

				// Notify markers listener
				this.markerListeners.forEach((listener) => {
					let event = this.createDataEvent(row);
					listener.handleEvent(event);
				});
			}
		});

		this.body.addCellListener({

			changed: (rowColumn: number[]) => {

				// Notify selection changed listener 
				let rowIndex = rowColumn[0];
				let element = this.contentProvider.getElement(this.input, rowIndex);
				this.notifySelectionChangedListener([element]);

				// Notify cells listener
				this.cellListeners.forEach((listener) => {
					let event = this.createDataEvent(rowColumn);
					listener.handleEvent(event);
				});
			}
		});

		this.body.addColumnHeaderClickListener({

			click: (columns: number[]) => {

				// Notify column headers listener
				this.columnHeaderListeners.forEach((listener) => {
					let event = this.createDataEvent(columns);
					listener.handleEvent(event);
				});
			}
		});

		this.body.addItemDoubleClickListener({

			dblclick: (index: number) => {

				let element = this.contentProvider.getElement(this.input, index);
				this.notifySelectionChangedListener([element]);

				// Notify column headers listener
				this.itemDoubleClickListeners.forEach((listener) => {
					let event = this.createDataEvent(element);
					listener.handleEvent(event);
				});
			}
		});

	}

	private createDataEvent(data: any): Event {
		let event = new Event();
		event.widget = this;
		event.type = webface.Selection;
		event.data = data;
		return event;
	}

	/**
	* Sesuaikan top index ke vertical scroll.
	*/
	private maintainVerticalScroll(): void {
		let value = this.getTopIndex() * this.style.itemHeight;
		this.verticalScroll.setValue(value);
	}

	/**
	 * Sesuaikan left ke horizontal scroll.
	 */
	private maintainHorizontalScroll(): void {
		let value = this.viewPort.getLeft();
		this.horizontalScroll.setValue(-value);
		this.viewPort.setLeft(value, false, true);
	}

	public setLabelProvider(provider: TableLabelProvider): void {
		this.labelProvider = provider;
		this.viewPort.setLabelProvider(provider);
	}

	public getLabelProvider(): TableLabelProvider {
		return this.labelProvider;
	}

	public getContentProvider(): ContentProvider {
		return this.contentProvider;
	}

	public setContentProvider(provider: ContentProvider): void {
		this.contentProvider = provider;
		this.viewPort.setContentProvider(provider);
	}

	public setInput(input: any) {
		if (functions.isNullOrUndefined(input)) {
			throw new Error("TableViewer input cannot be null");
		}
		this.setSelection(null);
		this.input = input;
		this.viewPort.setInput(input);
		let width = this.element.outerWidth();
		let height = this.element.outerHeight();
		if (width > 0 && height > 0) {
			this.layout();
		}
	}

	public getInput(): any {
		return this.input;
	}

	/**
	 * Ambil index paling atas dari record yang tampil.
	 */
	public getTopIndex(): number {
		return this.viewPort.getTopIndex();
	}

	/**
	 * Ganti index paling atas untuk record yang akan ditampilkan.
	 */
	public setTopIndex(index: number): void {

		// Normalisasi index agar tidak keluar range.
		let lastTopIndex = this.body.getLastTopIndex();
		let firstIndex = 0;
		if (index < firstIndex) {
			index = firstIndex;
		}
		if (index > lastTopIndex) {
			index = lastTopIndex;
		}

		// Tidak perlu scroll jika index sama
		if (index === this.viewPort.getTopIndex()) {
			return;
		}

		this.viewPort.setTopIndex(index);
		this.maintainVerticalScroll();
	}

	public getVisibleItems(): number {
		return this.viewPort.getVisibleItems();
	}

	public getColumns(): TableViewerColumn[] {
		return this.header.getColumns();
	}

	public getLastTopIndex(): number {
		return this.viewPort.getLastTopIndex();
	}

	protected sizeChanged(changed: boolean): void {
		if (changed === true) {
			this.layout();
		}
	}

	/**
	 * Lakukan penyesuaian view port sesuai height dan width.
	 *
	 * @param caller
	 *            untuk mengetahui pemanggil layout guna menghindari looping
	 *            overflow karena proses layout dapat di panggil dari dalam.
	 */
	public layout(): void {

		let space: number = TableViewer.SCROLL_SPACE;
		let width: number = this.element.width();
		let height: number = this.element.height();
		let itemHeight: number = this.style.itemHeight;

		let viewWidth = width - space;
		let viewHeight = height - space;

		this.viewPort.setWidth(viewWidth);
		this.viewPort.setHeight(viewHeight);

		// Kalkulasi kebutuhan vertical scroll.
		let requiredHeight = itemHeight * this.body.getRequiredItems();

		let viewElementHeight = this.viewPort.getElementHeight();
		let availableHeight = viewElementHeight - this.header.getElementHeight();

		// Kalkulasi kebutuhan horizontal scroll.
		let viewElementWidth = this.viewPort.getElementWidth();
		let requiredWidth = this.header.getColumnsWidth();

		let availableWidth = viewElementWidth - this.header.getMarkerWidth();

		// Kondisi jika ada item yang terpotong.
		if (availableHeight % itemHeight > 0) {
			requiredHeight += availableHeight % itemHeight;
		}

		requiredWidth += 2;

		this.verticalScroll.prepare(requiredHeight, availableHeight, space, viewElementHeight);
		this.horizontalScroll.prepare(requiredWidth, availableWidth, viewElementWidth, space);

		this.maintainVerticalScroll();
		this.maintainHorizontalScroll();

		this.body.relayout();
	}

	public refresh(reload?: boolean): void {
		let topIndex = this.viewPort.getTopIndex();
		if (reload === undefined || reload === true) {
			this.viewPort.setInput(this.input);
		}
		this.viewPort.setTopIndex(topIndex);
	}

	public setSelection(selection: Selection): void {
		super.setSelection(selection);

		if (selection !== null && !selection.isEmpty()) {
			let element = selection.getFirstElement();

			let elementCount = this.contentProvider.getElementCount(this.input);
			for (let i = 0; i < elementCount; i++) {

				// Cek element dari content dan selection.
				let currentElement = this.contentProvider.getElement(this.input, i);
				if (functions.isEquals(element, currentElement)) {
					this.setSelectedIndex(i);
					break;
				}
			}
		}
	}

	public setSelectedIndex(index: number): void {
		this.viewPort.setSelectedIndex(index);
	}

	public setSelectedCell(row: number, column: number): void {
		this.viewPort.setSelectedCell(row, column);
	}

	public setSelectedColumns(columns: number[]): void {
		this.viewPort.setSelectedColumns(columns);
	}

	public setLeftOrigin(left: number): void {
		if (!isNaN(left)) {
			this.horizontalScroll.setValue(left);
			this.viewPort.setLeft(-left, false, true);
		}
	}

	public addMarkerHeaderListener(listener: Listener): void {
		this.markerHeaderListeners.push(listener);
	}

	public addMarkerListener(listener: Listener): void {
		this.markerListeners.push(listener);
	}

	public addColumnHeaderListener(listener: Listener): void {
		this.columnHeaderListeners.push(listener);
	}

	public addCellListener(listener: Listener): void {
		this.cellListeners.push(listener);
	}

	public addLeftOriginListener(listener: Listener): void {
		this.leftOriginListeners.push(listener);
	}

	public addColumnWidthListener(listener: Listener): void {
		this.columnWidthListeners.push(listener);
	}

	public addColumnWidthChangedListener(listener: Listener): void {
		this.columnWidthChangedListeners.push(listener);
	}

	public addItemDoubleClickListener(listener: Listener): void {
		this.itemDoubleClickListeners.push(listener);
	}

}

export interface TableViewerColumn {

	getIndex(): number;

	getWidth(): number;

	getPane(): TableColumnTitlePane;
}

interface BodyContainer {

	getBody(): Body;

}

class Suspender {

	private width: number = 0;
	private left: number = 0;
	private provider: TableLabelProvider = null;
	private input: any = null;
	private columnCreations: any[] = [];
	private columnFormations: any[] = [];

	public setLabelProvider(provider: TableLabelProvider): void {
		this.provider = provider;
	}

	public setInput(input: any): void {
		this.input = input;
		this.columnCreations = [];
		this.columnFormations = [];
		this.init(this.columnCreations);
		this.init(this.columnFormations);
	}

	private init(list: any[]): void {
		let count = this.provider.getColumnCount(this.input);
		for (let i = 0; i < count; i++) {
			list.push([]);
		}
	}

	public setWidth(width: number): void {
		this.width = width;
		this.performs();
	}

	public setColumnsLeft(left: number): void {
		this.left = left;
		this.performs();
	}

	private performs(): void {
		this.performCreations();
		this.preformFormations();
	}

	private performCreations(): void {
		for (let i = 0; i < this.columnCreations.length; i++) {
			let creations = <any[]>this.columnCreations[i];
			if (creations === null) {
				continue;
			}
			if (creations.length > 0) {
				if (this.isCreationSuspended(i) === false) {
					for (let creation of creations) {
						creation();
					}
					this.columnCreations[i] = null;
				}
			}
		}
	}

	private preformFormations(): void {
		for (let i = 0; i < this.columnFormations.length; i++) {
			let formations = <any[]>this.columnFormations[i];
			if (formations === null) {
				continue;
			}
			if (formations.length > 0) {
				if (this.isFormationSuspended(i) === false) {
					for (let formation of formations) {
						formation();
					}
					this.columnFormations[i] = null;
				}
			}
		}
	}

	public isCreationSuspended(index: number): boolean {
		if (this.columnCreations[index] === null) {
			return false;
		}
		let count = this.provider.getColumnCount(this.input);
		let left = 0;
		let right = 0;
		for (let i = 0; i < count; i++) {
			left = right;
			right += this.getColumnWidth(i);
			if (i == index) {
				break;
			}
		}
		let max = this.width - this.left;
		let suspended = left >= max;
		return suspended;
	}

	public queueCreation(index: number, callback: () => void): void {
		let list = <any[]>this.columnCreations[index];
		list.push(callback);
	}

	private getColumnWidth(index: number): number {
		let width = TableViewer.CELL_WIDTH;
		if (this.provider.getColumnWidth !== undefined) {
			let columnWidth = this.provider.getColumnWidth(this.input, index);
			width = columnWidth.getWidth();
		}
		return width;
	}

	public isFormationSuspended(index: number): boolean {
		if (this.columnFormations[index] === null) {
			return false;
		}
		let count = this.provider.getColumnCount(this.input);
		let left = 0;
		let right = 0;
		for (let i = 0; i < count; i++) {
			left = right;
			right += this.getColumnWidth(i);
			if (i == index) {
				break;
			}
		}
		let max = this.width - this.left;
		let suspended = left >= max || right <= -this.left;
		return suspended;
	}

	public queueFormation(index: number, callback: () => void): void {
		let list = <any[]>this.columnFormations[index];
		list.push(callback);
	}

}

class ViewPort implements BodyContainer {

	private element: JQuery;
	private leftOriginListener: OriginListener = null;
	private suspender: Suspender = null;
	private header: Header;
	private body: Body;

	constructor(parent: JQuery, style: TableViewerStyle,
		widthListener: WidthListener, leftOriginListener: OriginListener) {
		this.element = jQuery("<div>");
		this.element.addClass("viewers-tableViewer-viewPort");
		this.element.css({
			"overflow": "hidden",
			"float": "left"
		});
		parent.append(this.element);

		this.leftOriginListener = leftOriginListener;
		this.suspender = new Suspender();
		this.header = new Header(this.element, this.suspender, this, style, widthListener);
		this.body = new Body(this.element, this.suspender, this.header, style);

	}

	public getHeader(): Header {
		return this.header;
	}

	public getBody(): Body {
		return this.body;
	}

	public setLabelProvider(provider: TableLabelProvider): void {
		this.suspender.setLabelProvider(provider);
		this.header.setLabelProvider(provider);
		this.body.setLabelProvider(provider);
	}

	public setContentProvider(provider: ContentProvider): void {
		this.body.setContentProvider(provider);
	}

	public setInput(input: any): void {
		this.suspender.setInput(input);
		this.header.setInput(input);
		this.body.setInput(input);
	}

	public getElementHeight(): number {
		let domElement = this.element.get(0);
		let rect = domElement.getBoundingClientRect();
		return rect.height;
	}

	public getElementWidth(): number {
		let domElement = this.element.get(0);
		let rect = domElement.getBoundingClientRect();
		return rect.width;
	}

	public getVisibleItems(): number {
		return this.body.getVisibleItems();
	}

	public setTopIndex(index: number): void {
		this.body.setTopIndex(index);
	}

	public getTopIndex(): number {
		return this.body.getTopIndex();
	}

	public getLastTopIndex(): number {
		return this.body.getLastTopIndex();
	}

	public setWidth(width: number): void {
		this.suspender.setWidth(width);
		this.element.width(width);
		this.header.setWidth(width);
		this.body.setWidth(width);
	}

	public setHeight(height: number): void {
		this.element.height(height);
		let headerHeight = this.header.getHeight();
		this.body.setHeight(height - headerHeight);
	}

	public setLeft(left: number, notify: boolean, stop: boolean): void {
		this.suspender.setColumnsLeft(left);
		this.header.setColumnsLeft(left);
		this.body.setItemsLeft(left);
		if (notify === true) {
			this.leftOriginListener.changed(-left, stop);
		}
	}

	public getLeft(): number {
		return this.header.getColumnsLeft();
	}

	public setSelectedIndex(index: number): void {
		this.body.setSelectedIndex(index);
	}

	public setSelectedCell(row: number, column: number): void {
		this.body.setSelectedCell(row, column);
	}

	public setSelectedColumns(columns: number[]): void {
		this.body.setSelectedColumnHeaders(columns);
	}

}

class Header {

	private labelProvider: TableLabelProvider;
	private style: TableViewerStyle;
	private markerHeaderClickListeners: ClickListener[] = [];
	private markerSelected = false;
	private markerTitleControl: Control = null;
	private columnsContainer: ColumnsContainer = null;
	private resizeControl: ResizeControl;
	private element: JQuery;
	private marker: JQuery = null;

	constructor(parent: JQuery, suspender: Suspender, bodyContainer: BodyContainer,
		style: TableViewerStyle, widthListener: WidthListener) {

		this.element = jQuery("<div>");
		this.element.addClass("viewers-tableViewer-header");
		this.element.css({
			"position": "relative",
			"width": "inherit",
			"height": "100%",
			"border-bottom-width": "1px",
			"overflow": "hidden"
		});
		parent.append(this.element);

		if (!style.headerVisible) {
			this.element.hide();
		}

		if (style.marker === true) {

			// Table marker di pojok kiri atas.
			this.marker = jQuery("<div>");
			this.marker.addClass("viewers-tableViewer-header-marker");
			this.marker.css({
				"float": "left",
				"height": "inherit",
				"border-right-width": "1px",
			});

			if (style.markerWidth === webface.DEFAULT) {
				this.marker.width(TableViewer.MARKER_WIDTH);
			} else {
				this.marker.width(style.markerWidth);
			}

			this.element.append(this.marker);

			this.marker.on("click", () => {
				this.markerHeaderClickListeners.forEach((listener) => {
					listener.click(this);
				});
			});

		}

		// Columns container untuk menampilkan column
		this.columnsContainer = new ColumnsContainer(this.element, this, suspender, style);

		// Resizer di buat setelah column container
		this.resizeControl = new ResizeControl(this.element, this, bodyContainer, widthListener);

		this.style = style;
	}

	public setMarkerSelected(state: boolean): void {
		if (this.markerSelected === state) {
			return;
		}
		this.markerSelected = state;
		if (this.markerSelected) {
			this.marker.addClass("selected");
		} else {
			this.marker.removeClass("selected");
		}
	}

	/**
	 * Berikan kolum untuk di tampilkan di header.
	 */
	public setLabelProvider(provider: TableLabelProvider): void {
		this.labelProvider = provider;
		this.columnsContainer.setLabelProvider(provider);
	}

	public createResizeFunction(column: Column): any {
		return this.resizeControl.getFunction(column);
	}

	/**
	 * Berikan input untuk di ukur lebar text-nya.
	 */
	public setInput(input: any): void {

		this.columnsContainer.setInput(input);

		/**
		 * Update height ke semua bagian header.
		 */
		let height = this.getHeight();
		if (this.style.headerVisible === true) {

			this.element.height(height);
			this.resizeControl.setHeight(height);

			if (this.marker !== null) {

				if (this.labelProvider.getMarkerWidth !== undefined) {

					let markerWidth = this.labelProvider.getMarkerWidth();
					this.marker.outerWidth(markerWidth);
				}

				if (this.labelProvider.getMarkerTitlePane !== undefined) {

					let pane = this.labelProvider.getMarkerTitlePane();
					if (!functions.isNullOrUndefined(pane)) {

						if (this.markerTitleControl !== null) {
							this.markerTitleControl.dispose();
						}

						let composite = new Composite(this.marker);
						let layout = new FillLayout();
						composite.setLayout(layout);

						pane.createControl(composite);
						this.markerTitleControl = pane.getControl();

						composite.relayout();
					}
				}
			}

		}
	}

	/**
	 * Ambil colom di index tertentu.
	 */
	public getColumn(index: number): Column {
		return this.columnsContainer.getColumn(index);
	}

	public getColumns(): Column[] {
		return this.columnsContainer.getColumns();
	}

	public setWidth(width: number): void {
		let markerWidth = this.getMarkerWidth();
		let headerWidth = width - markerWidth;
		this.columnsContainer.setWidth(headerWidth);
	}

	public getColumnsWidth(): number {
		return this.columnsContainer.getColumnsWidth();
	}

	public getWindowWidth(): number {
		return this.columnsContainer.getWindowWidth();
	}

	public getHeight(): number {
		return this.style.headerHeight;
	}

	public getElementHeight(): number {
		return this.element.get(0).getBoundingClientRect().height;
	}

	public setColumnsLeft(left: number): void {
		this.columnsContainer.setColumnsLeft(left);
	}

	public getColumnsLeft(): number {
		return this.columnsContainer.getColumnsLeft();
	}

	public getMarkerWidth(): number {
		if (this.marker !== null) {
			return this.marker.outerWidth();
		} else {
			return 0;
		}
	}

	public showSelectedColumns(indexes: number[]): void {
		this.columnsContainer.showSelectedColumns(indexes);
	}

	public addMarkerHeaderClickListener(listener: ClickListener): void {
		this.markerHeaderClickListeners.push(listener);
	}

	public addColumnClickListener(listener: ClickListener): void {
		this.columnsContainer.addClickListener(listener);
	}

}

class ColumnsContainer {

	private labelProvider: TableLabelProvider;
	private columns: Column[] = [];
	private suspender: Suspender = null;
	private listeners: ClickListener[] = [];
	private selectedColumnIndexes: number[] = [];
	private left: number = 0;
	private width: number = 0;
	private input: any = null;
	private header: Header = null;
	private window: JQuery;
	private element: JQuery;

	constructor(parent: JQuery, header: Header, suspender: Suspender, style: TableViewerStyle) {

		this.window = jQuery("<div>");
		this.window.addClass("tableViewer-columnsCont-window");
		this.window.css({
			"line-height": (style.headerHeight) + "px",
			"overflow": "hidden",
		});
		parent.append(this.window);

		// Semua kolom ditampung dalam columnsCont.
		this.element = jQuery("<div>");
		this.element.addClass("tableViewer-columnsCont");
		this.element.css({
			"position": "relative",
			"width": "max-content"
		});

		if (style.lineVisible) {
			this.element.addClass("lineShow");
		} else {
			this.element.addClass("lineHide");
		}
		this.window.append(this.element);

		this.suspender = suspender;
		this.header = header;
		this.element.height(style.headerHeight);

	}

	/**
	 * Hapus columns selection yang ada.
	 */
	private clearColumnsSelection(): void {
		this.selectedColumnIndexes.forEach((index) => {
			let selectedColumn = this.columns[index];
			if (selectedColumn) {
				selectedColumn.setSelected(false);
			}
		});
		this.selectedColumnIndexes = [];
	}

	/**
	 * Berikan daftar kolom untuk di tampilkan.
	 */
	public setLabelProvider(provider: TableLabelProvider): void {
		this.labelProvider = provider;
	}

	public setInput(input: any): void {

		this.input = input;

		// Reset daftar kolom yang sudah ada.
		this.columns.forEach((column) => {
			column.remove();
		});
		this.columns = [];
		this.element.empty();
		this.left = 0;

		// Daftar kolom dari contents.
		let columnCount = 0;
		if (input !== null) {
			columnCount = this.labelProvider.getColumnCount(input);
		}
		for (let i = 0; i < columnCount; i++) {

			// Buat column
			let column = new Column(this.element, this.header, this.suspender, this, this.labelProvider, i);
			column.setInput(input);

			// Kendalikan column selection.
			column.addClickListener(<ClickListener>{
				click: (target: any) => {
					let column = <Column>target;
					for (let i = 0; i < this.listeners.length; i++) {
						let listener = this.listeners[i];
						let index = column.getIndex();
						this.selectedColumnIndexes.push(index);
						listener.click(column);
					}
				}
			});

			this.columns.push(column);
		}

	}

	public getColumn(index: number): Column {
		return this.columns[index];
	}

	public getColumns(): Column[] {
		return this.columns;
	}

	public setWidth(width: number): void {

		if (this.width === width) {
			return;
		}

		let windowWidth = this.window.outerWidth();
		let requiredWidth = this.getRequiredWidth();
		if (requiredWidth >= windowWidth) {

			// Ada kemungkinan left harus berubah karena left sudah maximum
			let drift = windowWidth - (requiredWidth + this.left);
			if (drift > 0) {
				this.setColumnsLeft(this.left + drift);
			}
		}

		this.width = width;

	}

	public getRequiredWidth(): number {

		let requiredWidth = 0;
		for (let i = 0; i < this.columns.length; i++) {

			let columnWidth;
			if (this.labelProvider.getColumnWidth !== undefined) {
				columnWidth = this.labelProvider.getColumnWidth(this.input, i);
			}

			if (columnWidth === undefined) {
				requiredWidth += TableViewer.CELL_WIDTH;
			} else {
				if (columnWidth.getWidth !== undefined) {
					let width = columnWidth.getWidth();
					requiredWidth += width;
				} else {
					requiredWidth += TableViewer.CELL_WIDTH;
				}
			}
		}
		return requiredWidth;
	}

	public getColumnsWidth(): number {
		let totalWidth = 0;
		for (let i = 0; i < this.columns.length; i++) {
			let column = this.columns[i];
			let width = column.getWidth();
			totalWidth += width;
		}
		return totalWidth;
	}

	public getWindowWidth(): number {
		return this.window.outerWidth();
	}

	public setColumnsLeft(value: number) {
		this.left = value;
		this.element.css("left", value);
	}

	public getColumnsLeft(): number {
		return this.left;
	}

	public showSelectedColumns(indexes: number[]): void {
		this.clearColumnsSelection();
		this.selectedColumnIndexes = indexes;
		this.selectedColumnIndexes.forEach((index) => {
			let selectedColumn = this.columns[index];
			if (selectedColumn) {
				selectedColumn.setSelected(true);
			}
		});
	}

	public addClickListener(listener: ClickListener): void {
		this.listeners.push(listener);
	}
}

class Column implements TableViewerColumn {

	private columnsContainer: ColumnsContainer;
	private labelProvider: TableLabelProvider;
	private width: number = TableViewer.CELL_WIDTH;
	private clickListeners: ClickListener[] = [];
	private widthListeners: WidthListener[] = [];
	private header: Header = null;
	private suspender: Suspender = null;
	private container: Composite = null;
	private pane: TableColumnTitlePane = null;
	private selected: boolean = false;
	private input: any = null;
	private index: number;

	private parent: JQuery = null;
	private element: JQuery = null;

	constructor(parent: JQuery, header: Header, suspender: Suspender,
		columnsContainer: ColumnsContainer, labelProvider: TableLabelProvider, index: number) {

		this.header = header;
		this.parent = parent;
		this.suspender = suspender;
		this.index = index;
		this.columnsContainer = columnsContainer;
		this.labelProvider = labelProvider;

		if (this.suspender.isCreationSuspended(this.index)) {
			this.suspender.queueCreation(this.index, () => {
				this.createElement();
			});
		} else {
			this.createElement();
		}
	}

	private createElement(): void {

		this.element = jQuery("<div>");
		this.element.addClass("viewers-tableViewer-header-column");

		this.width = TableViewer.CELL_WIDTH;
		if (this.labelProvider.getColumnWidth !== undefined) {
			let columnWidth = this.labelProvider.getColumnWidth(this.input, this.index);
			this.width = columnWidth.getWidth();
		}

		this.element.css({
			"float": "left",
			"height": "inherit",
			"overflow": "hidden",
			"position": "relative",
			"line-height": "inherit",
			"border-right-width": "1px",
			"width": this.width + "px",
		});
		this.parent.append(this.element);

		this.element.on("click", () => {
			this.clickListeners.forEach((listener) => {
				listener.click(this);
			});
		});

		this.revealSelection();
		this.element.on("mousemove", this.header.createResizeFunction(this));
	}

	private notifyWidthListeners(post: boolean): void {
		this.widthListeners.forEach((listener) => {
			let total = this.columnsContainer.getColumnsWidth();
			listener.width(this.index, this.width, total, post);
		});
	}

	public setInput(input: any): void {
		this.input = input;
		if (this.suspender.isFormationSuspended(this.index)) {
			this.suspender.queueFormation(this.index, () => {
				this.createPane();
			})
		} else {
			this.createPane();
		}
	}

	private createPane(): void {

		// Siapkan composite menampung pane
		this.container = new Composite(this.element);
		let layout = new FillLayout();
		this.container.setLayout(layout);

		let isDefaultPane = false;
		if (this.labelProvider.getColumnTitlePane === undefined) {
			isDefaultPane = true;
		} else {
			let pane = this.labelProvider.getColumnTitlePane(this.input, this.index);
			if (functions.isNullOrUndefined(pane)) {
				isDefaultPane = true;
			}
		}

		// Pembuatan pane
		if (isDefaultPane === true) {

			// Pane menggunakan default 
			let pane = new DefaultTableColumnTitlePane();
			pane.createControl(this.container);
			let label = this.labelProvider.getColumnTitle(this.input, this.index);
			pane.setText(label);
			this.pane = pane;

		} else {

			// Pane menggunakan custom dari provider 
			let pane = this.labelProvider.getColumnTitlePane(this.input, this.index);
			pane.createControl(this.container);
			this.pane = pane;

		}

		// Relayout composite dan listener ke width changed listener
		this.addWidthListener({
			width: (index: number, width: number, total: number, post: boolean) => {
				this.container.setSize(width, webface.DEFAULT);
			}
		});

		this.container.relayout();

	}

	public setWidth(width: number, notify: boolean): void {

		if (this.width === width) {
			return;
		}

		// Setting width
		this.width = width;
		this.element.outerWidth(width);
		this.adjustContainer();

		if (notify === true) {
			this.notifyWidthListeners(false);
		}

	}

	private adjustContainer(): void {
		let height = this.header.getHeight();
		this.container.setSize(this.width, height);
	}

	public setSelected(state: boolean): void {
		if (this.selected === state) {
			return;
		}
		this.selected = state;
		if (this.element === null) {
			return;
		}
		this.revealSelection();
	}

	private revealSelection(): void {
		if (this.selected) {
			this.element.addClass("selected");
		} else {
			this.element.removeClass("selected");
		}
	}

	public getWidth(): number {
		return this.width;
	}

	public getElementWidth(): number {
		return this.element.get(0).getBoundingClientRect().width;
	}

	public getLeft(): number {
		let offset = this.element.offset();
		return offset.left;
	}

	public getPane(): TableColumnTitlePane {
		return this.pane;
	}

	public getIndex(): number {
		return this.index;
	}

	public remove(): void {
		if (this.element !== null) {
			this.element.remove();
		}
	}

	public addClickListener(listener: ClickListener): void {
		this.clickListeners.push(listener);
	}

	public addWidthListener(listener: WidthListener) {
		this.widthListeners.push(listener);
	}
}

/**
 * Resizer berupa div yang dapat di geser untuk mengatur labar kolom
 */
class ResizeControl {

	public static WIDTH: number = 8;

	private header: Header;
	private bodyContainer: BodyContainer;
	private widthListener: WidthListener;

	private columnIndex = 0; // Index dari kolom yang akan di resize.
	private dragging = false; // Agar hanya satu dragging proses yang bisa.
	private element: JQuery;
	private parent: JQuery;

	public constructor(parent: JQuery, header: Header, bodyContainer: BodyContainer,
		widthListener: WidthListener) {

		this.element = jQuery("<div>");
		this.element.addClass("viewers-tableViewer-header-resizeControl");
		this.element.width(0);
		this.element.css({
			"background-color": "tranparent",
			"cursor": "ew-resize",
			"position": "absolute",
			"top": "0",
		})
		this.element.draggable({

			axis: "x",

			drag: (event: JQueryEventObject) => {

				this.run(event, (index: number, width: number) => {
					this.setWidth(index, width, false);
				});
				this.dragging = true;
			},

			stop: (event: JQueryEventObject) => {

				this.run(event, (index: number, width: number) => {
					this.setWidth(index, width, true);
				});
				this.dragging = false;

			}
		});

		parent.append(this.element);

		this.element.on("dblclick", function() {

		});

		this.parent = parent;
		this.header = header;
		this.bodyContainer = bodyContainer;
		this.widthListener = widthListener;
	}

	private setWidth(index: number, width: number, post: boolean) {

		let column = this.header.getColumn(index);
		let body = this.bodyContainer.getBody();

		let columnsWidth = this.header.getColumnsWidth();

		let windowWidth = this.header.getWindowWidth();
		let maxWidth = Math.max(columnsWidth, windowWidth);
		body.setItemsWidth(maxWidth);

		column.setWidth(width, true);
		let appliedWidth = column.getWidth();

		// Ubah semua lebar cell di index di semua item.
		let items = body.getItems();
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			let cell = item.getCell(index);
			if (cell !== undefined) {
				cell.setWidth(appliedWidth);
			}
		}

		this.widthListener.width(index, width, columnsWidth, post);
	}

	private run(event: JQueryEventObject, callback: (index: number, width: number) => void) {

		let column = this.header.getColumn(this.columnIndex);
		let parentOffset = this.parent.offset();
		let left = column.getLeft();

		let targetLeft = event.target["offsetLeft"];
		let width = Math.round(targetLeft - left + parentOffset.left + ResizeControl.WIDTH / 2);

		if (width > ResizeControl.WIDTH) {
			callback(this.columnIndex, width);
		}
	}

	public getFunction(column: Column): any {
		return (e: any) => {
			if (this.dragging === true) {
				return;
			}
			let x = 0;
			let show = false;
			let spare = ResizeControl.WIDTH / 2;

			let columnWidth = column.getWidth();
			let columnLeft = column.getLeft();
			let columnIndex = column.getIndex();
			let parentOffset = this.parent.offset();

			let event = (<JQueryEventObject>e);
			let mouseClientX = event.clientX;
			let mouseXDelta = mouseClientX - columnLeft;

			let columnWidthElement = column.getElementWidth();

			// Resize control di sisi kanan.
			if (columnWidthElement - mouseXDelta <= spare) {
				x = columnLeft + columnWidth - spare - parentOffset.left;
				show = true;
			}

			// Resize control di sisi kiri.
			if (mouseXDelta <= spare) {
				x = columnLeft - spare - parentOffset.left;
				show = this.columnIndex > 0;
				columnIndex = columnIndex - 1;
			}

			// Tampilkan resize control di perbatasan.
			if (show) {
				this.element.width(ResizeControl.WIDTH);
				this.element.css("left", x);
				this.columnIndex = columnIndex;
			}
		}
	}

	public setHeight(height: number) {
		this.element.height(height);
	}
}

interface EditSession {

	setEnteredCell(cell: Cell): void;

}

class Body implements EditSession {

	private header: Header = null;
	private suspender: Suspender = null;

	private markers: Marker[] = []; // daftar marker yang ada didalam buffer ini.
	private markersContainer: MarkersContainer = null;

	private bufferedItems: Item[] = []; // daftar item yang ada didalam buffer ini
	private itemsContainer: ItemsContainer;

	private labelProvider: TableLabelProvider; // Yang akan memberikan label.
	private contentProvider: ContentProvider; // Yang akan memberikan content.
	private input: any = null; // Sumber data yang akan ditampilkan.
	private height: number = 0;
	private style: TableViewerStyle;
	private columnCount: number = 0; // Jumlah kolom yang ditampilkan, tidak termasuk marker.
	private topIndex: number = 0; // Index didalam provider untuk item pertama.
	private lastTopIndex: number = 0; // Top index terakhir yang dapat di tampilkan.
	private enteredCell: Cell = null;

	private markerHeaderClickListeners: ClickListener[] = [];
	private columnHeaderClickListeners: ClickListener[] = [];
	private itemDoubleClickListeners: DoubleClickListener[] = [];
	private markerItemClickListeners: ClickListener[] = [];
	private cellListeners: CellListener[] = [];

	private selectedColumnHeaders: number[] = []; // daftar selected column header
	private selectedMarkerItems: number[] = []; // daftar selected marker item
	private selectedCells: number[][] = []; // daftar selected cell (row, column)

	private visibleItems: number = 0; // Jumlah rows/items yang terlihat penuh.
	private requiredItems: number = 0; // Jumlah items yang semestinya di tampilkan.
	private lastItemCut: boolean = true; // True jika item terakhir yang ditampilkan terpotong.

	/**
	 * Buffer dibuat di dalam satu div yang posisinya absolute.
	 */
	private element: JQuery;

	constructor(parent: JQuery, suspender: Suspender, header: Header, style: TableViewerStyle) {

		this.element = jQuery("<div>");
		this.element.addClass("viewers-tableViewer-body");
		this.element.css({
			"overflow": "hidden",
			"background-color": "white",
			"position": "relative"
		});
		parent.append(this.element);

		// Buat markersContainer di sebelah kanan.
		if (style.marker) {
			this.markersContainer = new MarkersContainer(this.element, style);
		}

		if (style.cellEditable === true) {
			this.element.attr("tabindex", "0");
			this.element.on("click", () => {
				this.element.focus();
			})
			this.element.on("keydown", (event: JQueryEventObject) => {
				if (event.which === 13) {
					this.changeCellSelection(0, 1);
					this.enteredCell = null;
				} else if (event.which === 27) {
					this.element.focus();
				} else {
					if (this.enteredCell === null) {
						if (event.which === 37) {
							this.changeCellSelection(-1, 0);
						} else if (event.which === 38) {
							this.changeCellSelection(0, -1);
						} else if (event.which === 39) {
							this.changeCellSelection(1, 0);
						} else if (event.which === 40) {
							this.changeCellSelection(0, 1);
						} else {
							this.enterCellEdit();
						}
					}
				}
			});
		}

		// Daftar item setelah marker.
		this.itemsContainer = new ItemsContainer(this.element, header);

		this.suspender = suspender;
		this.header = header;
		this.style = style;

		this.header.addMarkerHeaderClickListener(<ClickListener>{
			click: () => {

				this.clearSelections();
				this.header.setMarkerSelected(true);
				this.notifyMarkerHeaderClickListener();
			}
		});

		this.header.addColumnClickListener(<ClickListener>{

			click: (column: Column) => {

				this.clearSelections();

				let index = column.getIndex();
				this.addSelectedHeaderColumn(index);
				this.bufferedItems.forEach((item) => {
					item.setSelectedCells([index]);
				});

				this.notifyColumnHeaderClickListeners();

			}
		});
	}

	public setEnteredCell(cell: Cell): void {
		this.enteredCell = cell;
	}

	private changeCellSelection(x: number, y: number): void {
		if (this.selectedCells.length > 0) {
			let cell = this.selectedCells[0];
			let rowCount = this.contentProvider.getElementCount(this.input);
			let columnCount = this.labelProvider.getColumnCount(this.input);
			let row = cell[0] + y;
			if (row < 0) {
				row = 0;
			} else if (row >= rowCount) {
				row = rowCount - 1;
			}
			let column = cell[1] + x;
			if (column < 0) {
				column = 0;
			} else if (column >= columnCount) {
				column = columnCount - 1;
			}
			if (this.labelProvider.isValidValue) {
				if (!this.labelProvider.isValidValue(this.input, row, column)) {
					column = cell[1];
					row = cell[0];
				}
			}
			this.setSelectedCell(row, column);
			this.notifyCellListeners();
			this.element.focus();
		}
	}

	private enterCellEdit(): void {
		let cell = this.selectedCells[0];
		let row = cell[0];
		let column = cell[1];
		let itemIndex = this.getItemIndex(row);
		let item = this.bufferedItems[itemIndex];
		if (item !== undefined) {
			item.enterEdit(column);
		}
		return null;
	}

	// Cari item index dari element (row) index.
	private getItemIndex(rowIndex: number): number {
		return rowIndex - this.topIndex;
	}

	// Cari row index dari item index.
	private getRowIndex(itemIndex: number): number {
		return itemIndex + this.topIndex;
	}

	private clearSelectedColumnHeaders(): void {

		this.selectedColumnHeaders.forEach((index) => {
			let column = this.header.getColumn(index);
			if (column !== undefined) {
				column.setSelected(false);
			}
		});
		this.selectedColumnHeaders = [];
	}

	private clearSelectedMarkerItems(): void {

		this.selectedMarkerItems.forEach((index) => {

			let itemIndex = this.getItemIndex(index);
			let selectedItem: Item;

			if (itemIndex >= 0 && itemIndex <= this.visibleItems) {
				if (this.markersContainer) {
					let marker = this.markers[itemIndex];
					marker.setSelected(false);
				}

				selectedItem = this.bufferedItems[itemIndex];
				selectedItem.setSelectedCells([]);
			}
		});
		this.selectedMarkerItems = [];
	}

	/**
	 * Bersihkan semua cell selection.
	 */
	private clearSelectedCells(): void {
		this.bufferedItems.forEach((item) => {
			item.setSelectedCells([]);
		});
		this.selectedColumnHeaders = [];
		this.selectedCells = [];
	}

	/**
	 * Apakah index element yang diberikan ada didalam daftar selected element indexes.
	 */
	private isIndexSelected(index: number): boolean {
		this.selectedMarkerItems.forEach((selectedRowIndex) => {
			if (selectedRowIndex === index) {
				return true;
			}
			return false;
		});
		return false;
	}

	/**
	 * Apakah cell di row dan column tersebut terselect.
	 */
	private isCellSelected(row: number, column: number): boolean {
		for (let i = 0; i < this.selectedCells.length; i++) {
			let rowColumn = this.selectedCells[i];
			if (rowColumn[0] === row && rowColumn[1] === column) {
				return true;
			}
		}
		return false;
	}

	private notifyMarkerHeaderClickListener(): void {
		this.markerHeaderClickListeners.forEach((listener) => {
			listener.click([]);
		})
	}

	private notifyColumnHeaderClickListeners(): void {
		this.columnHeaderClickListeners.forEach((listener) => {
			listener.click(this.selectedColumnHeaders);
		});
	}

	private notifyMarkerItemClickListeners(): void {
		this.markerItemClickListeners.forEach((listener) => {
			listener.click(this.selectedMarkerItems);
		});
	}

	private notifyCellListeners(): void {
		if (this.selectedCells.length > 0) {
			this.cellListeners.forEach((listener) => {
				listener.changed(this.selectedCells[this.selectedCells.length - 1]);
			});
		}
	}

	private notifyItemDoubleClickListeners(index: number): void {
		this.itemDoubleClickListeners.forEach((listener) => {
			listener.dblclick(index);
		});
	}

	/**
	 * Tambahkan row index ke dalam selection dan notify.
	 */
	private addSelectedHeaderColumn(columnIndex: number) {
		this.selectedColumnHeaders.push(columnIndex);
		this.selectedColumnHeaders.forEach((selectedIndex) => {
			let column = this.header.getColumn(selectedIndex);
			column.setSelected(true);
		});
	}

	private showFullSelection(itemIndex: number): void {

		if (this.style.fullSelection === true) {

			let index = itemIndex - this.topIndex;
			let item = this.bufferedItems[index];
			let cells = item.getCells();
			let selectedIndexes = [];
			for (let i = 0; i < cells.length; i++) {
				selectedIndexes.push(i);
				let cell = cells[i];
				let row = cell.getRowIndex();
				let column = cell.getColumnIndex();
				this.selectedCells.push([row, column]);
			}
			item.setSelectedCells(selectedIndexes);
		}
	}

	/**
	 * Tambahkan row index ke dalam selection dan notify.
	 */
	private addSelectedMarkerItem(index: number) {

		this.selectedMarkerItems.push(index);
		this.selectedMarkerItems.forEach((selectedIndex) => {

			let itemIndex = this.getItemIndex(selectedIndex);
			if (this.markersContainer !== undefined) {
				let marker = this.markers[itemIndex];
				if (marker !== undefined) {
					marker.setSelected(true);
				}
			}

			let item = this.bufferedItems[itemIndex];
			let cells = item.getCells();
			cells.forEach((cell: Cell) => {
				let row = cell.getRowIndex();
				let column = cell.getColumnIndex();
				this.selectedCells.push([row, column]);
			});

		});

	}

	private newMarker(index: number): Marker {

		let element = this.markersContainer.getElement();
		let marker = new Marker(element, this.style, this.labelProvider, this.contentProvider, this.input);
		marker.setIndex(index);

		// Perlihatkan item ini di select jika ada di daftar selected indexes.
		if (this.isIndexSelected(index)) {
			marker.setSelected(true);
		}

		marker.addClickListener({

			click: (marker: Marker) => {

				let itemIndex = marker.getItemIndex();
				let rowIndex = this.getRowIndex(itemIndex);
				let item: Item;

				if (rowIndex < this.requiredItems) {

					this.clearSelections();

					// Row Selection
					this.addSelectedMarkerItem(rowIndex);

					// Cell Selection
					item = this.bufferedItems[itemIndex];
					let cells = item.getCells();

					let selectedIndexes: number[] = [];
					for (let i = 0; i < cells.length; i++) {
						selectedIndexes.push(i);
						let cell = cells[i];
						let row = cell.getRowIndex();
						let column = cell.getColumnIndex();
						this.selectedCells.push([row, column]);
					}
					item.setSelectedCells(selectedIndexes);

					this.notifyMarkerItemClickListeners();

				}

				this.showFullSelection(itemIndex);
			}
		});
		return marker;
	}

	private newItem(index: number): Item {

		let element = this.itemsContainer.getElement();
		let item = new Item(element, this.suspender, this, this.labelProvider, this.contentProvider,
			this.input, this.style, this.header);
		let cells: number[] = [];
		item.applyProviderIndex(index);

		// Perlihatkan item ini di select jika ada di daftar selected indexes.
		if (this.isIndexSelected(index)) {

		} else {


			// Daftar cell terselect dari selected cell di index ini.
			for (let i = 0; i < this.columnCount; i++) {
				if (this.isCellSelected(index, i)) {
					cells.push(i);
				}
			}

			// Daftar cell terselect dari selected column.
			this.selectedColumnHeaders.forEach((index) => {
				cells.push(index);
			});

			item.setSelectedCells(cells);
		}

		// Response cell di click.
		item.addCellClickListener({

			click: (cell: Cell) => {

				this.clearSelections();

				// Tampilkan satu cell selection yang baru
				let columnIndex = cell.getIndex();
				item.setSelectedCells([columnIndex]);
				let row = cell.getRowIndex();
				let column = cell.getColumnIndex();
				this.selectedCells.push([row, column]);

				this.notifyCellListeners();

				let index = item.getIndex();
				this.showFullSelection(index);
			}
		});


		// Response item di double click.
		item.addDoubleClickListener({

			dblclick: (item: Item) => {

				this.clearSelections();

				// Tampilkan satu cell selection yang baru
				let index = item.getIndex();
				let cells = item.getCells();
				for (let i = 0; i < cells.length; i++) {
					this.selectedCells.push([index, i]);
				}

				this.notifyItemDoubleClickListeners(index);
				this.showFullSelection(index);
			}
		});

		return item;
	}

	private appendOne(index: number): void {
		if (this.markersContainer) {
			this.markers.push(this.newMarker(index));
		}
		this.bufferedItems.push(this.newItem(index));
	}

	private splice(start: number, end?: number): void {
		let removedMarkers: Marker[] = [];
		let removedItems: Item[] = [];
		if (end) {
			if (this.markersContainer) {
				removedMarkers = this.markers.splice(start, end);
			}
			removedItems = this.bufferedItems.splice(start, end);
		} else {
			if (this.markersContainer) {
				removedMarkers = this.markers.splice(start);
			}
			removedItems = this.bufferedItems.splice(start);
		}
		removedItems.forEach((removedItem) => {
			removedItem.remove();
		});
		removedMarkers.forEach((removedMarker) => {
			removedMarker.remove();
		});
	}

	private getMarkerContainerWidth(): number {
		if (this.markersContainer) {
			return this.markersContainer.getWidth();
		} else {
			return 0;
		}
	}

	private maintainMarkerItemSelection(marker: Marker): void {
		this.selectedMarkerItems.forEach((selectedRowIndex) => {
			let index = marker.getIndex();
			marker.setSelected(selectedRowIndex === index);
		});
	}

	private maintainItemCellsSelection(item: Item) {
		this.selectedCells.forEach((selectedCellIndex) => {
			let cell: Cell;
			let rowIndex = selectedCellIndex[0];
			let colIndex = selectedCellIndex[1];
			let itemIndex = item.getIndex();
			if (itemIndex === rowIndex) {
				for (let i = 0; i < this.columnCount; i++) {
					cell = item.getCell(i);
					if (i === colIndex) {
						cell.setSelected(true);
					}
				}
			} else {
				for (let i = 0; i < this.columnCount; i++) {
					cell = item.getCell(i);
					cell.setSelected(false);
				}
			}
		});
	}

	/**
	 * Copy isi item dari item yang sudah tampil.
	 */
	private copyContents(sourceIndex: number, targetIndex: number): void {

		let sourceMarker = this.markers[sourceIndex];
		let targetMarker = this.markers[targetIndex];
		let sourceItem = this.bufferedItems[sourceIndex];
		let targetItem = this.bufferedItems[targetIndex];

		// Update index di marker.
		if (this.markersContainer) {
			sourceMarker = this.markers[sourceIndex];
			targetMarker = this.markers[targetIndex];
			let markerIndex = sourceMarker.getIndex();
			targetMarker.setIndex(markerIndex);
			this.maintainMarkerItemSelection(targetMarker);
		}

		// Copy semua text dari source ke target item.
		sourceItem = this.bufferedItems[sourceIndex];
		targetItem = this.bufferedItems[targetIndex];
		targetItem.applySourceIndex(sourceItem);
		this.maintainItemCellsSelection(targetItem);
	}

	/**
	 * Baca isi dari provider.
	 */
	private readContents(itemIndex: number, providerIndex: number): void {

		let targetMarker: Marker;
		let targetItem: Item;

		if (this.markersContainer) {
			targetMarker = this.markers[itemIndex];
			if (targetMarker !== undefined) {
				targetMarker.setIndex(providerIndex);
				this.maintainMarkerItemSelection(targetMarker);
			}
		}

		targetItem = this.bufferedItems[itemIndex];
		if (targetItem !== undefined) {
			targetItem.applyProviderIndex(providerIndex);
			this.maintainItemCellsSelection(targetItem);
		}
	}

	/**
	 * Pindah top index sejumlah delta tersebut.
	 * Minus berarti mundur dan positif berarti maju.
	 */
	private move(delta: number): void {
		let offset: number;
		let cut: number = this.lastItemCut ? 0 : 1;
		if (delta > 0) {
			offset = this.visibleItems - delta;
			for (let i = 0; i < offset; i++) {
				this.copyContents(i + delta, i);
			}
			for (let i = Math.max(offset, 0); i < this.bufferedItems.length; i++) {
				this.readContents(i, this.topIndex + i + delta);
			}
		} else {
			offset = -delta;
			for (let i = this.bufferedItems.length - 1; i > offset; i--) {
				this.copyContents(i + delta, i);
			}
			for (let i = Math.min(this.visibleItems, offset) - cut; i >= 0; i--) {
				this.readContents(i, this.topIndex + i + delta);
			}
		}

		this.topIndex += delta;
	}

	public setLabelProvider(provider: TableLabelProvider): void {
		this.labelProvider = provider;
		this.clearSelections();
	}

	public setContentProvider(provider: ContentProvider): void {
		this.contentProvider = provider;
		this.clearSelections();
	}

	public setInput(input: any): void {

		if (this.markersContainer !== null) {
			if (this.labelProvider.getMarkerWidth !== undefined) {
				let markerWidth = this.labelProvider.getMarkerWidth();
				this.markersContainer.setWidth(markerWidth);
			}
		}

		// Reset semua variable ke kondisi kosong.
		this.input = input;
		this.topIndex = 0;
		this.bufferedItems = [];
		if (this.itemsContainer) {
			this.itemsContainer.empty();
		}
		this.markers = [];
		if (this.markersContainer) {
			this.markersContainer.empty();
		}

		this.selectedColumnHeaders = [];
		this.selectedMarkerItems = [];
		this.selectedCells = [];

		this.clearSelections();

		if (input !== null) {
			this.requiredItems = this.contentProvider.getElementCount(input);
			this.columnCount = this.labelProvider.getColumnCount(input);
		}
		this.lastTopIndex = Math.max(0, this.requiredItems - this.visibleItems);
		this.lastItemCut = this.visibleItems % this.style.itemHeight !== 0;

		// Tahap inisialisasi buat semua item dari awal.
		let count = this.visibleItems;
		if (this.lastItemCut) {
			count++;
		}
		for (let i = 0; i < Math.min(count, this.requiredItems); i++) {
			this.appendOne(i);
		}
	}

	public getItems(): Item[] {
		return this.bufferedItems;
	}

	public setWidth(width: number): void {
		let markerWidth = this.getMarkerContainerWidth();
		let itemsWidth = width - markerWidth;
		let columnsWidth = this.header.getColumnsWidth();
		if (itemsWidth > columnsWidth) {
			this.element.width(width);
			this.itemsContainer.setWidth(itemsWidth);
		} else {
			this.element.width(markerWidth + columnsWidth);
			this.itemsContainer.setWidth(columnsWidth);
		}
	}

	public setItemsWidth(width: number): void {
		let markerWidth = this.getMarkerContainerWidth();
		this.setWidth(markerWidth + width);
	}

	public setHeight(height: number): void {

		if (this.height === height) {
			return;
		}

		if (this.requiredItems === 0) {
			return;
		}

		let oldVisibles = this.visibleItems;
		let newVisibles = Math.floor(height / this.style.itemHeight);
		let delta: number;
		let index: number;
		let lastIndex: number;

		this.lastItemCut = newVisibles % this.style.itemHeight !== 0;
		if (this.requiredItems < Math.min(newVisibles, oldVisibles)) {
			return; // Tidak perlu modifikasi items jika semua item tampil.
		}

		delta = newVisibles - oldVisibles;
		this.visibleItems = newVisibles;
		this.lastTopIndex = Math.max(0, this.requiredItems - newVisibles);

		// Selisih item menentukan hapus atau tambah item.
		if (delta > 0) {

			// Tambah di bagian akhir sebanyak delta.
			lastIndex = this.bufferedItems.length;
			for (index = 0; index < delta; index++) {
				this.appendOne(this.topIndex + lastIndex + index);
			}

		} else if (delta < 0) {

			// Jika selisih negatif maka hapus item.
			this.splice(delta); // Hapus di akhir delta.
		}

		// Penambahan item yang terpotong jika belum ada.
		if (this.lastItemCut && this.bufferedItems.length === this.visibleItems) {
			this.appendOne(this.topIndex + this.bufferedItems.length);
		}

		// Jika topIndex baru lebih kecil dari yang topIndex terakhir maka move.
		if (this.lastTopIndex < this.topIndex) {
			if (this.topIndex - delta < 0) {
				this.move(-this.topIndex);
			} else {
				this.move(-delta);
			}
		}

		this.height = height;

	}

	public relayout(): void {
		for (let i = 0; i < this.markers.length; i++) {
			let marker = this.markers[i];
			marker.relayout();
		}
	}

	public getVisibleItems(): number {
		return this.visibleItems;
	}

	public getLastTopIndex(): number {
		return this.lastTopIndex;
	}

	public getRequiredItems(): number {
		return this.requiredItems;
	}

	public isLastItemCut(): boolean {
		return this.lastItemCut;
	}

	public setItemsLeft(left: number): void {
		this.itemsContainer.setItemsLeft(left);
	}

	/**
	 * Ambil top index setelah move di lakukan.
	 * Top index tidak berubah jika move belum selesai.
	 */
	public getTopIndex(): number {
		return this.topIndex;
	}

	/**
	 * Ada kondisi dimana setTopIndex di panggil dimana move belum selesai di lakukan.
	 */
	public setTopIndex(index: number): void {
		this.move(index - this.topIndex);
	}

	public clearSelections() {
		this.clearSelectedMarkerHeader();
		this.clearSelectedColumnHeaders();
		this.clearSelectedMarkerItems();
		this.clearSelectedCells();
	}

	public clearSelectedMarkerHeader(): void {
		this.header.setMarkerSelected(false);
	}

	public setSelectedColumnHeaders(indexes: number[]): void {

		this.clearSelectedMarkerItems();
		this.clearSelectedCells();

		// Tampilkan column header yang di select
		this.header.showSelectedColumns(indexes);

		// Tampilkan cell selection yang baru.
		this.selectedColumnHeaders = indexes;
		this.bufferedItems.forEach((item) => {
			item.setSelectedCells(this.selectedColumnHeaders);
		});
	}

	public setSelectedIndex(index: number): void {

		if (this.bufferedItems.length === 0) {
			return; // Tidak ada yang dilakukan jika items 0
		}

		this.clearSelectedMarkerItems();
		this.clearSelectedCells();

		if (index > this.topIndex + this.visibleItems) {

			// Index berada setelah visibles items.
			this.setTopIndex(this.lastTopIndex);

		} else if (index < this.topIndex) {

			// Index berada sebelum visibles items.
			if (index < 0) {
				index = 0;
			}
			this.setTopIndex(index);
		}

		this.addSelectedMarkerItem(index);

		// Select semua cell dalam 1 baris.
		let itemIndex = this.getItemIndex(index);
		let item = this.bufferedItems[itemIndex];
		item.setSelectedCells();
	}

	public setSelectedCell(row: number, column: number): void {

		this.clearSelectedMarkerItems();
		this.clearSelectedCells();

		// Tampilkan satu cell selection yang baru.
		let itemIndex = this.getItemIndex(row);
		let item = this.bufferedItems[itemIndex];
		if (item !== undefined) {
			item.setSelectedCells([column]);
		}

		// Update selected cells.
		this.selectedCells = [];
		this.selectedCells.push([row, column]);

	}

	public addMarkerHeaderClickListener(listener: ClickListener): void {
		this.markerHeaderClickListeners.push(listener);
	}

	public addColumnHeaderClickListener(listener: ClickListener): void {
		this.columnHeaderClickListeners.push(listener);
	}

	public addMarkerClickListener(listener: ClickListener): void {
		this.markerItemClickListeners.push(listener);
	}

	public addCellListener(listener: CellListener): void {
		this.cellListeners.push(listener);
	}

	public addItemDoubleClickListener(listener: DoubleClickListener): void {
		this.itemDoubleClickListeners.push(listener);
	}

}

class MarkersContainer {

	private window: JQuery;
	private element: JQuery;

	constructor(parent: JQuery, style: TableViewerStyle) {
		this.window = jQuery("<div>");
		this.window.addClass("viewers-tableViewer-markersContainer-window");
		if (style.markerWidth === webface.DEFAULT) {
			this.window.width(TableViewer.MARKER_WIDTH);
		} else {
			this.window.width(style.markerWidth);
		}
		this.window.css({
			"float": "left",
			"height": "inherit",
			"border-right-width": "1px"
		});
		parent.append(this.window);

		this.element = jQuery("<div>");
		this.element.addClass("viewers-tableViewer-markersContainer");
		this.element.css({
			"position": "relative"
		});
		this.window.append(this.element);
	}

	public getElement(): JQuery {
		return this.element;
	}

	public getWidth(): number {
		return this.window.outerWidth();
	}

	public setWidth(width: number): void {
		this.window.outerWidth(width);
	}

	public empty(): void {
		this.element.empty();
	}
}

class Marker {

	private index: number;
	private clickListeners: ClickListener[] = [];
	private selected = false;
	private recordCount: number = 0;
	private element: JQuery;
	private input: any = null;
	private composite: Composite = null;
	private contentProvider: ContentProvider = null;
	private labelProvider: TableLabelProvider = null;
	private pane: TableMarkerPane = null;

	constructor(parent: JQuery, style: TableViewerStyle, labelProvider: TableLabelProvider,
		contentProvider: ContentProvider, input: any) {
		this.element = jQuery("<div>")
		this.element.addClass("viewers-tableViewer-marker");
		this.element.height(style.itemHeight);
		this.element.css({
			"line-height": (style.itemHeight - (style.lineVisible ? 1 : 0)) + "px",
			"text-align": "center",
			"position": "relative",
			"cursor": "default",
			"border-bottom-width": "1px"
		});
		parent.append(this.element);

		this.element.on("click", () => {
			this.clickListeners.forEach((listener) => {
				listener.click(this);
			});
		});

		if (input !== null) {
			this.recordCount = contentProvider.getElementCount(input);
		}

		this.labelProvider = labelProvider;
		this.contentProvider = contentProvider;
		this.input = input;
	}

	public getPane(): TableMarkerPane {
		return this.pane;
	}

	public setIndex(index: number): void {

		this.index = index;
		if (index >= this.recordCount) {
			this.element.hide();
		} else {

			this.element.show();
			if (this.pane === null) {

				let element = jQuery("<div>");
				element.css({
					"height": "inherit"
				});

				this.element.append(element);
				this.composite = new Composite(element);

				let layout = new FillLayout();
				this.composite.setLayout(layout);

				// Apakah menggunakan default pane
				let isDefaultPane = false;
				if (this.labelProvider.getMarkerPane === undefined) {
					isDefaultPane = true;
				} else {
					this.pane = this.labelProvider.getMarkerPane();
					if (functions.isNullOrUndefined(this.pane)) {
						isDefaultPane = true;
					}
				}

				// Buat pane
				if (isDefaultPane) {
					this.pane = new DefaultTableMarkerPane();
				} else {
					this.pane = this.labelProvider.getMarkerPane();
				}
				this.pane.createControl(this.composite);
				this.composite.relayout();

			}

			let element = this.contentProvider.getElement(this.input, index);
			this.pane.setValue(this.input, index, element);
		}
	}

	public getIndex(): number {
		return this.index;
	}

	public remove(): void {
		this.element.remove();
	}

	public relayout(): void {
		if (this.composite !== null) {
			this.composite.relayout();
		}
	}

	public getItemIndex(): number {
		return this.element.index();
	}

	public setSelected(state: boolean): void {
		if (this.selected === state) {
			return;
		}
		this.selected = state;
		if (this.selected) {
			this.element.addClass("selected");
		} else {
			this.element.removeClass("selected");
		}
	}

	public addClickListener(listener: ClickListener): void {
		this.clickListeners.push(listener);
	}

}

class ItemsContainer {

	private left: number = 0;
	private window: JQuery = null;
	private element: JQuery = null;
	private header: Header = null;

	constructor(parent: JQuery, header: Header) {

		this.window = jQuery("<div>");
		this.window.addClass("viewers-tableViewer-itemsCont-window");
		this.window.css({
			"height": "inherit",
			"float": "left",
			"overflow": "hidden"
		});
		parent.append(this.window);

		this.element = jQuery("<div>");
		this.element.addClass("viewers-tableViewer-itemsCont");
		this.element.css({
			"position": "relative"
		});
		this.window.append(this.element);

		this.header = header;
	}

	public getElement(): JQuery {
		return this.element;
	}

	public setItemsLeft(left: number): void {
		this.left = left;
		this.element.css("left", left);
	}

	public setWidth(width: number) {

		this.window.width(width);
		this.element.width(width);

		let windowWidth = this.header.getWindowWidth();
		let drift = this.left + width - windowWidth;
		let newLeft: number;

		if (drift < 0) {
			newLeft = this.left - drift;
			this.setItemsLeft(newLeft);
			this.header.setColumnsLeft(newLeft);
		}
	}

	public empty(): void {
		this.element.empty();
	}

}

class Item {

	private itemIndex: number;
	private columns: Column[] = [];
	private cells: Cell[] = [];
	private recordCount: number;
	private clickListeners: ClickListener[] = [];
	private doubleClickListeners: DoubleClickListener[] = [];

	private editSession: EditSession = null;
	private contentProvider: ContentProvider;

	private element: JQuery;
	private input: any = null;

	constructor(parent: JQuery, suspender: Suspender, editSession: EditSession, labelProvider: TableLabelProvider,
		contentProvider: ContentProvider, input: any, style: TableViewerStyle, header: Header) {

		if (input !== null) {
			this.recordCount = contentProvider.getElementCount(input);
		}

		this.element = jQuery("<div>");
		this.element.addClass("viewers-tableViewer-item");
		this.element.css({
			"height": style.itemHeight + "px",
			"width": "max-content",
			"overflow": "hidden",
			"line-height": style.itemHeight + "px"
		});

		parent.append(this.element);

		// Bangun semua cell dari isi array di item.
		this.columns = header.getColumns();
		for (let i = 0; i < this.columns.length; i++) {
			let column = this.columns[i];
			let cell = new Cell(this.element, this, column, suspender,
				style, labelProvider, contentProvider, input, i);
			this.cells.push(cell);
		}

		this.element.on("dblclick", () => {
			this.doubleClickListeners.forEach((listener: DoubleClickListener) => {
				listener.dblclick(this);
			});
		});

		this.input = input;
		this.editSession = editSession;
		this.contentProvider = contentProvider;
	}

	public getEditSession(): EditSession {
		return this.editSession
	}

	private setIndex(newIndex: number): boolean {
		this.itemIndex = newIndex;
		if (this.itemIndex >= this.recordCount) {
			this.element.hide();
			return false;
		} else {
			this.element.show();
			this.element.attr("index", this.itemIndex);
			return true;
		}
	}

	public getIndex(): number {
		return this.itemIndex;
	}

	public getProviderElement(): JQuery {
		return this.contentProvider.getElement(this.input, this.itemIndex);
	}

	public getWidth(): number {
		return this.element.width();
	}

	public remove(): void {
		this.element.remove();
	}

	public applySourceIndex(sourceItem: Item): void {
		let index = sourceItem.getIndex();
		if (index < this.recordCount) {
			this.setIndex(index);
			for (let i = 0; i < this.columns.length; i++) {
				let targetCell = this.cells[i];
				targetCell.applyProviderIndex(index);
			}
		}
	}

	/**
	 * Berikan index dari provider untuk di tampilkan data yang ada di index tersebut.
	 */
	public applyProviderIndex(providerIndex: number): void {

		if (this.setIndex(providerIndex) === false) {
			return;
		}
		for (let i = 0; i < this.columns.length; i++) {
			let cell = this.cells[i];
			cell.applyProviderIndex(providerIndex);
		};
	}

	public getCell(index: number): Cell {
		return this.cells[index];
	}

	public getCells(): Cell[] {
		return this.cells;
	}

	public addClickListener(listener: ClickListener) {
		this.clickListeners.push(listener);
	}

	/**
	 * Perlihatkan cell selection di index tersebut.
	 * Yang diluar daftar akan di deselect.
	 */
	public setSelectedCells(indexes?: number[]) {
		this.columns.forEach((column, i) => {
			let selected = false;
			if (indexes === undefined) {
				selected = true;
			} else {
				for (let j = 0; j < indexes.length; j++) {
					if (i === indexes[j]) {
						selected = true;
						break;
					}
				}
			}
			this.cells[i].setSelected(selected);
		});
	}

	public enterEdit(index: number): void {
		for (let i = 0; i < this.columns.length; i++) {
			if (i === index) {
				let cell = this.cells[i];
				cell.enterEdit();
			}
		}
		return null;
	}

	public addDoubleClickListener(listener: DoubleClickListener): void {
		this.doubleClickListeners.push(listener);
	}

	public addCellClickListener(listener: ClickListener): void {
		this.cells.forEach((cell) => {
			cell.addClickListener(listener);
		});
	}

}

class Cell implements TableViewerCell {

	private static COMMIT_DELAY = 100;

	private selected = false;
	private item: Item = null;
	private style: TableViewerStyle = null;
	private labelProvider: TableLabelProvider = null;
	private contentProvider: ContentProvider = null;
	private input: any = null;
	private width: number = webface.DEFAULT;
	private clickListeners: ClickListener[] = [];
	private parent: JQuery = null;
	private element: JQuery = null;
	private column: Column = null;
	private suspender: Suspender = null;
	private textElement: JQuery = null;
	private imageElement: JQuery = null;
	private maker: TableColumnMaker = null;
	private text: string = "";
	private index: number;
	private commitHandler: number = null;

	constructor(parent: JQuery, item: Item, column: Column, suspender: Suspender, style: TableViewerStyle,
		labelProvider: TableLabelProvider, contentProvider: ContentProvider, input: any, index: number) {

		this.parent = parent;
		this.suspender = suspender;
		this.index = index;
		this.style = style;
		this.item = item;
		this.column = column;
		this.labelProvider = labelProvider;
		this.contentProvider = contentProvider;
		this.input = input;
		if (this.suspender.isCreationSuspended(this.index)) {
			this.suspender.queueCreation(this.index, () => {
				this.createElement();
			});
		} else {
			this.createElement();
		}
	}

	private createElement(): void {

		this.element = jQuery("<div>");
		this.element.addClass("viewers-tableViewer-cell");
		this.element.addClass(this.style.lineVisible ? "lineShow" : "lineHide");

		this.width = this.column.getWidth();

		this.element.css({
			"float": "left",
			"width": this.width + "px",
			"line-height": (this.style.itemHeight) + "px",
			"border-right-width": "1px",
			"border-bottom-width": "1px",
			"padding-left": "4px",
			"padding-right": "4px",
			"white-space": "nowrap",
			"overflow": "hidden",
			"text-overflow": "ellipsis",
			"height": "inherit",
		});
		this.parent.append(this.element);

		this.setHighlighted(this.selected);
		this.element.on("click", () => {
			this.clickListeners.forEach((listener) => {
				listener.click(this);
			});
		});
		this.element.on("dblclick", () => {
			if (this.style.cellEditable === true) {
				this.enterEdit();
			}
		});
		this.element.on("keydown", (event: JQueryEventObject) => {
			if (this.style.cellEditable === true) {
				if (event.which === 13) {
					this.exitEdit(true);
				} else if (event.which === 27) {
					this.cancelEdit();
				}
			}
		});
		this.element.on("focusout", () => {
			if (this.style.cellEditable === true) {
				this.exitEdit(true);
			}
		});
	}

	public getRowIndex(): number {
		return this.item.getIndex();
	}

	public getColumnIndex(): number {
		return this.index;
	}

	public enterEdit(): void {

		this.element.attr("contenteditable", "true");
		this.selectAll();
		this.element.focus();
		this.setHighlighted(false);

		let session = this.item.getEditSession();
		session.setEnteredCell(this);

	}

	private selectAll(): void {
		let selection: any = null
		let range: any = null;
		let htmlElement = this.element[0];
		if (window.getSelection && document.createRange) { // Browser compatibility
			selection = window.getSelection();
			if (selection.toString() == '') { //no text selection
				range = document.createRange(); //range object
				range.selectNodeContents(htmlElement); //sets Range
				selection.removeAllRanges(); //remove all ranges from selection
				selection.addRange(range);//add Range to a Selection.
			}
		}
	}

	private exitEdit(commit: boolean): void {

		this.element.attr("contenteditable", "false");

		let session = this.item.getEditSession();
		session.setEnteredCell(null);

		if (commit === true) {
			this.commitChanged();
		}
	}

	private cancelEdit(): void {
		this.element.text(this.text);
		this.exitEdit(false);
	}

	private commitChanged(): void {
		if (this.labelProvider.commitChanged) {
			if (this.commitHandler !== null) {
				clearTimeout(this.commitHandler);
			}
			this.commitHandler = setTimeout(() => {
				let oldText = this.text;
				let newText = this.element.text();
				let row = this.item.getIndex();
				this.labelProvider.commitChanged(row, this.index, oldText, newText);
				this.commitHandler = null;
			}, Cell.COMMIT_DELAY);
		}
	}

	public setWidth(width: number): void {

		if (this.width === width) {
			return;
		}

		this.element.outerWidth(width);
		this.width = width;
	}

	public getWidth(): number {
		return this.width;
	}

	public getIndex(): number {
		return this.index;
	}

	public setSelected(state: boolean): void {
		if (this.selected === state) {
			return;
		}
		this.selected = state;
		if (this.element === null) {
			return;
		}
		this.setHighlighted(this.selected);
	}

	private setHighlighted(highlighted: boolean): void {
		if (highlighted === true) {
			this.element.addClass("selected");
		} else {
			this.element.removeClass("selected");
		}
	}

	public applyProviderIndex(contentIndex: number) {
		if (this.suspender.isFormationSuspended(this.index)) {
			this.suspender.queueFormation(this.index, () => {
				this.createFormation(contentIndex);
			});
		} else {
			this.createFormation(contentIndex);
		}
	}

	private createFormation(contentIndex: number): void {

		let providerElement = this.contentProvider.getElement(this.input, contentIndex);

		if (this.maker === null) {

			// Apakah menggunakan default pane
			let isDefaultMaker = false;
			if (this.labelProvider.getColumnMaker === undefined) {
				isDefaultMaker = true;
			} else {
				this.maker = this.labelProvider.getColumnMaker(providerElement, this.index);
				if (functions.isNullOrUndefined(this.maker)) {
					isDefaultMaker = true;
				}
			}

			// Ambil text dari provider.
			if (isDefaultMaker) {
				this.maker = new DefaultTableColumnMaker();
			} else {
				this.maker = this.labelProvider.getColumnMaker(providerElement, this.index);
			}

		}

		// Style
		let style = this.maker.getStyle(providerElement, this.index);
		this.element.css(style);

		// Attributes
		if (this.maker.getAttributes) {
			let attributes = this.maker.getAttributes(providerElement, this.index);
			let keys = Object.keys(attributes);
			for (let key of keys) {
				this.element.attr(key, attributes[key]);
			}
		}

		if (this.imageElement !== null) {

			this.imageElement.remove();
			this.imageElement = null;

			this.textElement.remove();
			this.textElement = null;

		}

		this.text = this.labelProvider.getColumnText(providerElement, this.index);
		if (this.maker.getImage) {

			let image = this.maker.getImage(providerElement, this.index);
			if (image instanceof WebFontImage) {

				// Image
				this.imageElement = jQuery("<div>");
				let imageColor: string = null;
				if (this.maker.getImageColor !== undefined) {
					imageColor = this.maker.getImageColor(providerElement, this.index);
				}
				this.imageElement.css({
					"width": (this.style.itemHeight + 4) + "px",
					"font-size": this.style.itemHeight + "px",
					"float": "left",
					"color": imageColor,
					"text-align": "center",
				});
				let classes = image.getClasses();
				for (let name of classes) {
					this.imageElement.addClass(name);
				}
				this.element.append(this.imageElement);

				// Text
				this.textElement = jQuery("<div>");
				this.element.append(this.textElement);
				this.textElement.text(this.text);

				// Selectable
				if (this.maker.isSelectable) {
					if (this.maker.isSelectable(providerElement, this.index)) {
						this.textElement.css("user-select", "text");
					}
				}
				return;

			}
		}

		// Default
		this.element.text(this.text);

	}

	public addClickListener(listener: ClickListener): void {
		this.clickListeners.push(listener);
	}

}

interface CellListener {

	changed(data: any): void;

}

interface ClickListener {

	click(data: any): void;
}

interface DoubleClickListener {

	dblclick(data: any): void;
}

interface WidthListener {

	width(index: number, width: number, total: number, post: boolean): void;
}

interface OriginListener {

	changed(origin: number, stop: boolean): void;
}

class DefaultTableColumnTitlePane implements TableColumnTitlePane {

	private composite: Composite = null;
	private textLabel: Label = null;

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("viewers-tableViewer-default-table-column-title-pane");

		let layout = new FillLayout();
		this.composite.setLayout(layout);
		this.createLabelText(this.composite);
	}

	private createLabelText(parent: Composite): void {

		this.textLabel = new Label(parent);

		let element = this.textLabel.getElement();
		element.css("padding-left", "4px");
		element.css("padding-right", "4px");
	}

	public getControl(): Control {
		return this.composite;
	}

	public setText(text: string): void {
		this.textLabel.setText(text);
	}
}

class DefaultTableMarkerPane implements TableMarkerPane {

	private composite: Composite = null;
	private textLabel: Label = null;

	public createControl(parent: Composite): void {

		this.composite = new Composite(parent);

		let element = this.composite.getElement();
		element.addClass("viewers-tableViewer-default-table-marker-pane");

		let layout = new FillLayout();
		this.composite.setLayout(layout);

		this.createLabelText(this.composite);
	}

	private createLabelText(parent: Composite): void {

		this.textLabel = new Label(parent);

		let element = this.textLabel.getElement();
		element.css("padding-left", "4px");
		element.css("padding-right", "4px");
		element.css("text-overflow", "ellipsis");
	}

	public setValue(input: number, value: number, element: any): void {
		let text = <any>(value + 1);
		this.textLabel.setText(text);
	}

	public getControl(): Control {
		return this.composite;
	}

}

class DefaultTableColumnMaker implements TableColumnMaker {

	public getStyle(element: any, columnIndex: number): any {
		return {
			"color": "#444",
			"font-style": "normal"
		};
	}

}