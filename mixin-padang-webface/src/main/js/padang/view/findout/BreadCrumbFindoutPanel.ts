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
import * as webface from "webface/webface";
import * as functions from "webface/functions";

import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import RowData from "webface/layout/RowData";
import RowLayout from "webface/layout/RowLayout";

import Conductor from "webface/wef/Conductor";

import * as widgets from "webface/widgets/functions";

import * as padang from "padang/padang";

import RunspaceItem from "bekasi/resources/RunspaceItem";

import RunspaceItemAncestorsRequest from "bekasi/requests/RunspaceItemAncestorsRequest";

import RunspaceItemListDirectoryOpenRequest from "padang/requests/findout/RunspaceItemListDirectoryOpenRequest";

export default class BreadCrumbFindoutPanel {

    private static SEPARATOR_WIDTH = 18;

    private conductor: Conductor = null;
    private composite: Composite = null;

    constructor(conductor: Conductor) {
        this.conductor = conductor;
    }

    public createControl(parent: Composite): void {

        this.composite = new Composite(parent);

        let layout = new RowLayout(webface.ROW, 0, 0, 0);
        this.composite.setLayout(layout);
    }

    public setFolderId(folderId: string): void {

        widgets.removeChildren(this.composite);

        let request = new RunspaceItemAncestorsRequest(folderId);
        this.conductor.submit(request, (items: RunspaceItem[]) => {

            for (let i = 0; i < items.length; i++) {

                let ancestor = items[i];
                let name = ancestor.getName();
                let folderId = ancestor.getId();
                if (i === 0) {
                    name = padang.PROJECTS;
                } else {
                    this.createSeparatorPart(this.composite);
                }
                this.createLabelPart(this.composite, name, folderId, i < items.length - 1);

            }

            this.composite.relayout();
        })
    }

    private createLabelPart(parent: Composite, text: string, folderId: string, active: boolean): void {

        let label = new Label(parent);
        label.setText(text);

        let element = label.getElement();
        element.addClass("padang-bread-crumb-findout-panel-part");
        element.css("line-height", "inherit");

        let width = functions.measureTextWidth(element, text);
        let layoutData = new RowData(width);
        label.setLayoutData(layoutData);

        if (active === true) {
            element.addClass("active");
            label.onSelection(() => {
                let request = new RunspaceItemListDirectoryOpenRequest(folderId);
                this.conductor.submit(request);
            });
        }
    }

    private createSeparatorPart(parent: Composite): void {

        let icon = new WebFontIcon(parent);
        icon.addClasses("mdi", "mdi-chevron-right");

        let element = icon.getElement();
        let size = BreadCrumbFindoutPanel.SEPARATOR_WIDTH;
        element.addClass("padang-bread-crumb-findout-panel-separator");
        element.css("padding-top", "1px");
        element.css("font-size", "20px");
        element.css("line-height", "inherit");

        let layoutData = new RowData(size);
        icon.setLayoutData(layoutData);
    }

    public getControl(): Control {
        return this.composite;
    }

}

