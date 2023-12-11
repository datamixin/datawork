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

import Conductor from "webface/wef/Conductor";

import VisageNull from "bekasi/visage/VisageNull";

import * as view from "padang/view/view";
import LabelPanel from "padang/view/LabelPanel";

import Surface from "padang/view/present/surface/Surface";
import SurfacePanel from "padang/view/present/surface/SurfacePanel";
import SurfaceRegistry from "padang/view/present/surface/SurfaceRegistry";

export default class NullSurface extends Surface {

    public getText(value: VisageNull): string {
        return value.getValue();
    }

    public createPanel(conductor: Conductor): SurfacePanel {
        return new NullSurfacePanel(conductor);
    }

}

class NullSurfacePanel extends SurfacePanel {

    private labelPanel = new LabelPanel(5);

    public createControl(parent: Composite, index: number): void {
        this.labelPanel.createControl(parent, index);
        view.addClass(this.labelPanel, "padang-null-surface-panel");
        view.css(this.labelPanel, "color", "#888");
        view.css(this.labelPanel, "font-style", "italic");
    }

    public setValue(value: any): void {
        this.labelPanel.setText(value);
    }

    public getControl(): Control {
        return this.labelPanel.getControl();
    }

}
let factory = SurfaceRegistry.getInstance();
factory.register(VisageNull.LEAN_NAME, new NullSurface());
