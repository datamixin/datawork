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
import * as functions from "webface/functions";

import Event from "webface/widgets/Event";
import Control from "webface/widgets/Control";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";

import TableViewer from "webface/viewers/TableViewer";
import TableColumnMaker from "webface/viewers/TableColumnMaker";
import TableColumnWidth from "webface/viewers/TableColumnWidth";
import TableViewerStyle from "webface/viewers/TableViewerStyle";
import TableLabelProvider from "webface/viewers/TableLabelProvider";

import WebFontImage from "webface/graphics/WebFontImage";

import ArrayContentProvider from "webface/viewers/ArrayContentProvider";
import SelectionChangedEvent from "webface/viewers/SelectionChangedEvent";
import SelectionChangedListener from "webface/viewers/SelectionChangedListener";

import RunspaceItem from "bekasi/resources/RunspaceItem";

export default class RunspaceFileListPanel {

    private fileViewer: TableViewer = null;
    private selectionCallback = (file: RunspaceItem) => { };
    private doubleClickCallback = (file: RunspaceItem) => { };

    public createControl(parent: Composite): void {

        let style = <TableViewerStyle>{
            fullSelection: true
        };
        this.fileViewer = new TableViewer(parent, style);
        this.fileViewer.setContentProvider(new ArrayContentProvider());
        this.fileViewer.setLabelProvider(new FileLabelProvider());

        this.fileViewer.addSelectionChangedListener(<SelectionChangedListener>{
            selectionChanged: (event: SelectionChangedEvent) => {
                let selection = event.getSelection();
                if (selection.isEmpty() === false) {
                    let element = selection.getFirstElement();
                    let file = <RunspaceItem>element;
                    this.selectionCallback(file);
                }
            }
        });

        this.fileViewer.addItemDoubleClickListener(<Listener>{
            handleEvent: (event: Event) => {
                let file = <RunspaceItem>event.data;
                this.doubleClickCallback(file);
            }
        });

    }

    public setInput(input: any[]): void {
        this.fileViewer.setInput(input);
    }

    public setSelectionCallback(callback: (file: RunspaceItem) => void): void {
        this.selectionCallback = callback;
    }

    public setDoubleClickCallback(callback: (file: RunspaceItem) => void): void {
        this.doubleClickCallback = callback;
    }

    public getControl(): Control {
        return this.fileViewer;
    }

}

class FileLabelProvider implements TableLabelProvider {

    private columns = ["Name", "Type", "Modified"];

    public getColumnCount(input: any): number {
        return this.columns.length;
    }

    public getColumnTitle(input: any, index: number): string {
        return this.columns[index];
    }

    public getColumnText(file: RunspaceItem, index: number): string {
        if (index === 0) {
            let label = file.getNameOnly();
            return label;
        } else if (index === 1) {
            if (file.isDirectory()) {
                return "Folder";
            } else {
                return file.getExtension();
            }
        } else if (index === 2) {
            let modified = file.getModified();
            let formatted = functions.formatDate(modified);
            return formatted;
        }
        return null;
    }

    public getColumnWidth(input: any, columnIndex: number): TableColumnWidth {
        if (columnIndex === 0) {
            return <TableColumnWidth>{
                getWidth: () => {
                    return 160;
                }
            };
        } else if (columnIndex === 1) {
            return <TableColumnWidth>{
                getWidth: () => {
                    return 140;
                }
            };
        }
        return undefined;
    }

    public getColumnMaker?(element: any, columnIndex: number): TableColumnMaker {
        if (columnIndex === 0) {
            return new NameColumnMaker();
        }
        return undefined;
    }

}

class NameColumnMaker implements TableColumnMaker {

    public getStyle(element: any, columnIndex: number): any {
        return {
            "color": "#444",
            "font-style": "normal"
        };
    }

    public getImage(element: RunspaceItem, columnIndex: number): WebFontImage {
        if (element.isDirectory()) {
            return new WebFontImage("mdi", "mdi-folder");
        } else {
            return new WebFontImage("mdi", "mdi-file-outline");
        }
    }

    public getImageColor(element: RunspaceItem, columnIndex: number): string {
        if (element.isDirectory()) {
            return "#ffc774";
        }
        return null;
    }


    public isSelectable(): boolean {
        return false;
    }

}
