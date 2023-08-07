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

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

export default class DesignCompositePanel {

    public static HEIGHT = 24;

    private composite: Composite = null;

    public createControl(parent: Composite, index?: number): void {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("vegazoo-design-composite-panel");

        let layout = new GridLayout(1, 0, 0, 0, 10);
        this.composite.setLayout(layout);

    }

    public adjustHeight(): number {
        let part = new GridCompositeAdjuster(this.composite);
        return part.adjustHeight();
    }

    public getControl(): Control {
        return this.composite;
    }

    public addPanel(panel: Panel, index?: number): void {

        panel.createControl(this.composite, index);
        let control = panel.getControl();
        control.setData(panel);

        let layoutData = new GridData(true, DesignCompositePanel.HEIGHT);
        control.setLayoutData(layoutData);
    }

    public movePanel(child: Panel, index?: number): void {
        let control = child.getControl();
        this.composite.moveControl(control, index);
    }

    public removePanel(panel: Panel): void {
        let control = panel.getControl();
        control.dispose();
    }

}
