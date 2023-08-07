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
import * as webface from "webface/webface";
import * as functions from "webface/functions";

import * as util from "webface/util/functions";

import Event from "webface/widgets/Event";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";
import ScrollListener from "webface/widgets/ScrollListener";

import Viewer from "webface/viewers/Viewer";
import TensorHeaderPane from "webface/viewers/TensorHeaderPane";
import TensorLefterPane from "webface/viewers/TensorLefterPane";
import TensorViewerStyle from "webface/viewers/TensorViewerStyle";
import TensorLabelProvider from "webface/viewers/TensorLabelProvider";
import TensorContentProvider from "webface/viewers/TensorContentProvider";

import ScrollBar from "webface/widgets/ScrollBar";

export default class TensorViewer extends Viewer {

    public static CELL_WIDTH: number = TensorViewerStyle.CELL_WIDTH;
    public static CELL_HEIGHT: number = TensorViewerStyle.CELL_HEIGHT;
    public static HEADER_HEIGHT: number = TensorViewerStyle.HEADER_HEIGHT;
    public static MARKER_WIDTH: number = TensorViewerStyle.LEFTER_WIDTH;
    public static SCROLL_SPACE: number = 12;  // Lebar space sebelah kanan atau bawah.
    public static SCROLL_STEPS: number = 1;   // Jumlah index yang akan di lewati untuk satu tahap scroll.

    private style = new TensorViewerStyle();
    private labelProvider: TensorLabelProvider;
    private contentProvider: TensorContentProvider;
    private input: any = null;

    private horizontalScroll: ScrollBar;
    private verticalScroll: ScrollBar;

    private viewPort: ViewPort;
    private corner: Corner;
    private header: Header;
    private lefter: Lefter;
    private body: Body;

    private cornerSelectionListeners: Listener[] = [];
    private headerSelectionListeners: Listener[] = [];
    private lefterSelectionListeners: Listener[] = [];
    private cellSelectionListeners: Listener[] = [];

    constructor(parent: Composite, style?: TensorViewerStyle, index?: number) {

        super(jQuery("<div>"), parent, index);
        this.element.addClass("scrollable");
        this.element.addClass("viewers-tensorViewer");
        this.element.css({
            "background": "#F8F8F8",
            "position": "absolute",
            "overflow": "hidden"
        });

        util.bindMouseWheel(this.element, (deltaX: number, deltaY: number): number => {
            let step = deltaY * TensorViewer.SCROLL_STEPS;
            let topIndex = this.getTopIndex();
            this.setTopIndex(topIndex - step);
            let newTopIndex = this.getTopIndex();
            return newTopIndex - topIndex;
        });

        this.style = jQuery.extend(new TensorViewerStyle(), style);

        this.viewPort = new ViewPort(this.element, this.style);

        // Vertical scroll listener dimana value dalam pixel.
        let verticalScrollListener = <ScrollListener>{
            moved: (value: number, stop: boolean) => {
                let index = Math.round(value / this.style.cellHeight);
                this.setTopIndex(index);
            }
        }

        // Horizontal scroll listener dimana value dalam pixel.
        let horizontalScrollListener = <ScrollListener>{
            moved: (value: number, stop: boolean) => {
                let index = Math.round(value / this.style.cellWidth);
                this.viewPort.setLeftIndex(index);
            }
        }

        let oneScroll = this.style.cellHeight * TensorViewer.SCROLL_STEPS;

        // Pembuatan vertical scrollbar
        this.verticalScroll = new ScrollBar(this.element, true, oneScroll, verticalScrollListener);

        let verticalElement = this.verticalScroll.getElement();
        verticalElement.css("background-color", "#F8F8F8");
        verticalElement.css("border-left", "1px solid #E8E8E8");

        let varticalHandler = this.verticalScroll.getHandlerElement();
        varticalHandler.css("border-color", "#F8F8F8");

        // Pembuatan horizontal scrollbar
        this.horizontalScroll = new ScrollBar(this.element, false, 100, horizontalScrollListener);

        let horizontalElement = this.horizontalScroll.getElement();
        horizontalElement.css("background-color", "#F8F8F8");
        horizontalElement.css("border-top", "1px solid #E8E8E8");

        let horizontalHandler = this.horizontalScroll.getHandlerElement();
        horizontalHandler.css("border-color", "#F8F8F8");

        this.body = this.viewPort.getBody();
        this.corner = this.viewPort.getCorner();
        this.header = this.viewPort.getHeader();
        this.lefter = this.viewPort.getLefter();

        this.corner.addClickListener({

            click: (data: any) => {

                // Notify lefter header listener
                this.cornerSelectionListeners.forEach((listener: Listener) => {
                    let event = this.createDataEvent(data);
                    listener.handleEvent(event);
                });
            }
        });

        this.header.addClickListener({

            click: (data: any) => {

                // Notify column headers listener
                this.headerSelectionListeners.forEach((listener: Listener) => {
                    let event = this.createDataEvent(data);
                    listener.handleEvent(event);
                });
            }
        });

        this.lefter.addClickListener({

            click: (data: any) => {

                // Notify lefters listener
                this.lefterSelectionListeners.forEach((listener: Listener) => {
                    let event = this.createDataEvent(data);
                    listener.handleEvent(event);
                });
            }
        });

        this.body.addClickListener({

            click: (data: any) => {

                // Notify cells listener
                this.cellSelectionListeners.forEach((listener: Listener) => {
                    let event = this.createDataEvent(data);
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

    private maintainVerticalScroll(): void {
        let topIndex = this.getTopIndex();
        let value = topIndex * this.style.cellHeight;
        this.verticalScroll.setValue(value);
    }

    private maintainHorizontalScroll(): void {
        let leftIndex = this.getLeftIndex();
        let value = leftIndex * this.style.cellWidth;
        this.horizontalScroll.setValue(value);
    }

    public getLabelProvider(): TensorLabelProvider {
        return this.labelProvider;
    }

    public setLabelProvider(provider: TensorLabelProvider): void {
        this.labelProvider = provider;
        this.viewPort.setLabelProvider(provider);
    }

    public getContentProvider(): TensorContentProvider {
        return this.contentProvider;
    }

    public setContentProvider(provider: TensorContentProvider): void {
        this.contentProvider = provider;
        this.viewPort.setContentProvider(provider);
    }

    public setInput(input: any) {
        if (functions.isNullOrUndefined(input)) {
            throw new Error("TensorViewer input cannot be null");
        }
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

    public getTopIndex(): number {
        return this.viewPort.getTopIndex();
    }

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

    public getLastTopIndex(): number {
        return this.viewPort.getLastTopIndex();
    }

    public getLeftIndex(): number {
        return this.viewPort.getLeftIndex();
    }

    public setLeftIndex(index: number): void {

        // Normalisasi index agar tidak keluar range.
        let lastLeftIndex = this.body.getLastLeftIndex();
        let firstIndex = 0;
        if (index < firstIndex) {
            index = firstIndex;
        }
        if (index > lastLeftIndex) {
            index = lastLeftIndex;
        }

        // Tidak perlu scroll jika index sama
        if (index === this.viewPort.getLeftIndex()) {
            return;
        }

        this.viewPort.setLeftIndex(index);
        this.maintainHorizontalScroll();
    }

    public getLastLeftIndex(): number {
        return this.viewPort.getLastLeftIndex();
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

        let space: number = TensorViewer.SCROLL_SPACE;
        let width: number = this.element.width();
        let height: number = this.element.height();
        let cellWidth: number = this.style.cellWidth;
        let cellHeight: number = this.style.cellHeight;

        let viewWidth = width - space;
        let viewHeight = height - space;

        this.viewPort.setWidth(viewWidth);
        this.viewPort.setHeight(viewHeight);

        // Kalkulasi kebutuhan horizontal scroll.
        let requiredWidth = this.body.getRequiredWidth();
        let availableWidth = viewWidth - this.lefter.getWidth();

        // Kalkulasi kebutuhan vertical scroll.
        let requiredHeight = this.body.getRequiredHeight();
        let availableHeight = viewHeight - this.header.getHeight();

        if (availableWidth % cellWidth > 0) {
            requiredWidth += availableWidth % cellWidth;
        }

        if (availableHeight % cellHeight > 0) {
            requiredHeight += availableHeight % cellHeight;
        }

        this.verticalScroll.prepare(requiredHeight, availableHeight, space, viewHeight);
        this.horizontalScroll.prepare(requiredWidth, availableWidth, viewWidth, space);

        this.maintainVerticalScroll();
        this.maintainHorizontalScroll();

        this.corner.relayout();
        this.header.relayout();
        this.lefter.relayout();
        this.body.relayout();
    }

    public refresh(): void {
        let topIndex = this.viewPort.getTopIndex();
        this.viewPort.setTopIndex(topIndex);
    }

    public setSelectedIndex(index: number): void {
        this.setTopIndex(index);
        this.viewPort.setSelectedRow(index);
    }

    public setSelectedCell(row: number, column: number): void {
        this.viewPort.setSelectedCell(row, column);
    }

    public addLefterSelectionListener(listener: Listener): void {
        this.lefterSelectionListeners.push(listener);
    }

    public addHeaderSelectionListener(listener: Listener): void {
        this.headerSelectionListeners.push(listener);
    }

    public addCellSelectionListener(listener: Listener): void {
        this.cellSelectionListeners.push(listener);
    }

}

export interface TensorViewerHeader {

    getIndex(): number;

    getWidth(): number;

    getPane(): TensorHeaderPane;
}

export interface TensorLefterHeader {

    getIndex(): number;

    getHeight(): number;

    getPane(): TensorLefterPane;
}

interface BodyContainer {

    getBody(): Body;

}

class ViewPort implements BodyContainer {

    private element: JQuery;
    private corner: Corner;
    private header: Header;
    private lefter: Lefter;
    private body: Body;

    constructor(parent: JQuery, style: TensorViewerStyle) {
        this.element = jQuery("<div>");
        this.element.addClass("viewers-tensorViewer-viewPort");
        this.element.css({
            "background": "#FFF",
            "overflow": "hidden",
            "float": "left"
        });
        parent.append(this.element);

        this.corner = new Corner(this.element, style);
        this.header = new Header(this.element, style);
        this.lefter = new Lefter(this.element, style);
        this.body = new Body(this.element, style);

    }

    public getCorner(): Corner {
        return this.corner;
    }

    public getLefter(): Lefter {
        return this.lefter;
    }

    public getHeader(): Header {
        return this.header;
    }

    public getBody(): Body {
        return this.body;
    }

    public setContentProvider(provider: TensorContentProvider): void {
        this.corner.setContentProvider(provider);
        this.header.setContentProvider(provider);
        this.lefter.setContentProvider(provider);
        this.body.setContentProvider(provider);
    }

    public setLabelProvider(provider: TensorLabelProvider): void {
        this.corner.setLabelProvider(provider);
        this.header.setLabelProvider(provider);
        this.lefter.setLabelProvider(provider);
        this.body.setLabelProvider(provider);
    }

    public setInput(input: any): void {
        this.corner.setInput(input);
        this.header.setInput(input);
        this.lefter.setInput(input);
        this.body.setInput(input);
    }

    public setTopIndex(index: number): void {
        this.body.setFirstTopIndex(index);
        this.lefter.setTopIndex(index);
    }

    public getTopIndex(): number {
        return this.body.getFirstTopIndex();
    }

    public getLastTopIndex(): number {
        return this.body.getLastTopIndex();
    }

    public setLeftIndex(index: number): void {
        this.header.setLeftIndex(index);
        this.body.setFirstLeftIndex(index);
    }

    public getLeftIndex(): number {
        return this.body.getFirstLeftIndex();
    }

    public getLastLeftIndex(): number {
        return this.body.getLastLeftIndex();
    }

    public setWidth(width: number): void {
        this.element.outerWidth(width);
        let lefterWidth = this.lefter.getWidth();
        let bodyWidth = Math.max(0, width - lefterWidth);
        this.corner.setWidth(lefterWidth);
        this.header.setWidth(bodyWidth);
        this.body.setWidth(bodyWidth);
    }

    public setHeight(height: number): void {
        this.element.outerHeight(height);
        let headerHeight = this.header.getHeight();
        let bodyHeight = Math.max(0, height - headerHeight);
        this.corner.setHeight(headerHeight);
        this.lefter.setHeight(bodyHeight);
        this.body.setHeight(bodyHeight);
    }

    public setSelectedColumn(column: number): void {
        this.body.setSelectedColumn(column);
        this.header.setSelectedColumn(column);
    }

    public setSelectedRow(row: number): void {
        this.body.setSelectedRow(row);
        this.lefter.setSelectedRow(row);
    }

    public setSelectedCell(row: number, column: number): void {
        this.body.setSelectedCell(row, column);
    }

}

interface ClickListener {

    click(data: any): void;

}

abstract class Side {

    protected style: TensorViewerStyle = null;
    protected input: any = null;
    protected contentProvider: TensorContentProvider = null;
    protected labelProvider: TensorLabelProvider = null;

    constructor(style: TensorViewerStyle) {
        this.style = style;
    }

    public setContentProvider(provider: TensorContentProvider) {
        this.contentProvider = provider;
    }

    public setLabelProvider(provider: TensorLabelProvider) {
        this.labelProvider = provider;
    }

    public setInput(input: any): void {
        this.input = input;
    }

}

abstract class Section extends Side {

    protected element: JQuery = null;
    protected clickListeners: ClickListener[] = [];

    constructor(parent: JQuery, style: TensorViewerStyle, cssClass: string) {
        super(style);
        this.element = jQuery("<div>");
        this.element.addClass(cssClass);
        this.element.css({
            "overflow": "hidden",
            "position": "absolute",
            "line-height": style.cellHeight + "px",
        });
        parent.append(this.element);
        this.style = style;
    }

    public relayout(): void {

    }

    public addClickListener(listener: ClickListener): void {
        if (this.clickListeners.indexOf(listener) === -1) {
            this.clickListeners.push(listener);
        }
    }

}

class Corner extends Section {

    constructor(parent: JQuery, style: TensorViewerStyle) {
        super(parent, style, "viewers-tensorViewer-corner");
        this.element.css({
            "top": "0px",
            "left": "0px",
            "padding-left": "4px",
            "padding-right": "4px",
            "background": "#F0F0F0",
        });
    }

    public setInput(input: any): void {
        super.setInput(input);
        let rowCount = this.contentProvider.getRowCount(input);
        let columnCount = this.contentProvider.getColumnCount(input);
        if (rowCount > 0 && columnCount > 0) {
            this.element.css({
                "border-bottom": "1px solid #D8D8D8",
                "border-right": "1px solid #D8D8D8"
            });
            this.element.outerWidth(this.style.cellWidth);
            this.element.outerHeight(this.style.headerHeight);
        }
    }

    public setWidth(width: number): void {
        this.element.outerWidth(width);
    }

    public setHeight(height: number): void {
        this.element.outerHeight(height);
    }

}

class Header extends Section {

    private height: number = 0;
    private horizontalSide: HorizontalSide = null;
    private visibleItems: HeaderItem[] = []; // Daftar item yang ada di tampilkan
    private selectedColumns: number[] = []; // Daftar selected rows

    constructor(parent: JQuery, style: TensorViewerStyle) {
        super(parent, style, "viewers-tensorViewer-header");
        this.element.css({
            "top": "0px",
            "background": "#F0F0F0",
            "left": this.style.lefterWidth + "px",
        });
        this.prepareVerticalSide();
    }

    private prepareVerticalSide(): void {

        this.horizontalSide = new HorizontalSide(this.style);
        this.horizontalSide.setAppendCallback((delta: number) => {
            for (let i = 0; i < delta; i++) {
                let item = this.createItem(i);
                this.visibleItems.push(item);
            }
        });

        this.horizontalSide.setReduceCallback((delta: number) => {
            let index = this.horizontalSide.getRequiredColumns();
            this.visibleItems.splice(index - 1, delta);
        });

        this.horizontalSide.setMoveCallback((delta: number) => {
            let leftIndex = this.horizontalSide.getFirstLeftIndex();
            if (delta > 0) {
                let offset = this.visibleItems.length - delta;
                for (let i = 0; i < offset; i++) {
                    this.copyContents(i + delta, i);
                }
                for (let i = Math.max(offset, 0); i < this.visibleItems.length; i++) {
                    this.readContents(i, leftIndex + i + delta);
                }
            } else {
                let offset = -delta;
                for (let i = this.visibleItems.length - 1; i > offset; i--) {
                    this.copyContents(i + delta, i);
                }
                for (let i = Math.min(this.visibleItems.length, offset); i >= 0; i--) {
                    this.readContents(i, leftIndex + i + delta);
                }
            }
        });
    }

    private copyContents(sourceIndex: number, targetIndex: number): void {
        let sourceItem = this.visibleItems[sourceIndex];
        let targetItem = this.visibleItems[targetIndex];
        let rowIndex = sourceItem.getColumnIndex();
        targetItem.setColumnIndex(rowIndex);
    }

    private readContents(itemIndex: number, providerIndex: number): void {
        let visibleItem = this.visibleItems[itemIndex];
        visibleItem.setColumnIndex(providerIndex);
    }

    private createItem(index: number): HeaderItem {

        let item = new HeaderItem(this.element, this.style, index);
        item.setContentProvider(this.contentProvider);
        item.setLabelProvider(this.labelProvider);
        item.setInput(this.input);
        item.setColumnIndex(index);

        // Response cell di click.
        item.addClickListener({

            click: (item: HeaderItem) => {

                this.clearSelections();

                // Tampilkan satu row selection yang baru
                let columnIndex = item.getColumnIndex();
                item.setSelected(true);
                this.selectedColumns.push(columnIndex);

                this.notifySelectionListeners();

            }
        });

        return item;
    }

    private clearSelections(): void {
        this.selectedColumns = [];
    }

    public getHeight(): number {
        return this.height;
    }

    public setContentProvider(provider: TensorContentProvider): void {
        super.setContentProvider(provider);
        this.horizontalSide.setContentProvider(provider);
        for (let item of this.visibleItems) {
            item.setContentProvider(provider);
        }
    }

    public setInput(input: any): void {
        super.setInput(input);

        // Reset
        this.visibleItems = [];
        this.clearSelections();

        // Input
        this.horizontalSide.setInput(input);

        // Layout
        let columnCount = this.contentProvider.getColumnCount(input);
        if (columnCount > 0) {
            this.height = this.style.headerHeight;
            this.element.css({
                "top": "0px",
                "left": this.style.lefterWidth + "px",
                "border-bottom": "1px solid #D8D8D8",
            });
            this.element.outerWidth(this.style.cellWidth);
            this.element.outerHeight(this.height);
        }
    }

    public setWidth(width: number): void {
        this.horizontalSide.setWidth(width);
        this.element.outerWidth(width);
    }

    public setLeftIndex(index: number): void {

    }

    public setSelectedColumn(column: number): void {

    }

    private notifySelectionListeners(): void {

    }

}

class HeaderItem extends Section {

    private columnIndex: number = null;

    constructor(parent: JQuery, style: TensorViewerStyle, index: number) {
        super(parent, style, "viewers-tensorViewer-header-item");
        let left = index * style.cellWidth;
        this.element.css({
            "left": left + "px",
            "padding-left": "4px",
            "padding-right": "4px",
            "width": style.cellWidth + "px",
            "height": style.headerHeight + "px",
            "border-right": "1px solid #D8D8D8",
        });
    }

    public setColumnIndex(index: number): void {
        this.columnIndex = index;
        this.updatePane();
    }

    private updatePane(): void {
        this.element.text(this.columnIndex);
    }

    public getColumnIndex(): number {
        return this.columnIndex;
    }

    public setSelected(state: boolean): void {

    }

}

class Lefter extends Section {

    private width: number = null;
    private verticalSide: VerticalSide = null;
    private visibleItems: LefterItem[] = []; // Daftar item yang ada di tampilkan
    private selectedRows: number[] = []; // Daftar selected rows

    constructor(parent: JQuery, style: TensorViewerStyle) {
        super(parent, style, "viewers-tensorViewer-lefter");
        this.element.css({
            "left": "0px",
            "background": "#F0F0F0",
            "border-right": "1px solid #D8D8D8"
        });
        this.prepareVerticalSide();
    }

    private prepareVerticalSide(): void {

        this.verticalSide = new VerticalSide(this.style);
        this.verticalSide.setAppendCallback((delta: number) => {
            for (let i = 0; i < delta; i++) {
                let item = this.createItem(i);
                this.visibleItems.push(item);
            }
        });

        this.verticalSide.setReduceCallback((delta: number) => {
            let index = this.verticalSide.getRequiredItems();
            this.visibleItems.splice(index - 1, delta);
        });

        this.verticalSide.setMoveCallback((delta: number) => {
            let topIndex = this.verticalSide.getFirstTopIndex();
            if (delta > 0) {
                let offset = this.visibleItems.length - delta;
                for (let i = 0; i < offset; i++) {
                    this.copyContents(i + delta, i);
                }
                for (let i = Math.max(offset, 0); i < this.visibleItems.length; i++) {
                    this.readContents(i, topIndex + i + delta);
                }
            } else {
                let offset = -delta;
                for (let i = this.visibleItems.length - 1; i > offset; i--) {
                    this.copyContents(i + delta, i);
                }
                for (let i = Math.min(this.visibleItems.length, offset); i >= 0; i--) {
                    this.readContents(i, topIndex + i + delta);
                }
            }
        });
    }

    private copyContents(sourceIndex: number, targetIndex: number): void {
        let sourceItem = this.visibleItems[sourceIndex];
        let targetItem = this.visibleItems[targetIndex];
        let rowIndex = sourceItem.getRowIndex();
        targetItem.setRowIndex(rowIndex);
    }

    private readContents(itemIndex: number, providerIndex: number): void {
        let visibleItem = this.visibleItems[itemIndex];
        visibleItem.setRowIndex(providerIndex);
    }

    private createItem(index: number): LefterItem {

        let item = new LefterItem(this.element, this.style, index);
        item.setContentProvider(this.contentProvider);
        item.setLabelProvider(this.labelProvider);
        item.setInput(this.input);
        item.setRowIndex(index);

        // Response cell di click.
        item.addClickListener({

            click: (item: LefterItem) => {

                this.clearSelections();

                // Tampilkan satu row selection yang baru
                let rowIndex = item.getRowIndex();
                item.setSelected(true);
                this.selectedRows.push(rowIndex);

                this.notifySelectionListeners();

            }
        });

        return item;
    }

    private clearSelections(): void {
        this.selectedRows = [];
    }

    public getWidth(): number {
        return this.width;
    }

    public setContentProvider(provider: TensorContentProvider): void {
        super.setContentProvider(provider);
        this.verticalSide.setContentProvider(provider);
        for (let item of this.visibleItems) {
            item.setContentProvider(provider);
        }
    }

    public setInput(input: any): void {
        super.setInput(input);

        // Reset
        this.visibleItems = [];
        this.clearSelections();

        // Input
        this.verticalSide.setInput(input);

        // Layout
        let rowCount = this.contentProvider.getRowCount(input);
        if (rowCount > 0) {
            this.width = this.style.lefterWidth;
            this.element.outerWidth(this.width);
            this.element.outerHeight(this.style.cellHeight);
            let columnCount = this.contentProvider.getColumnCount(input);
            if (columnCount > 0) {
                this.element.css({
                    "top": this.style.headerHeight + "px",
                });
            } else {
                this.element.css({
                    "top": "0px",
                });
            }
        }
    }

    public setHeight(height: number): void {
        this.verticalSide.setHeight(height);
        this.element.outerHeight(height);
    }

    public setTopIndex(index: number): void {

    }

    public setSelectedRow(row: number): void {

    }

    private notifySelectionListeners(): void {

    }

}

class LefterItem extends Section {

    private rowIndex: number = null;

    constructor(parent: JQuery, style: TensorViewerStyle, index: number) {
        super(parent, style, "viewers-tensorViewer-cell");
        let top = index * style.cellHeight;
        this.element.css({
            "top": top + "px",
            "text-align": "center",
            "padding-left": "4px",
            "padding-right": "4px",
            "width": style.lefterWidth + "px",
            "height": style.cellHeight + "px",
            "border-bottom": "1px solid #D8D8D8",
        });
    }

    public setRowIndex(index: number): void {
        this.rowIndex = index;
        this.updatePane();
    }

    private updatePane(): void {
        this.element.text(this.rowIndex);
    }

    public getRowIndex(): number {
        return this.rowIndex;
    }

    public setSelected(state: boolean): void {

    }

}

class VerticalSide extends Side {

    private firstTopIndex: number = 0;
    private lastTopIndex: number = 0;
    private requiredItems: number = 0;
    private availableCount: number = 0;

    private appendCallback = (delta: number) => { };
    private reduceCallback = (delta: number) => { };
    private moveCallback = (delta: number) => { };

    public setInput(input: any): void {
        super.setInput(input);
        this.firstTopIndex = 0;
        this.requiredItems = this.contentProvider.getRowCount(input);
        this.lastTopIndex = Math.max(0, this.requiredItems - this.availableCount);
    }

    public setHeight(height: number): void {

        if (this.requiredItems === 0) {
            return;
        }

        let oldAvailableCount = this.availableCount;
        let newAvailableCount = Math.ceil(height / this.style.cellHeight);
        let delta: number;

        if (this.requiredItems < Math.min(newAvailableCount, oldAvailableCount)) {
            return; // Tidak perlu modifikasi items jika semua item tampil.
        }

        delta = newAvailableCount - oldAvailableCount;
        this.availableCount = newAvailableCount;
        this.lastTopIndex = Math.max(0, this.requiredItems - newAvailableCount);

        // Selisih item menentukan hapus atau tambah item.
        if (delta > 0) {
            delta = Math.min(delta, this.requiredItems);
            this.appendCallback(delta);
        } else if (delta < 0) {
            this.reduceCallback(delta);
        }

        // Jika topIndex baru lebih kecil dari yang topIndex terakhir maka move.
        if (this.lastTopIndex < this.firstTopIndex) {
            if (this.firstTopIndex - delta < 0) {
                this.moveCallback(-this.firstTopIndex);
            } else {
                this.moveCallback(-delta);
            }
        }

    }

    public getRequiredItems(): number {
        return this.requiredItems;
    }

    public getRequiredHeight(): number {
        return this.requiredItems * this.style.cellHeight;
    }

    public setFirstTopIndex(index: number): void {
        let oldTopIndex = this.firstTopIndex;
        this.firstTopIndex = index;
        this.lastTopIndex = this.firstTopIndex + this.availableCount;
        let delta = this.firstTopIndex - oldTopIndex;
        this.moveCallback(delta);
    }

    public getFirstTopIndex(): number {
        return this.firstTopIndex;
    }

    public getLastTopIndex(): number {
        return this.lastTopIndex;
    }

    public setAppendCallback(callback: (delta: number) => void): void {
        this.appendCallback = callback;
    }

    public setReduceCallback(callback: (delta: number) => void): void {
        this.reduceCallback = callback;
    }

    public setMoveCallback(callback: (delta: number) => void): void {
        this.moveCallback = callback;
    }

}

class HorizontalSide extends Side {

    private firstLeftIndex: number = 0;
    private lastLeftIndex: number = 0;
    private requiredColumns: number = 0;
    private visibleColumns: number = 0;

    private appendCallback = (delta: number) => { };
    private reduceCallback = (delta: number) => { };
    private moveCallback = (delta: number) => { };

    public setInput(input: any): void {
        super.setInput(input);
        this.firstLeftIndex = 0;
        this.requiredColumns = this.contentProvider.getColumnCount(input);
        this.lastLeftIndex = Math.max(0, this.requiredColumns - this.visibleColumns);
    }

    public setWidth(width: number): void {

        if (this.requiredColumns === 0) {
            return;
        }

        let oldVisibles = this.visibleColumns;
        let newVisibles = Math.ceil(width / this.style.cellHeight);
        let delta: number;

        if (this.requiredColumns < Math.min(newVisibles, oldVisibles)) {
            return; // Tidak perlu modifikasi items jika semua item tampil.
        }

        delta = newVisibles - oldVisibles;
        this.visibleColumns = newVisibles;
        this.lastLeftIndex = Math.max(0, this.requiredColumns - newVisibles);

        // Selisih item menentukan hapus atau tambah item.
        if (delta > 0) {
            delta = Math.min(delta, this.requiredColumns);
            this.appendCallback(delta);
        } else if (delta < 0) {
            this.reduceCallback(delta);
        }

        // Jika topIndex baru lebih kecil dari yang topIndex terakhir maka move.
        if (this.lastLeftIndex < this.firstLeftIndex) {
            if (this.firstLeftIndex - delta < 0) {
                this.moveCallback(-this.firstLeftIndex);
            } else {
                this.moveCallback(-delta);
            }
        }

    }

    public getRequiredColumns(): number {
        return this.requiredColumns;
    }

    public getRequiredWidth(): number {
        return this.requiredColumns * this.style.cellWidth;
    }

    public setFirstLeftIndex(index: number): void {
        let oldLeftIndex = this.firstLeftIndex;
        this.firstLeftIndex = index;
        this.lastLeftIndex = this.firstLeftIndex + this.visibleColumns;
        let delta = this.firstLeftIndex - oldLeftIndex;
        this.moveCallback(delta);
    }

    public getFirstLeftIndex(): number {
        return this.firstLeftIndex;
    }

    public getLastLeftIndex(): number {
        return this.lastLeftIndex;
    }

    public setAppendCallback(callback: (delta: number) => void): void {
        this.appendCallback = callback;
    }

    public setReduceCallback(callback: (delta: number) => void): void {
        this.reduceCallback = callback;
    }

    public setMoveCallback(callback: (delta: number) => void): void {
        this.moveCallback = callback;
    }

}

class Body extends Section {

    private verticalSide: VerticalSide = null;
    private horizontalSide: HorizontalSide = null;
    private visibleItems: BodyItem[] = []; // Daftar item yang ada di tampilkan
    private selectedCells: number[][] = []; // Daftar selected cells

    constructor(parent: JQuery, style: TensorViewerStyle) {
        super(parent, style, "viewers-tensorViewer-body");
        this.prepareVerticalSide();
        this.prepareHorizontalSide();
    }

    private prepareVerticalSide(): void {

        this.verticalSide = new VerticalSide(this.style);
        this.verticalSide.setAppendCallback((delta: number) => {
            let columns = this.horizontalSide.getRequiredColumns();
            for (let i = 0; i < delta; i++) {
                let item = this.createItem(i, columns);
                this.visibleItems.push(item);
            }
        });

        this.verticalSide.setReduceCallback((delta: number) => {
            let index = this.verticalSide.getRequiredItems();
            this.visibleItems.splice(index - 1, delta);
        });

        this.verticalSide.setMoveCallback((delta: number) => {
            let topIndex = this.verticalSide.getFirstTopIndex();
            if (delta > 0) {
                let offset = this.visibleItems.length - delta;
                for (let i = 0; i < offset; i++) {
                    this.copyContents(i + delta, i);
                }
                for (let i = Math.max(offset, 0); i < this.visibleItems.length; i++) {
                    this.readContents(i, topIndex + i + delta);
                }
            } else {
                let offset = -delta;
                for (let i = this.visibleItems.length - 1; i > offset; i--) {
                    this.copyContents(i + delta, i);
                }
                for (let i = Math.min(this.visibleItems.length, offset); i >= 0; i--) {
                    this.readContents(i, topIndex + i + delta);
                }
            }
        });
    }

    private copyContents(sourceIndex: number, targetIndex: number): void {
        let sourceItem = this.visibleItems[sourceIndex];
        let targetItem = this.visibleItems[targetIndex];
        targetItem.copyItem(sourceItem);
        this.maintainItemCellsSelection(targetItem);
    }

    private maintainItemCellsSelection(item: BodyItem) {

    }

    private readContents(itemIndex: number, providerIndex: number): void {
        let targetItem = this.visibleItems[itemIndex];
        targetItem.setRowIndex(providerIndex);
        this.maintainItemCellsSelection(targetItem);
    }

    private prepareHorizontalSide(): void {
        this.horizontalSide = new HorizontalSide(this.style);
    }

    public setContentProvider(provider: TensorContentProvider): void {
        super.setContentProvider(provider);
        this.verticalSide.setContentProvider(provider);
        this.horizontalSide.setContentProvider(provider);
        for (let item of this.visibleItems) {
            item.setContentProvider(provider);
        }
    }

    public setLabelProvider(provider: TensorLabelProvider): void {
        for (let item of this.visibleItems) {
            item.setLabelProvider(provider);
        }
    }

    public setInput(input: any): void {
        super.setInput(input);

        // Reset
        this.visibleItems = [];
        this.clearSelections();

        // Input
        this.verticalSide.setInput(input);
        this.horizontalSide.setInput(input);

        // Layout
        let rowCount = this.contentProvider.getRowCount(input);
        if (rowCount > 0) {
            let columnCount = this.contentProvider.getColumnCount(input);
            this.element.css({
                "left": this.style.lefterWidth + "px",
            });
            if (columnCount > 0) {
                this.element.css({
                    "top": this.style.headerHeight + "px",
                });
            }
        }

    }

    private createItem(index: number, columnCount: number): BodyItem {

        let item = new BodyItem(this.element, this.style, index, columnCount);
        item.setContentProvider(this.contentProvider);
        item.setLabelProvider(this.labelProvider);
        item.setInput(this.input);
        item.setRowIndex(index);

        // Response cell di click.
        item.addCellClickListener({

            click: (cell: Cell) => {

                this.clearSelections();

                // Tampilkan satu cell selection yang baru
                let rowIndex = item.getRowIndex();
                item.setSelectedCells([cell]);
                let columnIndex = cell.getColumnIndex();
                this.selectedCells.push([rowIndex, columnIndex]);

                this.notifySelectionListeners();

            }
        });

        return item;
    }

    private clearSelections(): void {
        for (let bufferedItem of this.visibleItems) {
            bufferedItem.setSelectedCells([]);
        }
        this.selectedCells = [];
    }

    public setWidth(width: number): void {
        this.horizontalSide.setWidth(width);
        this.element.outerWidth(width);
    }

    public setHeight(height: number): void {
        this.verticalSide.setHeight(height);
        this.element.outerHeight(height);
    }

    public getRequiredWidth(): number {
        return this.horizontalSide.getRequiredWidth();
    }

    public getRequiredHeight(): number {
        return this.verticalSide.getRequiredHeight();
    }

    public setFirstLeftIndex(index: number): void {
        return this.horizontalSide.setFirstLeftIndex(index);
    }

    public getFirstLeftIndex(): number {
        return this.horizontalSide.getFirstLeftIndex();
    }

    public getLastLeftIndex(): number {
        return this.horizontalSide.getLastLeftIndex();
    }

    public setFirstTopIndex(index: number): void {
        return this.verticalSide.setFirstTopIndex(index);
    }

    public getFirstTopIndex(): number {
        return this.verticalSide.getFirstTopIndex();
    }

    public getLastTopIndex(): number {
        return this.verticalSide.getLastTopIndex();
    }

    public setSelectedColumn(column: number): void {

    }

    public setSelectedRow(row: number): void {

    }

    public setSelectedCell(column: number, row: number): void {

    }

    private notifySelectionListeners(): void {

    }

}

class BodyItem extends Section {

    private rowIndex: number = null;
    private cells: Cell[] = [];

    constructor(parent: JQuery, style: TensorViewerStyle, index: number, columnCount: number) {
        super(parent, style, "viewers-tensorViewer-body-item");

        let columns = Math.max(columnCount, 1);
        let top = index * style.cellHeight;
        let width = columns * style.cellWidth;
        this.element.css({
            "top": top + "px",
            "width": width + "px",
            "height": style.cellHeight + "px",
            "border-bottom": "1px solid #D8D8D8",
        });

        for (let i = 0; i < columns; i++) {
            let cell = new Cell(this.element, style, i);
            this.cells.push(cell);
        }
    }

    public setContentProvider(provider: TensorContentProvider): void {
        super.setContentProvider(provider);
        for (let cell of this.cells) {
            cell.setContentProvider(provider);
        }
    }

    public setLabelProvider(provider: TensorLabelProvider): void {
        super.setLabelProvider(provider);
        for (let cell of this.cells) {
            cell.setLabelProvider(provider);
        }
    }

    public setInput(input: any): void {
        super.setInput(input);
        for (let cell of this.cells) {
            cell.setInput(input);
        }
    }

    public setRowIndex(index: number): void {
        this.rowIndex = index;
        for (let cell of this.cells) {
            cell.setRowIndex(index);
        }
    }

    public copyItem(item: BodyItem): void {

    }

    public getRowIndex(): number {
        return this.rowIndex;
    }

    public setSelectedCells(cells: Cell[]): void {

    }

    public addCellClickListener(listener: ClickListener): void {

    }

}

class Cell extends Section {

    private rowIndex: number = null;
    private columnIndex: number = null;

    constructor(parent: JQuery, style: TensorViewerStyle, index: number) {
        super(parent, style, "viewers-tensorViewer-cell");
        let left = style.cellWidth * index;
        this.element.css({
            "position": "absolute",
            "left": left + "px",
            "padding-left": "4px",
            "padding-right": "4px",
            "border-right": "1px solid #D8D8D8",
            "height": style.cellHeight + "px",
            "width": style.cellWidth + "px",
        });
    }

    public setRowIndex(index: number): void {
        this.rowIndex = index;
        this.updateMaker();
    }

    public setColumnIndex(index: number): void {
        this.columnIndex = index;
        this.updateMaker();
    }

    private updateMaker(): void {
        let value = this.contentProvider.getCell(this.input, this.rowIndex, this.columnIndex);
        this.element.text(value);
    }

    public getColumnIndex(): number {
        return this.columnIndex;
    }

}

