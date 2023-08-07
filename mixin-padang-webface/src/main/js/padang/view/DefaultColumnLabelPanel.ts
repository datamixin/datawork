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
import ConductorPanel from "webface/wef/ConductorPanel";

import * as view from "padang/view/view";
import DefaultColumnLabel from "padang/view/DefaultColumnLabel";
import DefaultColumnTitlePanel from "padang/view/DefaultColumnTitlePanel";

import GridControlStyle from "padang/grid/GridControlStyle";
import GridColumnLabelPanel from "padang/grid/GridColumnLabelPanel";

export default class DefaultColumnLabelPanel extends ConductorPanel implements GridColumnLabelPanel {

    private composite: Composite = null;
    private titlePanel: GridColumnLabelPanel = null;
    private contentPanel: GridColumnLabelPanel = null;
    private selected: boolean = false;

    constructor(conductor: Conductor, titlePanel?: GridColumnLabelPanel, contentPanel?: GridColumnLabelPanel) {
        super(conductor);
        this.titlePanel = titlePanel === undefined ? new DefaultColumnTitlePanel(conductor) : titlePanel;
        if (contentPanel !== undefined) this.contentPanel = contentPanel;
    }

    public createControl(parent: Composite, index?: number) {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("padang-default-column-label-panel");

        view.setGridLayout(this.composite, 1, 0, 0, 0, 0);
        this.createTitlePanel(this.composite);
        this.createContentPanel(this.composite);
    }

    private createTitlePanel(parent: Composite): void {
        this.titlePanel.createControl(parent);
        view.setGridData(this.titlePanel, true, GridControlStyle.HEADER_HEIGHT);
    }

    private createContentPanel(parent: Composite): void {
        if (this.contentPanel !== null) {
            this.contentPanel.createControl(parent);
            view.setGridData(this.contentPanel, true, true);
        }
    }

    public setLabel(label: DefaultColumnLabel): void {
        this.titlePanel.setLabel(label);
        if (this.contentPanel !== null) {
            this.contentPanel.setLabel(label);
        }
    }

    public setProperty(name: string, value: any): void {
        this.titlePanel.setProperty(name, value);
        if (this.contentPanel !== null) this.contentPanel.setProperty(name, value);
    }

    public setSelected(selected: boolean): void {
        this.selected = selected;
        view.setSelected(this.composite, this.selected);
    }

    public adjustWidth(): number {
        return GridControlStyle.MIN_COLUMN_WIDTH;
    }

    public getControl(): Control {
        return this.composite;
    }

}
