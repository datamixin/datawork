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
import Layout from "webface/widgets/Layout";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";

// TODO: BUG: horizontalAlignment = webface.END di baris pertama tidak bekerja, gunakan label spacer

export default class GridLayout extends Layout {

    public numColumns: number = 1;
    public verticalSpacing: number = 5;
    public horizontalSpacing: number = 5;
    public marginWidth: number = 5;
    public marginHeight: number = 5;
    public marginTop: number = 0;
    public marginBottom: number = 0;
    public marginLeft: number = 0;
    public marginRight: number = 0;

    constructor(numColumns?: number,
        marginWidth?: number, marginHeight?: number,
        horizontalSpacing?: number, verticalSpacing?: number) {
        super();
        if (numColumns !== undefined) this.numColumns = numColumns;
        if (marginWidth !== undefined) this.marginWidth = marginWidth;
        if (marginHeight !== undefined) this.marginHeight = marginHeight;
        if (horizontalSpacing !== undefined) this.horizontalSpacing = horizontalSpacing;
        if (verticalSpacing !== undefined) this.verticalSpacing = verticalSpacing;
    }

    public prepare(composite: Composite): void {
        let element = composite.getElement();
        element.addClass("layout-grid");
    }

    public layout(composite: Composite): void {

        let children = composite.getChildren();
        let area = composite.getClientArea();
        let numColumns = this.numColumns;
        let verticalSpacing = this.verticalSpacing;
        let horizontalSpacing = this.horizontalSpacing;
        let marginWidth = this.marginWidth;
        let marginHeight = this.marginHeight;
        let marginLeft = this.marginLeft;
        let marginRight = this.marginRight;
        let marginTop = this.marginTop;
        let marginBottom = this.marginBottom;

        let colIndex = 0;
        let rows: Array<any> = [];
        let colWidths: Array<number> = [];
        let rowHeights: Array<number> = [];
        let hasGrabH: Array<number> = [];
        let hasGrabV: Array<number> = [];
        let rowIndex = 0;
        let rowCount: number;
        let spareWidth: number;
        let spareHeight: number;
        let maxRows: number = 0;

        // Fungsi untuk membuat raw baru.
        function newRow() {
            let cells: Array<any> = [];
            for (var index = 0; index < numColumns; index++) {
                let cell: any = {};
                cell.ispan = false;
                cells.push(cell);
            }
            rows.push(cells);
        }

        // Minimal ada satu row.
        newRow();

        // Cari jumlah maximum row

        for (var i = 0; i < children.length; i++) {
            let child = children[i];
            let data = child.getLayoutData() || new GridData();
            maxRows += data.horizontalSpan + data.verticalSpan;
        }

        // Looping ke semua control untuk membangun rows dan cells.
        children.forEach(function(control, index) {

            let size = control.computeSize();
            let cells = rows[rowIndex];
            let data = <GridData>control.getLayoutData() || new GridData();
            let hspan = data.horizontalSpan;
            let vspan = data.verticalSpan;
            let hindt = data.horizontalIndent;
            let vindt = data.verticalIndent;
            let grabv = data.grabExcessVerticalSpace;
            let grabh = data.grabExcessHorizontalSpace;
            let whint = data.widthHint;
            let hhint = data.heightHint;
            let algnh = data.horizontalAlignment;
            let algnv = data.verticalAlignment;
            let cspan: number;

            // Kendalikan row index dan column index dan buat row baru
            function manageIndex() {
                colIndex++;
                if (colIndex >= numColumns) {
                    colIndex = 0;
                    rowIndex++;
                    if (rows[rowIndex] === undefined) {
                        newRow();
                    }
                }
                if (cells[colIndex].ispan && rows.length < maxRows) {
                    manageIndex();
                }
            }

            // Tidak mengisi cell yang merupakan ispan
            while (cells[colIndex].ispan && rows.length < maxRows) {
                manageIndex();
            }

            // Berikan width untuk cell sekarang.
            if (colWidths[colIndex] === undefined) {
                colWidths.push(0);
                hasGrabH.push(0);
            }

            cells[colIndex].hindt = hindt;
            if (grabh) {
                cells[colIndex].grabh = true;
                if (hspan === 1) {
                    hasGrabH[colIndex]++;
                }
            } else {
                if (whint === webface.DEFAULT) {
                    whint = size.x === 0 ? webface.DEFAULT : size.x;
                }
                cells[colIndex].whint = whint;
                cells[colIndex].algnh = algnh;
                if (colWidths[colIndex] < whint + hindt) {
                    colWidths[colIndex] = whint + hindt;
                }
            }

            // Berikan height untuk cell sekarang.
            if (rowHeights[rowIndex] === undefined) {
                rowHeights.push(0);
                hasGrabV.push(0);
            }

            cells[colIndex].vindt = vindt;
            if (grabv) {
                cells[colIndex].grabv = true;
                if (vspan === 1) {
                    hasGrabV[rowIndex]++;
                }
            } else {

                if (hhint === webface.DEFAULT) {
                    hhint = size.y === 0 ? webface.DEFAULT : size.y;
                }
                cells[colIndex].hhint = hhint;
                cells[colIndex].algnv = algnv;
                if (rowHeights[rowIndex] < hhint + vindt) {
                    rowHeights[rowIndex] = hhint + vindt;
                }
            }

            // Fill vertical panggil minimal sekali.
            function fillVerticalSpan(span: number) {
                let nextRowIndex: number;
                for (var n = 1; n < vspan; n++) {
                    nextRowIndex = rowIndex + n;
                    if (rows[nextRowIndex] === undefined) {
                        newRow();
                    }
                    rows[nextRowIndex][colIndex].ispan = true;
                    rows[nextRowIndex][colIndex].rspan = rowIndex;
                    rows[nextRowIndex][colIndex].cspan = span;
                }
            }

            hspan = Math.min(cells.length - colIndex, hspan);
            cells[colIndex].hspan = hspan;
            cells[colIndex].vspan = vspan;
            cells[colIndex].cntrl = control;
            cspan = colIndex;
            fillVerticalSpan(cspan);

            for (var n = 1; n < hspan; n++) {
                colIndex++;
                cells[colIndex].ispan = true;
                cells[colIndex].rspan = rowIndex;
                cells[colIndex].cspan = cspan;
                fillVerticalSpan(cspan);
            }

            manageIndex();

        }); // <<< Selesai looping children.

        // Cari jumlah row yang terisi control.
        function calculateRowCount() {
            let lastRow = rows[rowIndex];
            rowCount = rowIndex;
            for (var i = 0; i < lastRow.length; i++) {
                if (lastRow[i].cntrl !== undefined) {
                    rowCount = rowIndex + 1;
                    break;
                }
            }
        }
        calculateRowCount();

        // Hitung colomn yang gak punya width dan kurangin totalWidth.
        let addWidths: number = 0;
        function calculateNoColumnWidth() {
            spareWidth = area.x;
            spareWidth -= (marginLeft + marginWidth);
            addWidths = 0;
            for (var i = 0; i < colWidths.length; i++) {
                if (hasGrabH[i] > 0) {
                    addWidths++;
                }

                spareWidth -= colWidths[i];
                if (i > 0) {
                    spareWidth -= horizontalSpacing;
                }
            }
            spareWidth -= (marginRight + marginWidth);
        }
        calculateNoColumnWidth();

        // Bagi tambahan width ke yang punya grab dan span.
        colWidths.forEach(function(colWidth, index) {
            let cellRow: any;
            let cellCol: any;
            if (hasGrabH[index] > 0) {
                if (addWidths > 0) {
                    colWidths[index] += spareWidth / addWidths;
                }
            }
            for (var n = 0; n < rowCount; n++) {

                rows[n][index].wsets = 0;
                rows[n][index].wsize = colWidths[index];
                if (rows[n][index].ispan) {

                    // Tambahkan ke cell yang memilikinya.
                    cellRow = rows[n][index].rspan;
                    cellCol = rows[n][index].cspan;
                    if (n === cellRow) {
                        rows[cellRow][cellCol].wsets += colWidths[index];
                        rows[cellRow][cellCol].wsets += horizontalSpacing;
                    }
                } else {
                    rows[n][index].wsets += colWidths[index];
                }
            }
        });

        // Berikan width ke semua cell yang punya control.
        function setWidthToControls() {
            let cells: Array<any> = [];
            let cell: any;
            let control: Control;
            for (var i = 0; i < rowCount; i++) {
                cells = rows[i];
                for (var j = 0; j < cells.length; j++) {
                    cell = cells[j];
                    if (!cell.ispan) {
                        control = cell.cntrl;
                        if (control !== undefined) {
                            let indt = cell.hindt;
                            if (cell.grabh) {
                                control.setSize(cell.wsets - indt, webface.DEFAULT);
                            } else {
                                if (cell.whint === undefined || cell.algnh === webface.FILL) {
                                    control.setSize(cell.wsets - indt, webface.DEFAULT); // default
                                } else {
                                    control.setSize(cell.whint, webface.DEFAULT);
                                }
                            }
                        }
                    }
                }
            }
        }
        setWidthToControls();

        // Hitung row yang gak punya height dan kurangin totalHeight.
        let addHeights: number = 0;
        function calculateNoColumnHeight() {
            spareHeight = area.y;
            spareHeight -= (marginTop + marginHeight);
            addHeights = 0;
            for (var i = 0; i < rowHeights.length; i++) {
                if (hasGrabV[i] > 0) {
                    addHeights++;
                }

                spareHeight -= rowHeights[i];
                if (i > 0) {
                    spareHeight -= verticalSpacing;
                }
            }
            spareHeight -= (marginBottom + marginHeight);
        }
        calculateNoColumnHeight();

        // Bagi tambahan height ke yang punya grab dan span.
        function setAddHeightToGrab() {
            let cellRow: any;
            let cellCol: any;
            for (var i = 0; i < rowCount; i++) {
                if (hasGrabV[i] > 0) {
                    if (addHeights > 0) {
                        rowHeights[i] += spareHeight / addHeights;
                    }
                }
                for (var n = 0; n < numColumns; n++) {

                    rows[i][n].hsets = 0;
                    rows[i][n].hsize = rowHeights[i];
                    if (rows[i][n].ispan) {

                        /**
                         * Tambahkan ke cell yang memilikinya.
                         */
                        cellRow = rows[i][n].rspan;
                        cellCol = rows[i][n].cspan;
                        if (n === cellCol) {
                            rows[cellRow][cellCol].hsets += rowHeights[i];
                            rows[cellRow][cellCol].hsets += verticalSpacing;
                        }
                    } else {
                        rows[i][n].hsets += rowHeights[i];
                    }
                }
            }
        }
        setAddHeightToGrab();

        // Berikan height ke semua cell yang punya control.
        function setHeightToControls() {
            let cells: Array<any> = [];
            let cell: any;
            let control: any;
            for (var i = 0; i < rowCount; i++) {
                cells = rows[i];
                for (var j = 0; j < cells.length; j++) {
                    cell = cells[j];
                    if (!cell.ispan) {
                        control = cell.cntrl;
                        if (control !== undefined) {
                            let indt = cell.vindt;
                            if (cell.grabv) {
                                control.setSize(webface.DEFAULT, cell.hsets - indt);
                            } else {
                                if (cell.hhint === undefined || cell.algnv === webface.FILL) {
                                    control.setSize(webface.DEFAULT, cell.hsets - indt); // default
                                } else {
                                    control.setSize(webface.DEFAULT, cell.hhint);
                                }
                            }
                        }
                    }
                }
            }
        }
        setHeightToControls();

        // Atur posisi top dan left.
        function setTopLeft() {
            let top: number = marginTop + marginHeight;
            let left: number = marginLeft + marginWidth;
            let cells: Array<any>;
            let cell: any;
            let control: Control;
            let tpos: number;
            let tadd: number;
            let lpos: number;
            let ladd: number;
            for (var i = 0; i < rowCount; i++) {
                cells = rows[i];
                for (var j = 0; j < cells.length; j++) {
                    cell = cells[j];
                    if (!cell.ispan) {
                        control = cell.cntrl;
                        if (control !== undefined) {

                            let size = control.computeSize();

                            // Atur top control element
                            tpos = top;
                            tadd = cell.vindt;
                            if (cell.algnv === webface.CENTER) {
                                tadd = (cell.hsize - size.y) / 2;
                            } else if (cell.algnv === webface.END) {
                                tadd = cell.hsize - size.y;
                            }

                            // Atur left control element
                            lpos = left;
                            ladd = cell.hindt;
                            if (cell.algnh === webface.CENTER) {
                                ladd = (cell.wsize - size.x) / 2;
                            } else if (cell.algnh === webface.END) {
                                ladd = cell.wsize - size.x;
                            }
                            let element = control.getElement();
                            element.css({
                                "position": "absolute",
                                "top": Math.floor(tpos + tadd),
                                "left": Math.floor(lpos + ladd)
                            });
                        }
                    }
                    left += cell.wsize + horizontalSpacing;
                }
                top += cells[0].hsize + verticalSpacing;
                left = marginLeft + marginWidth;
            }
        }
        setTopLeft();
    }

    public grabVerticalExclusive(composite: Composite, control: Control): void {
        if (this.numColumns === 1) {
            let children = composite.getChildren();
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                let layoutData = <GridData>child.getLayoutData();
                if (child === control) {
                    layoutData.grabExcessVerticalSpace = true;
                    layoutData.heightHint = webface.DEFAULT;
                } else {
                    layoutData.grabExcessVerticalSpace = false;
                    layoutData.heightHint = 0;
                }
            }
        } else {
            console.warn("Grab vertical alone only work on 1 column grid layout");
        }
    }

    public grabHorizontalExclusive(composite: Composite, control: Control): void {
        let children = composite.getChildren();
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            let layoutData = <GridData>child.getLayoutData();
            if (child === control) {
                layoutData.grabExcessHorizontalSpace = true;
                layoutData.widthHint = webface.DEFAULT;
            } else {
                layoutData.grabExcessHorizontalSpace = false;
                layoutData.widthHint = 0;
            }
        }
    }
}

