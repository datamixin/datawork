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

import XText from "sleman/model/XText";

import * as widgets from "padang/widgets/widgets";

import * as dialogs from "padang/dialogs/dialogs";

import ItemListComboPanel from "padang/dialogs/guide/ItemListComboPanel";

export default class LabelItemListComboPanel {

    private label: string = null;
    private composite: Composite = null;
    private panel: ItemListComboPanel = null;

    constructor(label: string, items: string[], name: XText) {
        this.label = label;
        this.panel = new ItemListComboPanel(items, name);
    }

    public createControl(parent: Composite, index?: number): void {
        this.composite = new Composite(parent, index);
        widgets.setGridLayout(this.composite, 2, 0, 0, 0, 0);
        dialogs.createLabelGridLabel(this.composite, this.label);
        this.createPanelPart(this.composite);
    }

    private createPanelPart(parent: Composite): void {
        this.panel.createControl(parent);
        widgets.setGridData(this.panel, true, true);
    }

    public getControl(): Control {
        return this.composite;
    }

}