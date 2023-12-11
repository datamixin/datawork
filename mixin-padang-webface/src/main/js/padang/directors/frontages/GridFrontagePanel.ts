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
import Conductor from "webface/wef/Conductor";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import * as view from "padang/view/view";

import * as grid from "padang/grid/grid";
import GridControl from "padang/grid/GridControl";
import GridControlStyle from "padang/grid/GridControlStyle";
import GridLabelExtender from "padang/grid/GridLabelExtender";
import GridContentProvider from "padang/grid/GridContentProvider";

import FrontagePanel from "padang/view/present/FrontagePanel";
import OutcomeFooterPanel from "padang/view/present/OutcomeFooterPanel";

import TableEventAdapter from "padang/directors/frontages/TableEventAdapter";
import DefaultColumnProperties from "padang/view/DefaultColumnProperties";

export abstract class GridFrontagePanel extends FrontagePanel {

    public static WIDTH = "selection";
    public static SELECTION = "selection";
    public static PART = "part";
    public static ROW = "row";
    public static CELL = "cell";
    public static LABEL = "label";
    public static COLUMN = "column";

    public static FOOTER_HEIGHT = 26;

    private style: GridControlStyle = null;
    private provider: GridContentProvider = null;
    private extender: GridLabelExtender = null;
    private composite: Composite = null;
    private control: GridControl = null;
    private footerPanel: OutcomeFooterPanel = null;;

    constructor(conductor: Conductor, style: GridControlStyle,
        provider: GridContentProvider, extender: GridLabelExtender) {
        super(conductor);
        this.style = style;
        this.provider = provider;
        this.extender = extender;
        this.footerPanel = new OutcomeFooterPanel(conductor);
    }

    public createControl(parent: Composite): void {

        this.composite = new Composite(parent);

        let element = this.composite.getElement();
        element.addClass("padang-table-frontage");

        view.setGridLayout(this.composite, 1, 0, 0, 0, 0);

        this.createGridControl(this.composite);
        this.createFooterPanel(this.composite);
        this.refreshContent();
    }

    private createGridControl(parent: Composite, index?: number): void {

        this.control = new GridControl(parent, this.style);
        view.setGridData(this.control, true, true);

        this.control.setExtender(this.extender);

        this.control.setProvider(this.provider);
        this.control.setAdapter(new TableEventAdapter(this.conductor));
    }

    protected getStyle(): GridControlStyle {
        let style = <GridControlStyle>{};
        return style;
    }

    private createFooterPanel(parent: Composite): void {
        this.footerPanel.createControl(parent);
        view.css(this.footerPanel, "border-top", "1px solid " + grid.BORDER_COLOR);
        view.css(this.footerPanel, "line-height", GridFrontagePanel.FOOTER_HEIGHT + "px");
        view.setGridData(this.footerPanel, true, GridFrontagePanel.FOOTER_HEIGHT);
    }

    private refreshContent(): void {
        this.control.refresh(() => {
            let footer = this.generateFooter();
            this.footerPanel.setText(footer);
        });
    }

    protected abstract generateFooter(): string;

    public setProperty(keys: string[], value: any): void {
        if (keys.length === 1) {

            let key = keys[0];
            if (key === GridFrontagePanel.SELECTION) {

                let part = value[GridFrontagePanel.PART];
                if (part === GridFrontagePanel.ROW) {

                    let row = <number>value[GridFrontagePanel.ROW];
                    this.control.setSelectedRow(row);

                } else if (part === GridFrontagePanel.COLUMN) {

                    let column = <number>value[GridFrontagePanel.COLUMN];
                    this.control.setSelectedColumn(column);

                } else if (part === GridFrontagePanel.CELL) {

                    let row = <number>value[GridFrontagePanel.ROW];
                    let column = <number>value[GridFrontagePanel.COLUMN];
                    this.control.setSelectedCell(row, column);

                }
            }

        } else if (keys.length === 2) {
            let column = keys[0];
            let property = keys[1];
            let properties = <DefaultColumnProperties>this.extender.getColumnProperties();
            properties.applyProperty(column, property, value);
        }
    }

    public getControl(): Control {
        return this.composite;
    }

}

export default GridFrontagePanel;