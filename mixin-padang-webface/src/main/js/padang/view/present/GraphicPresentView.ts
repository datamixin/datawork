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

import ConductorView from "webface/wef/ConductorView";

import * as view from "padang/view/view";

export default class GraphicPresentView extends ConductorView {

    private composite: Composite = null;
    private rendererPanel: Panel = null;

    public createControl(parent: Composite, index: number): void {

        this.composite = new Composite(parent, index);

        let element = this.composite.getElement();
        element.addClass("padang-graphic-present-view");
        element.css("border", "1px solid #E0E0E0");
        element.css("border-radius", "4px");
        element.css("background", "#FFF");

        view.setGridLayout(this.composite, 1, 0, 0, 0, 0);

    }

    public setRendererPanel(panel: Panel): void {

        if (this.rendererPanel !== null) {
            let control = this.rendererPanel.getControl();
            control.dispose();
        }

        panel.createControl(this.composite);
        let control = panel.getControl();

        view.setGridData(control, true, true);

        this.rendererPanel = panel;
        this.composite.relayout();

    }

    public relayout(): void {
        this.composite.relayout();
    }

    public getControl(): Control {
        return this.composite;
    }

}
