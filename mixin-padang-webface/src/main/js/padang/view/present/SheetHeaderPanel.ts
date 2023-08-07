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

import ConductorPanel from "webface/wef/ConductorPanel";

import * as view from "padang/view/view";
import LabelPanel from "padang/view/LabelPanel";

import * as present from "padang/view/present/present";

export default class SheetHeaderPanel extends ConductorPanel {

    private composite: Composite = null;
    private labelPanel = new LabelPanel();

    public createControl(parent: Composite, index?: number) {

        this.composite = new Composite(parent, index);

        view.addClass(this.composite, "padang-sheet-header-panel");
        view.setGridLayout(this.composite, 1, 10, 0);

        this.createLabelPanel(this.composite);
    }

    private createLabelPanel(parent: Composite): void {

        this.labelPanel.createControl(parent);

        view.css(this.labelPanel, "line-height", present.ITEM_HEIGHT + "px");
        view.setGridData(this.labelPanel, true, true);
    }

    public setLabel(text: string): void {
        this.labelPanel.setText(text);
    }

    public getControl(): Control {
        return this.composite;
    }

}
