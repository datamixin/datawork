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
import AbsoluteData from "webface/layout/AbsoluteData";

import GridRowPanel from "padang/grid/GridRowPanel";
import GridCellPanel from "padang/grid/GridCellPanel";
import GridControlStyle from "padang/grid/GridControlStyle";
import GridMarkerArranger from "padang/grid/GridMarkerArranger";
import GridColumnOrganizer from "padang/grid/GridColumnOrganizer";
import GridContentScroller from "padang/grid/GridContentScroller";
import GridElementListPanel from "padang/grid/GridElementListPanel";
import GridRowRangeSideline from "padang/grid/GridRowRangeSideline";
import GridCellRangeFeedback from "padang/grid/GridCellRangeFeedback";
import GridColumnRangeUnderline from "padang/grid/GridColumnRangeUnderline";

export default class GridCellSelection {

    private element: JQuery = null;
    private selectedRow = -1;
    private selectedColumn = -1;
    private maxRowFlag: boolean = false;
    private editingMode: boolean = false;
    private selectedPanel: GridCellPanel = null;
    private authoredPanel: GridCellPanel = null;
    private scroller: GridContentScroller = null;
    private organizer = new GridColumnOrganizer();
    private arranger = new GridMarkerArranger();
    private sideline: GridRowRangeSideline = null;
    private underline: GridColumnRangeUnderline = null;
    private feedback: GridCellRangeFeedback = null;
    private style: GridControlStyle = null;
    private listPanel: GridElementListPanel = null;
    private onRowExpand = (): boolean => { return false };

    constructor(style: GridControlStyle, listPanel: GridElementListPanel, scroller: GridContentScroller) {
        this.style = style;
        this.listPanel = listPanel;
        this.scroller = scroller;
    }

    public installOn(element: JQuery): void {
        element.attr("tabindex", 0);
        element.on("click", () => {

            this.verifyEditing();
            this.enterSelection();

        });
        element.on("keydown", (event: JQueryEventObject) => {

            if (event.which === 13) { // Enter

                this.adjust(0, 1);
                this.enterSelection();

            } else if (event.which === 27) { // Escape

                this.enterSelection();

            } else {

                if (this.editingMode === false) {

                    // Arrow keys
                    if (event.which >= 37 && event.which <= 40) {
                        if (this.authoredPanel !== null) {
                            this.authoredPanel.commitEdit();
                        }
                    }
                    if (event.which === 37) { // Left
                        this.adjust(-1, 0);
                    } else if (event.which === 38) { // Up
                        this.adjust(0, -1);
                    } else if (event.which === 39) { // Right
                        this.adjust(1, 0);
                    } else if (event.which === 40) { // Down
                        this.adjust(0, 1);
                    } else {

                        if (event.which === 113) { // F2 Editing

                            this.editingMode = true;
                            let panel = this.getSelectedPanel();
                            if (panel !== null) this.enterEditingStart(panel);


                        } else if (event.which === 8) { // DEL

                            let panel = this.getSelectedPanel();
                            if (panel !== null) {
                                if (this.authoredPanel === null) {
                                    this.enterAuthoring(panel, "");
                                }
                            }

                        } else {

                            if (event.altKey || event.ctrlKey) {
                                // Skip ALT and CTRL
                            } else {
                                let panel = this.getSelectedPanel();
                                if (panel !== null) this.enterAuthoring(panel);
                            }

                        }
                    }
                }
            }
        });
        this.element = element;
    }

    private getSelectedPanel(): GridCellPanel {
        let rowPanel = <GridRowPanel>this.listPanel.getPanelAt(this.selectedRow);
        if (rowPanel !== null) {
            let cellPanel = rowPanel.getPanelAt(this.selectedColumn);
            return cellPanel;
        } else {
            return null;
        }
    }

    private adjust(horizontal: number, vertical: number): void {

        // Focus row
        let newRow = this.selectedRow + vertical;
        let actualCount = this.listPanel.getActualCount();
        this.maxRowFlag = false;
        if (newRow >= 0 && newRow < actualCount) {
            this.selectedRow = newRow;
        } else {
            if (newRow === actualCount) {
                this.maxRowFlag = true;
                if (this.onRowExpand() === true) {
                    this.selectedRow = newRow;
                }
            }
        }

        // Focus column
        let newColumn = this.selectedColumn + horizontal;
        let columnCount = this.organizer.getColumnCount();
        if (newColumn >= 0 && newColumn < columnCount) {
            this.selectedColumn = newColumn;
        }

        this.revealIndication();
        this.clearSelection();

        // Ambil panel untuk di select
        this.selectedPanel = this.getSelectedPanel();
        let visibleHeight = this.scroller.getAvailableHeight();
        let visibleCount = Math.floor(visibleHeight / this.style.rowHeight);
        let topIndex = this.listPanel.getTopIndex();
        let lastVisibleIndex = visibleCount + topIndex;

        if (this.selectedRow >= lastVisibleIndex) {

            // Selected row tertutup di bawah maka harus scroll up
            let delta = this.selectedRow + 1 - lastVisibleIndex;
            let newTop = (-topIndex - delta) * this.style.rowHeight
            this.scroller.scrollToTop(newTop);
            this.selectedPanel = this.getSelectedPanel();

        } else {

            if (this.selectedPanel === null) {

                // Selected row tertutup di atas maka harus scroll down
                let top = this.selectedRow * this.style.rowHeight;
                let visibleCount = this.listPanel.getElementCount();
                let max = (topIndex + visibleCount) * this.style.rowHeight;
                if (top >= max) {
                    top = top - max + this.style.rowHeight;
                }
                this.scroller.scrollToTop(-top);
                this.selectedPanel = this.getSelectedPanel();

            }

        }
        if (this.selectedPanel !== null) {
            this.selectedPanel.setSelected(true);
        }
        this.element.focus();
    }

    private revealIndication(): boolean {

        let left = -1;
        let top = -1;
        let width = 0;
        let height = 0;

        let columnData = <AbsoluteData>this.organizer.indicateHasSelection(this.selectedColumn);
        if (columnData !== null) {
            left = <number>columnData.left;
            width = <number>columnData.width;
        } else if (this.selectedColumn === -1 && this.selectedRow !== -1) {
            width = this.scroller.getRequiredWidth();
            width -= this.scroller.getExtraWidth();
        }

        let markerData = <AbsoluteData>this.arranger.indicateHasSelection(this.selectedRow);
        if (markerData !== null) {
            top = <number>markerData.top;
            height = <number>markerData.height;
        } else if (this.selectedRow === -1 && this.selectedColumn !== -1) {
            height = this.scroller.getRequiredHeight();
            height -= this.scroller.getExtraHeight();
        }

        this.sideline.update(top, height);
        this.underline.update(left, width);
        this.feedback.update(left, top, height === 0 ? 0 : width, width === 0 ? 0 : height);
        return columnData !== null && markerData !== null;

    }

    public relayoutIndication(): void {
        this.revealIndication();
    }

    private clearSelection(): void {
        if (this.selectedPanel !== null) {
            this.selectedPanel.setSelected(false);
        }
    }

    private updateSelection(): void {
        this.selectedPanel = this.getSelectedPanel();
        this.selectedPanel.setSelected(true);
    }

    private enterEditingStart(panel: GridCellPanel): void {
        panel.enterEditStart();
        this.authoredPanel = null;
    }

    private verifyEditing(): void {
        this.maxRowFlag = false;
        if (this.selectedPanel === this.authoredPanel) {
            this.editingMode = true;
        }
    }

    public setOrganizer(organizer: GridColumnOrganizer): void {
        this.organizer = organizer;
    }

    public setArranger(arranger: GridMarkerArranger): void {
        this.arranger = arranger;
    }

    public setFeedback(feedback: GridCellRangeFeedback): void {
        this.feedback = feedback;
    }

    public setSideline(sideline: GridRowRangeSideline): void {
        this.sideline = sideline;
    }

    public setUnderline(underline: GridColumnRangeUnderline): void {
        this.underline = underline;
    }

    public enterAuthoring(panel: GridCellPanel, value?: string): void {
        panel.enterEdit(value);
        this.authoredPanel = panel;
    }

    public focusSelection(row: number, column: number): void {
        if (row !== this.selectedRow || column !== this.selectedColumn) {
            let columnCount = this.organizer.getColumnCount();
            let rowCount = this.listPanel.getActualCount();
            this.selectedRow = row >= rowCount ? rowCount - 1 : row;
            this.selectedColumn = column >= columnCount ? columnCount - 1 : column;
            this.clearSelection();
            this.enterSelection();
        }
    }

    public enterSelection(): void {
        this.editingMode = false;
        this.authoredPanel = null;
        this.refreshSelection();
    }

    public refreshSelection(): void {
        this.clearSelection();
        if (this.revealIndication() === true) {
            this.updateSelection();
        }
    }

    public isMaxRowFlag(): boolean {
        return this.maxRowFlag;
    }

    public revampAddColumn(column: number): void {
        if (this.selectedColumn >= column) {
            let columnCount = this.organizer.getColumnCount();
            if (this.selectedColumn < columnCount - 1) {
                this.selectedColumn += 1;
            }
        }
    }

    public revampRemoveColumn(column: number): void {
        if (this.selectedColumn >= column) {
            if (this.selectedColumn > 0) {
                this.selectedColumn -= 1;
            }
        }
    }

    public setOnRowExpand(callback: () => boolean): void {
        this.onRowExpand = callback;
    }

}