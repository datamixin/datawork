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

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import ToolboxToolPanel from "padang/view/toolbox/ToolboxToolPanel";
import ToolboxGroupPanel from "padang/view/toolbox/ToolboxGroupPanel";

export default class ToolboxToolbarPanel extends ToolboxToolPanel {

    private composite: Composite = null;

    public createControl(parent: Composite, index?: number): void {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("padang-toolbox-toolbar-panel");
        element.css("background-color", "#F8F8F8");

        let layout = new GridLayout(1, 5, 0, 10, 0);
        this.composite.setLayout(layout);
    }

    public getControl(): Control {
        return this.composite;
    }

    public reset(): void {
        let children = this.composite.getChildren();
        for (let child of children) {
            child.dispose();
        }
        this.composite.relayout();
    }

    public getGroup(group: string): ToolboxGroupPanel {
        let children = this.composite.getChildren();
        for (let child of children) {
            let panel = child.getData();
            if (panel instanceof ToolboxGroupPanel) {
                if (panel.getText() === group) {
                    return panel;
                }
            }
        }
        return null;
    }

    public adjustWidth(): number {
        let part = new GridCompositeAdjuster(this.composite);
        return part.adjustWidth();
    }

    public addPanel(panel: ToolboxToolPanel): void {

        panel.createControl(this.composite);
        let control = panel.getControl();
        control.setData(panel);

        let layoutData = new GridData(0, true);
        control.setLayoutData(layoutData);

        let children = this.composite.getChildren();
        let layout = <GridLayout>this.composite.getLayout();
        layout.numColumns = children.length;

    }

}