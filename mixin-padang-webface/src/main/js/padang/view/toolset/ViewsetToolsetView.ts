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

import ConductorView from "webface/wef/ConductorView";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import * as view from "padang/view/view";

import CellAddRequest from "padang/requests/toolset/CellAddRequest";

import GroupToolbarPanel from "padang/view/toolbox/GroupToolbarPanel";

export default class ViewsetToolsetView extends ConductorView {

    private composite: Composite = null;
    private toolbarPanel: GroupToolbarPanel = null;

    public createControl(parent: Composite, index: number): void {

        this.composite = new Composite(parent, index);
        view.addClass(this.composite, "padang-viewset-toolset-view");
        view.setGridLayout(this.composite, 3, 0, 0);

        this.createToolbarPanel(this.composite);
    }

    protected createToolbarPanel(parent: Composite): void {
        this.toolbarPanel = new GroupToolbarPanel(this.conductor, "Viewset");
        this.toolbarPanel.createControl(parent);
        view.setGridData(this.toolbarPanel, 0, true);
        this.createViewsetCellIcon(this.toolbarPanel);
    }

    private createViewsetCellIcon(parent: GroupToolbarPanel): void {
        parent.createIcon("mdi-shape-square-plus", "Add Cell", () => {
            let request = new CellAddRequest();
            this.conductor.submit(request);
        });
    }

    public adjustWidth(): number {
        let part = new GridCompositeAdjuster(this.composite);
        return part.adjustWidth();
    }

    public getControl(): Control {
        return this.composite;
    }

}
