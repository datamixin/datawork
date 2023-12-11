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
import Check from "webface/widgets/Check";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import CustomAbstractPanel from "vegazoo/view/custom/CustomAbstractPanel";

export default class ViceReferenceCheckPanel extends CustomAbstractPanel {

    public static SWITCH_WIDTH = 60;

    private composite: Composite = null;
    private usedCheck: Check = null;

    public createControl(parent: Composite, index?: number): void {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("vegazoo-reference-switch-panel");

        let layout = new GridLayout(1, 0, 0, 0, 0);
        this.composite.setLayout(layout);

        this.createUsedCheck(this.composite);
    }

    private createUsedCheck(parent: Composite): void {

        this.usedCheck = new Check(parent);
        let element = this.usedCheck.getElement();
        element.css("line-height", CustomAbstractPanel.HEIGHT + "px");
        element.css("font-weight", "500");


        let layoutData = new GridData(ViceReferenceCheckPanel.SWITCH_WIDTH, true);
        this.usedCheck.setLayoutData(layoutData);

    }

    public adjustHeight(): number {
        return ViceReferenceCheckPanel.HEIGHT;
    }

    public setName(name: string): void {
        this.usedCheck.setText(name);
    }

    public setUsed(used: boolean): void {
        this.usedCheck.setChecked(used);
    }

    public onUsed(callback: (selected: boolean) => void): void {
        this.usedCheck.onSelection(callback);
    }

    public getControl(): Control {
        return this.composite;
    }

}
