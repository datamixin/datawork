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
import ConductorPanel from "webface/wef/ConductorPanel";

import DefaultCornerPanel from "padang/view/DefaultCornerPanel";
import DefaultColumnTitlePanel from "padang/view/DefaultColumnTitlePanel";

import GridColumnLabelPanel from "padang/grid/GridColumnLabelPanel";
import TabularColumnInspectResetRequest from "padang/requests/TabularColumnInspectResetRequest";

export default class TabularPresentMaker {

    protected conductor: Conductor = null;

    constructor(conductor: Conductor) {
        this.conductor = conductor;
    }

    public createCornerPanel(): ConductorPanel {
        return new DefaultCornerPanel(this.conductor);
    }

    public createTitlePanel(): GridColumnLabelPanel {
        let panel = new DefaultColumnTitlePanel(this.conductor);
        panel.setOnSelection(() => {
            let request = new TabularColumnInspectResetRequest();
            this.conductor.submit(request);
        });
        return panel;
    }

}