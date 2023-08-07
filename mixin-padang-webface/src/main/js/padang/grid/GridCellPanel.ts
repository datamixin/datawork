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
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import WidthAdjustablePart from "webface/wef/WidthAdjustablePart";

import * as view from "padang/view/view";

import * as grid from "padang/grid/grid";
import GridValuePanel from "padang/grid/GridValuePanel";
import GridControlStyle from "padang/grid/GridControlStyle";
import GridLabelExtender from "padang/grid/GridLabelExtender";

export default class GridCellPanel implements WidthAdjustablePart {

    private style: GridControlStyle = null;
    private extender: GridLabelExtender = null;
    private composite: Composite = null;
    private selected: boolean = false;
    private valuePanel: GridValuePanel = null;
    private onSelection = (control: Control) => { };
    private onPreEdit = (control: Control) => { };
    private onPostCommit = () => { };

    constructor(style: GridControlStyle, extender: GridLabelExtender) {
        this.style = style;
        this.extender = extender;
    }

    public createControl(parent: Composite, index?: number) {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("padang-grid-cell-panel");
        element.css("border-right", "1px solid " + grid.BORDER_COLOR);
        element.css("line-height", (this.style.rowHeight) + "px");

        this.composite.onSelection(() => {
            if (this.selected === false) {
                this.onSelection(this.composite);
            }
        });

        view.setGridLayout(this.composite, 1, 0, 0, 0, 0);
        this.createLabelPanel(this.composite);
    }

    public createLabelPanel(parent: Composite): void {

        if (this.extender.getCellValuePanel !== undefined) {
            this.valuePanel = this.extender.getCellValuePanel();
        } else {
            this.valuePanel = new GridDefaultValuePanel();
        }
        this.valuePanel.createControl(parent);

        if (this.valuePanel.setOnPreEdit !== undefined) {
            this.valuePanel.setOnPreEdit(() => {
                this.onPreEdit(this.composite);
            });
        }

        if (this.valuePanel.setOnPostCommit) {
            this.valuePanel.setOnPostCommit(() => {
                this.onPostCommit();
            });
        }

        view.setGridData(this.valuePanel, true, true);
    }

    public setValue(rowPos: any, columnPos: number, value?: any): void {
        this.valuePanel.setValue(rowPos, columnPos, value);
    }

    public setOnSelection(callback: (control: Control) => void): void {
        this.onSelection = callback;
    }

    public setOnPreEdit(callback: (control: Control) => void): void {
        this.onPreEdit = callback;
    }

    public setOnPostCommit(callback: () => void): void {
        this.onPostCommit = callback;
    }

    public setSelected(selected: boolean): void {
        this.selected = selected;
        if (this.valuePanel.setSelected) {
            this.valuePanel.setSelected(selected);
        }
    }

    public setProperty(name: string, value: any): void {
        if (this.valuePanel.setProperty) {
            this.valuePanel.setProperty(name, value);
        }
    }

    public enterEditStart(): void {
        if (this.valuePanel.setEditMode) {
            this.valuePanel.setEditMode(true, 0);
        }
    }

    public enterEdit(value?: string): void {
        if (this.valuePanel.setEditMode) {
            this.valuePanel.setEditMode(true, true, value);
        }
    }

    public commitEdit(): void {
        if (this.valuePanel.commit) {
            this.valuePanel.commit();
        }
    }

    public delayValue(): void {
        this.valuePanel.delayValue();
    }

    public adjustWidth(): number {
        return GridControlStyle.MIN_COLUMN_WIDTH;
    }

    public getControl(): Control {
        return this.composite;
    }

}

class GridDefaultValuePanel implements GridValuePanel {

    private label: Label = null;

    public createControl(parent: Composite, index?: number): void {

        this.label = new Label(parent);

        let element = this.label.getElement();
        element.addClass("padang-grid-default-value-panel");
        element.css("line-height", "inhirent");
    }

    public setValue(value: any): void {
        this.label.setText(value);
    }

    public delayValue(): void {

    }

    public getControl(): Control {
        return this.label;
    }

}