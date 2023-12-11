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

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import CustomAbstractPanel from "vegazoo/view/custom/CustomAbstractPanel";

export abstract class CustomNameBasePanel extends CustomAbstractPanel {

    public static NAME_WIDTH = 100;

    private name: string = null;
    private composite: Composite = null;
    private nameLabel: Label = null;

    constructor(name: string) {
        super();
        this.name = name;
    }

    public createControl(parent: Composite, index?: number): void {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("vegazoo-custom-name-base-panel");

        let layout = new GridLayout(2, 0, 0, 0, 0);
        this.composite.setLayout(layout);

        this.createNameLabel(this.composite);
        this.createValuePart(this.composite);
    }

    private createNameLabel(parent: Composite): void {

        this.nameLabel = new Label(parent);
        this.nameLabel.setText(this.name);

        let element = this.nameLabel.getElement();
        element.css("color", "#444");
        element.css("line-height", CustomNameBasePanel.HEIGHT + "px");

        let layoutData = new GridData(CustomNameBasePanel.NAME_WIDTH, true);
        this.nameLabel.setLayoutData(layoutData);
    }

    private createValuePart(parent: Composite): void {

        this.createValueControl(parent);
        let control = this.getValueControl();

        let layoutData = new GridData(true, true);
        control.setLayoutData(layoutData);

    }

    protected abstract createValueControl(parent: Composite): void;

    protected abstract getValueControl(): Control;

    public setName(name: string): void {
        this.nameLabel.setText(name);
    }

    public getControl(): Control {
        return this.composite;
    }

}

export default CustomNameBasePanel;