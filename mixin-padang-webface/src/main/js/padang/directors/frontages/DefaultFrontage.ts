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

import VisageValue from "bekasi/visage/VisageValue";

import Frontage from "padang/directors/frontages/Frontage";
import FrontagePanel from "padang/view/present/FrontagePanel";

import Surface from "padang/view/present/surface/Surface";
import SurfacePanel from "padang/view/present/surface/SurfacePanel";

export default class DefaultFrontage extends Frontage {

    private surface: Surface = null;

    constructor(surface: Surface) {
        super();
        this.surface = surface;
    }

    public createPresentPanel(conductor: Conductor, value: VisageValue): FrontagePanel {
        let panel = this.surface.createPanel(conductor);
        return new DefaultPanel(conductor, panel, value);
    }

}

export class DefaultPanel extends FrontagePanel {

    private panel: SurfacePanel = null;
    private value: VisageValue = null;

    constructor(conductor: Conductor, panel: SurfacePanel, value: VisageValue) {
        super(conductor);
        this.panel = panel;
        this.value = value;
    }

    public createControl(parent: Composite, index?: number): void {
        this.panel.createControl(parent, index);
        this.panel.setValue(this.value);
    }

    public getControl(): Control {
        return this.panel.getControl();
    }

}