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

import VisageList from "bekasi/visage/VisageList";

import * as view from "padang/view/view";

import Surface from "padang/view/present/surface/Surface";
import SurfacePanel from "padang/view/present/surface/SurfacePanel";
import SurfaceRegistry from "padang/view/present/surface/SurfaceRegistry";
import StructureSurfacePanel from "padang/view/present/surface/StructureSurfacePanel";

export default class ListSurface extends Surface {

    public getText(list: VisageList): string {
        let elements = list.size();
        return "List " + elements + " elements";
    }

    public createPanel(conductor: Conductor, root?: boolean): SurfacePanel {
        if (root === true || root === undefined) {
            return new ListSurfacePanel(conductor);
        } else {
            return new StructureSurfacePanel(conductor, this);
        }
    }

}

class ListSurfacePanel extends SurfacePanel {

    private tableViewer: TableViewer = null;
    private labelProvider: ListSurfaceLabelProvider = null;
    private contentProvider: ListSurfaceContentProvider = null;

    public createControl(parent: Composite, index: number): void {
        let style = <TableViewerStyle>{
            marker: true,
            headerVisible: true
        }
        this.labelProvider = new ListSurfaceLabelProvider();
        this.contentProvider = new ListSurfaceContentProvider();
        this.tableViewer = new TableViewer(parent, style);
        this.tableViewer.setLabelProvider(this.labelProvider);
        this.tableViewer.setContentProvider(this.contentProvider);
        view.addClass(this.tableViewer, "padang-list-surface-panel");
    }

    public setValue(value: any): void {
        this.tableViewer.setInput(value);
    }

    public getControl(): Control {
        return this.tableViewer;
    }

}

class ListSurfaceLabelProvider implements TableLabelProvider {

    public getColumnCount(input: VisageList): number {
        return 1;
    }

    public getColumnTitle(input: any, columnIndex: number): string {
        return "Element";
    }

    public getColumnText(element: any, columnIndex: number): string {
        let registry = SurfaceRegistry.getInstance();
        return registry.getText(element);
    }

}

class ListSurfaceContentProvider implements ContentProvider {

    public getElementCount(input: VisageList): number {
        return input.size();
    }

    public getElement(input: VisageList, index: number): any {
        return input.get(index);
    }

}

let factory = SurfaceRegistry.getInstance();
factory.register(VisageList.LEAN_NAME, new ListSurface());
