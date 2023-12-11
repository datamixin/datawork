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

import Conductor from "webface/wef/Conductor";

import TableViewer from "webface/viewers/TableViewer";
import ContentProvider from "webface/viewers/ContentProvider";
import TableViewerStyle from "webface/viewers/TableViewerStyle";
import TableLabelProvider from "webface/viewers/TableLabelProvider";

import VisageTable from "bekasi/visage/VisageTable";
import VisageRecord from "bekasi/visage/VisageRecord";

import * as view from "padang/view/view";

import Surface from "padang/view/present/surface/Surface";
import SurfacePanel from "padang/view/present/surface/SurfacePanel";
import SurfaceRegistry from "padang/view/present/surface/SurfaceRegistry";
import StructureSurfacePanel from "padang/view/present/surface/StructureSurfacePanel";

export default class TableSurface extends Surface {

    public getText(table: VisageTable): string {
        let recordCount = table.recordCount();
        let columns = table.getColumns();
        return "Table " + columns.length + " columns " + recordCount + " rows";
    }

    public createPanel(conductor: Conductor, root?: boolean): SurfacePanel {
        if (root === true || root === undefined) {
            return new TableSurfacePanel(conductor);
        } else {
            return new StructureSurfacePanel(conductor, this);
        }
    }

}

class TableSurfacePanel extends SurfacePanel {

    private tableViewer: TableViewer = null;
    private labelProvider: TableSurfaceLabelProvider = null;
    private contentProvider: TableSurfaceContentProvider = null;

    public createControl(parent: Composite, index: number): void {
        let style = <TableViewerStyle>{
            marker: true,
            headerVisible: true
        }
        this.labelProvider = new TableSurfaceLabelProvider();
        this.contentProvider = new TableSurfaceContentProvider();
        this.tableViewer = new TableViewer(parent, style);
        this.tableViewer.setLabelProvider(this.labelProvider);
        this.tableViewer.setContentProvider(this.contentProvider);
        view.addClass(this.tableViewer, "padang-table-surface-panel");
    }

    public setValue(value: any): void {
        this.tableViewer.setInput(value);
    }

    public getControl(): Control {
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

let factory = SurfaceRegistry.getInstance();
factory.register(VisageTable.LEAN_NAME, new TableSurface());
