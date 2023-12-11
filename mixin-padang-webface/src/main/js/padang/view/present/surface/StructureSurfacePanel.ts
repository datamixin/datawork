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

import * as view from "padang/view/view";
import LabelPanel from "padang/view/LabelPanel";

import Surface from "padang/view/present/surface/Surface";
import SurfacePanel from "padang/view/present/surface/SurfacePanel";

export default class StructureSurfacePanel extends SurfacePanel {

    private surface: Surface = null;
    private labelPanel = new LabelPanel(5);

    constructor(conductor: Conductor, surface: Surface) {
        super(conductor);
        this.surface = surface;
    }

    public createControl(parent: Composite, index: number): void {
        this.labelPanel.createControl(parent, index);
        view.css(this.labelPanel, "color", "#888");
        view.css(this.labelPanel, "font-style", "italic");
        view.addClass(this.labelPanel, "padang-structure-surface-panel");
    }

    public setValue(value: VisageValue): void {
        let text = this.surface.getText(value);
        this.labelPanel.setText(text);
    }

    public getControl(): Control {
        return this.labelPanel.getControl();
    }

}