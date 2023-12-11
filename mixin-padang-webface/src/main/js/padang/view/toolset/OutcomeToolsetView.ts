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

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import * as view from "padang/view/view";

import ToolboxAction from "padang/view/toolbox/ToolboxAction";
import GroupToolbarPanel from "padang/view/toolbox/GroupToolbarPanel";

import FacetToolsetView from "padang/view/toolset/FacetToolsetView";

export default class OutcomeToolsetView extends FacetToolsetView {

    private composite: Composite = null;
    private toolbarPanel: GroupToolbarPanel = null;

    public createControl(parent: Composite, index: number): void {

        this.composite = new Composite(parent, index);
        view.addClass(this.composite, "padang-outcome-toolset-view");
        view.setGridLayout(this.composite, 1, 0, 0);

        this.createToolbarPanel(this.composite);

    }

    private createToolbarPanel(parent: Composite): void {
        this.toolbarPanel = new GroupToolbarPanel(this.conductor, "Outcome");
        this.toolbarPanel.createControl(parent);
        view.setGridData(this.toolbarPanel, 0, true);
    }

    public setActions(actions: ToolboxAction[]): void {
        view.setVisible(this.toolbarPanel, actions.length > 0);
        this.toolbarPanel.clearIcons();
        for (let action of actions) {
            let image = action.getImage();
            let title = action.getTooltip();
            this.toolbarPanel.createIcon(image, title, () => {
                action.run();
            });
        }
    }

    public adjustWidth(): number {
        let part = new GridCompositeAdjuster(this.composite);
        return part.adjustWidth();
    }

    public getControl(): Control {
        return this.composite;
    }

}
