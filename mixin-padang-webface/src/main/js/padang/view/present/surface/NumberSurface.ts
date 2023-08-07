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

import Conductor from "webface/wef/Conductor";

import VisageNumber from "bekasi/visage/VisageNumber";

import * as view from "padang/view/view";
import LabelPanel from "padang/view/LabelPanel";

import SurfacePanel from "padang/view/present/surface/SurfacePanel";
import SurfaceRegistry from "padang/view/present/surface/SurfaceRegistry";
import ConstantSurface from "padang/view/present/surface/ConstantSurface";

export default class NumberSurface extends ConstantSurface {

    public getText(value: VisageNumber): string {
        return value.toFormatted();
    }

    public createPanel(conductor: Conductor): SurfacePanel {
        return new NumberSurfacePanel(conductor);
    }

}

export class NumberSurfacePanel extends SurfacePanel {

    private source: VisageNumber = null;
    private labelPanel = new LabelPanel(5);

    public createControl(parent: Composite, index: number): void {
        this.labelPanel.createControl(parent, index);
        view.css(this.labelPanel, "padding-right", "6px");
        view.css(this.labelPanel, "text-align", "right");
        view.addClass(this.labelPanel, "padang-number-surface-panel");
    }

    public setValue(source: VisageNumber): void {
        this.source = source;
        let value = source.getValue();
        let subtype = source.getSubtype();
        let text = VisageNumber.getFormatted(value, subtype);
        this.labelPanel.setText(text);
    }

    public applyFormat(format: string): void {
        let value = this.source.getValue();
        let subtype = this.source.getSubtype();
        let text = VisageNumber.getFormatted(value, subtype, format === null ? undefined : format);
        this.labelPanel.setText(text);
    }

    public getControl(): Control {
        return this.labelPanel.getControl();
    }

}

let factory = SurfaceRegistry.getInstance();
factory.register(VisageNumber.LEAN_NAME, new NumberSurface());
