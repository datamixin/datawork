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

import * as view from "padang/view/view";

import * as grid from "padang/grid/grid";
import GridColumnPart from "padang/grid/GridColumnPart";
import GridColumnLabel from "padang/grid/GridColumnLabel";
import GridControlStyle from "padang/grid/GridControlStyle";
import GridLabelExtender from "padang/grid/GridLabelExtender";
import GridColumnLabelPanel from "padang/grid/GridColumnLabelPanel";
import GridDefaultColumnLabelPanel from "padang/grid/GridDefaultColumnLabelPanel";

export default class GridColumnPanel implements GridColumnPart {

    private style: GridControlStyle = null;
    private label: GridColumnLabel = null;
    private width = GridControlStyle.DEFAULT_COLUMN_WIDTH;
    private composite: Composite = null;
    private extender: GridLabelExtender = null;
    private labelPanel: GridColumnLabelPanel = null;
    private selected: boolean = false;
    private onSelection = (control: Control) => { };

    constructor(style: GridControlStyle, label: any, extender: GridLabelExtender) {
        this.style = style;
        this.label = label;
        this.extender = extender;
    }

    public getLabel(): GridColumnLabel {
        return this.label;
    }

    public createControl(parent: Composite, index?: number) {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("padang-grid-column-present-panel");
        element.css("border-right", "1px solid " + grid.BORDER_COLOR);

        this.composite.onSelection(() => {
            if (this.selected === false) {
                this.onSelection(this.composite);
            }
        });

        view.setGridLayout(this.composite, 1, 0, 0, 0, 0);
        this.createLabelPanel(this.composite);
    }

    public createLabelPanel(parent: Composite): void {

        if (this.extender.getColumnLabelPanel !== undefined) {
            this.labelPanel = this.extender.getColumnLabelPanel();
        } else {
            this.labelPanel = new GridDefaultColumnLabelPanel();
        }
        this.labelPanel.createControl(parent);
        this.labelPanel.setLabel(this.label);

        view.css(this.labelPanel, "line-height", this.style.headerHeight + "px");
        view.setGridData(this.labelPanel, true, true);
    }

    public setSelected(selected: boolean): void {
        this.selected = selected;
        view.setSelected(this.composite, this.selected);
    }

    public setOnSelection(callback: (control: Control) => void): void {
        this.onSelection = callback;
    }

    public setWidth(width: number): void {
        if (width !== undefined && width !== null) {
            this.width = width;
        }
    }

    public setProperty(name: string, value: any): void {
        if (this.labelPanel !== null) {
            this.labelPanel.setProperty(name, value);
        }
    }

    public adjustWidth(): number {
        return this.width;
    }

    public getControl(): Control {
        return this.composite;
    }

}

