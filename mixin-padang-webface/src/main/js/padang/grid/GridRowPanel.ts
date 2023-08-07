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

import AbsoluteData from "webface/layout/AbsoluteData";

import * as view from "padang/view/view";

import * as grid from "padang/grid/grid";
import GridCellPanel from "padang/grid/GridCellPanel";
import GridElementPanel from "padang/grid/GridElementPanel";
import GridControlStyle from "padang/grid/GridControlStyle";
import GridLabelExtender from "padang/grid/GridLabelExtender";
import GridColumnOrganizer from "padang/grid/GridColumnOrganizer";

export default class GridRowPanel extends GridElementPanel {

    private composite: Composite = null;
    private onCellSelection = (control: Control, index: number) => { };
    private onCellEditing = (control: Control, index: number) => { };
    private onCellCommit = () => { };

    public createControl(parent: Composite, index?: number) {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("padang-grid-row-panel");
        element.css("border-bottom", "1px solid " + grid.BORDER_COLOR);

        view.setAbsoluteLayout(this.composite);

    }

    public addCell(style: GridControlStyle, extender: GridLabelExtender,
        organizer: GridColumnOrganizer, layoutData: AbsoluteData, index: number): void {

        let panel = new GridCellPanel(style, extender);
        panel.createControl(this.composite, index);

        panel.setOnSelection((control: Control) => {
            let index = this.getIndexOf(control);
            this.onCellSelection(this.composite, index);
        });

        panel.setOnPreEdit((control: Control) => {
            let index = this.getIndexOf(control);
            this.onCellEditing(this.composite, index);
        });

        panel.setOnPostCommit(() => {
            this.onCellCommit();
        });

        organizer.loadProperty(index, (name: string, value: any) => {
            panel.setProperty(name, value);
        });

        view.setAbsoluteData(panel, layoutData.left, 0, layoutData.width, style.rowHeight);
    }

    private getIndexOf(control: Control): number {
        let children = this.composite.getChildren();
        let index = children.indexOf(control);
        return index;
    }

    private getControlAt(index: number): Control {
        let children = this.composite.getChildren();
        return children[index] || null;
    }

    public removeCell(index: number): void {
        let control = this.getControlAt(index);
        control.dispose();
    }

    public setValues(position: number, values: any[]): void {
        for (let i = 0; i < values.length; i++) {
            let control = this.getControlAt(i);
            let panel = <GridCellPanel>control.getData();
            panel.setValue(position, i, values[i]);
        }
    }

    public getPanelAt(index: number): GridCellPanel {
        let control = this.getControlAt(index);
        if (control !== null) {
            let panel = <GridCellPanel>control.getData();
            return panel;
        } else {
            return null;
        }
    }

    public setCellSelection(callback: (control: Control, index: number) => void) {
        this.onCellSelection = callback;
    }

    public setCellEditing(callback: (control: Control, index: number) => void) {
        this.onCellEditing = callback;
    }

    public setCellCommit(callback: () => void) {
        this.onCellCommit = callback;
    }

    public setProperty(index: number, name: string, value: any): void {
        let panel = this.getPanelAt(index);
        panel.setProperty(name, value);
    }

    public adjustCells(list: AbsoluteData[]): void {
        let children = this.composite.getChildren();
        for (let i = 0; i < children.length; i++) {
            let control = children[i];
            let columnData = list[i];
            let cellData = view.getAbsoluteData(control);
            cellData.left = columnData.left;
            cellData.width = columnData.width;
        }
        this.composite.relayout();
    }

    public resetValues(): void {
        let children = this.composite.getChildren();
        for (let child of children) {
            let panel = <GridCellPanel>child.getData();
            panel.delayValue();
        }
    }

    public relayout(): void {
        this.composite.relayout();
    }

    public getControl(): Control {
        return this.composite;
    }

}
