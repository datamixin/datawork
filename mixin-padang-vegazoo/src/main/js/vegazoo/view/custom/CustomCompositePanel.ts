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
import Panel from "webface/wef/Panel";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import CustomAbstractPanel from "vegazoo/view/custom/CustomAbstractPanel";

export default class CustomCompositePanel extends CustomAbstractPanel {

    private composite: Composite = null;

    public createControl(parent: Composite, index?: number): void {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("vegazoo-custom-composite-panel");

        let layout = new GridLayout(1, 0, 0, 0, 5);
        this.composite.setLayout(layout);

    }

    public adjustHeight(): number {
        let part = new GridCompositeAdjuster(this.composite);
        let height = part.adjustHeight();
        return height;
    }

    public getControl(): Control {
        return this.composite;
    }

    public addPanel(panel: Panel, index?: number): void {

        panel.createControl(this.composite, index);
        let control = panel.getControl();
        control.setData(panel);

        let layoutData = new GridData(true, CustomCompositePanel.HEIGHT);
        control.setLayoutData(layoutData);
    }

    public removePanel(panel: Panel): void {
        let control = panel.getControl();
        control.dispose();
    }

}
