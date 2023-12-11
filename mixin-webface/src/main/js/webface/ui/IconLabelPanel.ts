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
import WebFontIcon from "webface/widgets/WebFontIcon";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

export default class IconLabelPanel {

    private static LINE_HEIGHT = 24;

    private composite: Composite = null;
    private icon: WebFontIcon = null;
    private label: Label = null;
    private callback: () => void = () => { };

    public createControl(parent: Composite, index?: number): void {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let layout = new GridLayout(2, 0, 0);
        this.composite.setLayout(layout);

        this.createIcon(this.composite);
        this.createLabel(this.composite);

        this.composite.onSelection(() => {
            this.callback();
        });
    }

    private createIcon(parent: Composite): void {

        this.icon = new WebFontIcon(parent);
        this.icon.addClasses("mdi", "mdi-plus-circle-outline");

        let element = this.icon.getElement();
        element.css("color", "#888");
        element.css("font-size", IconLabelPanel.LINE_HEIGHT + "px");
        element.css("line-height", IconLabelPanel.LINE_HEIGHT + "px");

        // Layout data
        let layoutData = new GridData(IconLabelPanel.LINE_HEIGHT, true);
        this.icon.setLayoutData(layoutData);

    }

    private createLabel(parent: Composite): void {

        this.label = new Label(parent);

        let element = this.label.getElement();
        element.css("color", "#A8A8A8");
        element.css("line-height", IconLabelPanel.LINE_HEIGHT + "px");
        element.css("font-style", "italic");
        element.css("text-overflow", "ellipsis");
        element.css("overflow", "hidden");

        let layoutData = new GridData(true, true);
        this.label.setLayoutData(layoutData);
    }

    public setCallback(callback: () => void): void {
        this.callback = callback;
    }

    public setReadOnly(state: boolean): void {
        this.icon.setEnabled(!state);
    }

    public setLabel(text: string): void {
        this.label.setText(text);
    }

    public getControl(): Control {
        return this.composite;
    }

}