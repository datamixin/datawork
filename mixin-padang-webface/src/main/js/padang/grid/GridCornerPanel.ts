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
import Panel from "webface/wef/Panel";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import * as view from "padang/view/view";

import * as grid from "padang/grid/grid";
import GridControlStyle from "padang/grid/GridControlStyle";
import GridLabelExtender from "padang/grid/GridLabelExtender";

export default class GridCornerPanel {

    private style: GridControlStyle = null;
    private composite: Composite = null;
    private extender: GridLabelExtender = null;
    private sidePanel: Panel = null;

    constructor(style: GridControlStyle) {
        this.style = style;
    }

    public createControl(parent: Composite): void {

        this.composite = new Composite(parent);

        let element = this.composite.getElement();
        element.addClass("padang-grid-corner-panel");
        element.css("background-color", grid.SHADED_COLOR);
        if (this.style.markerVisible) {
            element.css("border-right", "1px solid " + grid.BORDER_COLOR);
        }
        if (this.style.headerVisible) {
            element.css("border-bottom", "1px solid " + grid.BORDER_COLOR);
        }
        element.css("z-index", "3");

        view.setGridLayout(this.composite);
    }

    public setExtender(extender: GridLabelExtender): void {
        this.extender = extender;
        if (this.extender.getCornerSidePanel !== undefined) {
            this.sidePanel = this.extender.getCornerSidePanel();
            this.sidePanel.createControl(this.composite);
            view.setGridData(this.sidePanel, true, true);
        }
    }

    public getControl(): Control {
        return this.composite;
    }

}