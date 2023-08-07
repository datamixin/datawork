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
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import HeightAdjustablePart from "webface/wef/HeightAdjustablePart";

export default class CustomHeaderPanel implements HeightAdjustablePart {

    public static HEIGHT = 30;

    private composite: Composite = null;
    private textLabel: Label = null;

    public createControl(parent: Composite, index?: number): void {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("vegazoo-custom-header-panel");
        element.css("background-color", "#F8F8F8");

        let layout = new GridLayout(2, 0, 0, 0, 0);
        this.composite.setLayout(layout);

        this.createTextLabel(this.composite);
    }

    private createTextLabel(parent: Composite): void {

        this.textLabel = new Label(parent);

        let element = this.textLabel.getElement();
        element.css("line-height", CustomHeaderPanel.HEIGHT + "px");
        element.css("font-weight", "500");

        let layoutData = new GridData(true, true);
        this.textLabel.setLayoutData(layoutData);
    }

    public setText(text: string): void {
        this.textLabel.setText(text);
    }

    public adjustHeight(): number {
        return CustomHeaderPanel.HEIGHT;
    }

    public getControl(): Control {
        return this.composite;
    }

}