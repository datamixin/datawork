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

import Conductor from "webface/wef/Conductor";

import TableViewer from "webface/viewers/TableViewer";
import ContentProvider from "webface/viewers/ContentProvider";
import TableViewerStyle from "webface/viewers/TableViewerStyle";
import TableLabelProvider from "webface/viewers/TableLabelProvider";

import VisageObject from "bekasi/visage/VisageObject";

import * as view from "padang/view/view";

import Surface from "padang/view/present/surface/Surface";
import SurfacePanel from "padang/view/present/surface/SurfacePanel";
import SurfaceRegistry from "padang/view/present/surface/SurfaceRegistry";
import StructureSurfacePanel from "padang/view/present/surface/StructureSurfacePanel";

export default class ObjectSurface extends Surface {

    public getText(list: VisageObject): string {
        let fieldsNames = list.fieldNames();
        return "Object " + fieldsNames.length + " fields";
    }

    public createPanel(conductor: Conductor, root?: boolean): SurfacePanel {
        if (root === true || root === undefined) {
            return new ObjectSurfacePanel(conductor);
        } else {
            return new StructureSurfacePanel(conductor, this);
        }
    }

}

class ObjectSurfacePanel extends SurfacePanel {

    private tableViewer: TableViewer = null;
    private labelProvider: ObjectSurfaceLabelProvider = null;
    private contentProvider: ObjectSurfaceContentProvider = null;

    public createControl(parent: Composite, index: number): void {
        let style = <TableViewerStyle>{
            marker: true,
            headerVisible: true
        }
        this.labelProvider = new ObjectSurfaceLabelProvider();
        this.contentProvider = new ObjectSurfaceContentProvider();
        this.tableViewer = new TableViewer(parent, style);
        this.tableViewer.setLabelProvider(this.labelProvider);
        this.tableViewer.setContentProvider(this.contentProvider);
        view.addClass(this.tableViewer, "padang-object-surface-panel");
    }

    public setValue(value: any): void {
        this.tableViewer.setInput(value);
    }

    public getControl(): Control {
        return this.tableViewer;
    }

}

class ObjectSurfaceLabelProvider implements TableLabelProvider {

    public getColumnCount(input: VisageObject): number {
        return 2;
    }

    public getColumnTitle(input: any, columnIndex: number): string {
        return columnIndex === 0 ? "Field" : "Value";
    }

    public getColumnText(nameValue: any[], columnIndex: number): string {
        let value = nameValue[columnIndex];
        let registry = SurfaceRegistry.getInstance();
        return registry.getText(value);
    }

}

class ObjectSurfaceContentProvider implements ContentProvider {

    public getElementCount(input: VisageObject): number {
        let fieldNames = input.fieldNames();
        return fieldNames.length;
    }

    public getElement(input: VisageObject, index: number): any {
        let names = input.fieldNames();
        let name = names[index];
        let value = input.getField(name);
        return [name, value];
    }

}

let factory = SurfaceRegistry.getInstance();
factory.register(VisageObject.LEAN_NAME, new ObjectSurface());
