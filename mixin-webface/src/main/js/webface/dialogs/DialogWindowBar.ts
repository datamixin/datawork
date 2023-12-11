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
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

export default class DialogWindowBar {

    public static HEIGHT = 32;

    private label: Label;
    private composite: Composite;

    constructor(parent: Composite) {

        this.composite = new Composite(parent);

        let element = this.composite.getElement();
        element.css({
            "background-color": "#4A5863",
            "border-bottom": "1px solid #EEEEEE",
            "cursor": "move"
        });
        element.addClass("dialog-windowBar");

        // Layout
        let layout = new GridLayout(1, 10);
        this.composite.setLayout(layout);

        // Layout Data
        let layoutData = new GridData(true, DialogWindowBar.HEIGHT);
        this.composite.setLayoutData(layoutData);

        this.createLabel(this.composite);
    }

    private createLabel(parent: Composite): void {

        this.label = new Label(parent);
        this.label.setText("");
        let labelElement = this.label.getElement();
        labelElement.css({
            "font-weight": "bold",
            "color": "#EFEFEF",
            "cursor": "move",
            "line-height": "20px"
        });

        // Layout Data
        let layoutData = new GridData(true, true);
        this.label.setLayoutData(layoutData);
    }

    public setText(text: string): void {
        this.label.setText(text);
    }

}

