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

import GridLabelPanel from "padang/grid/GridLabelPanel";

export default class GridDefaultLabelPanel implements GridLabelPanel {

    private label: Label = null;

    public createControl(parent: Composite, index?: number): void {

        this.label = new Label(parent);

        let element = this.label.getElement();
        element.addClass("padang-grid-default-label-panel");
        element.css("line-height", "inhirent");
    }

    public setLabel(text: string): void {
        this.label.setText(text);
    }

    public getLabel(): string {
        return this.label.getText();
    }

    public getControl(): Control {
        return this.label;
    }

}