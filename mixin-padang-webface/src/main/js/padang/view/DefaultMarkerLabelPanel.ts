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
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ConductorPanel from "webface/wef/ConductorPanel";

import * as view from "padang/view/view";

import GridLabelPanel from "padang/grid/GridLabelPanel";
import GridControlStyle from "padang/grid/GridControlStyle";

export default class DefaultMarkerPanel extends ConductorPanel implements GridLabelPanel {

    private composite: Composite = null;
    private indexLabel: Label = null;
    private selected: boolean = false;
    private onSelection = (control: Control) => { };

    public createControl(parent: Composite, index?: number) {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("padang-default-marker-label-panel");

        this.composite.onSelection(() => {
            if (this.selected === false) {
                this.onSelection(this.composite);
            }
        });

        view.setGridLayout(this.composite, 1, 0, 0, 0, 0);

        this.createIndexLabel(this.composite);
    }

    private createIndexLabel(parent: Composite): void {

        this.indexLabel = new Label(parent);

        let element = this.indexLabel.getElement();
        element.css("line-height", "inhirent");
        element.css("text-align", "center");

        view.setGridData(this.indexLabel, true, true);

    }

    public setLabel(label: any): void {
        this.indexLabel.setData(label);
        this.indexLabel.setText(label);
    }

    public setSelected(selected: boolean): void {
        this.selected = selected;
        view.setSelected(this.composite, this.selected);
    }

    public setOnSelection(callback: (control: Control) => void): void {
        this.onSelection = callback;
    }

    public adjustWidth(): number {
        return GridControlStyle.MIN_COLUMN_WIDTH;
    }

    public getControl(): Control {
        return this.composite;
    }

}
