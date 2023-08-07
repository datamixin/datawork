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

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import ConductorView from "webface/wef/ConductorView";

import DesignHeaderPanel from "vegazoo/view/design/DesignHeaderPanel";

export default class ConfigDesignView extends ConductorView {

    private composite: Composite = null;
    private headerPanel: DesignHeaderPanel = null;

    public createControl(parent: Composite, index: number): void {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("vegazoo-config-design-view");

        let layout = new GridLayout(1, 0, 0, 0, 0);
        this.composite.setLayout(layout);

        this.createHeaderPanel(this.composite);
    }

    private createHeaderPanel(parent: Composite): void {

        this.headerPanel = new DesignHeaderPanel(this.conductor);
        this.headerPanel.createControl(parent, 0);
        this.headerPanel.setText("Config");

        let control = this.headerPanel.getControl();
        let layoutData = new GridData(true, DesignHeaderPanel.HEIGHT);
        control.setLayoutData(layoutData);

    }

    public getControl(): Control {
        return this.composite;
    }

}
