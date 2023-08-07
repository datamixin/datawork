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
import Item from "webface/widgets/Item";
import Event from "webface/widgets/Event";
import ToolBar from "webface/widgets/ToolBar";
import TypedListener from "webface/widgets/TypedListener";

import Image from "webface/graphics/Image";
import WebFontImage from "webface/graphics/WebFontImage";

import * as webface from "webface/webface";

import * as functions from "webface/widgets/functions";

import SelectionListener from "webface/events/SelectionListener";

export default class ToolItem extends Item {

    private enabled: boolean = true;
    private textElement: JQuery;
    private imageElement: JQuery;

    constructor(toolbar: ToolBar, index?: number) {
        super(jQuery("<label>"));

        // Bootstrap style
        this.element.on("click", (eventObject: JQueryEventObject) => {
            if (this.enabled === true) {
                let event = new Event();
                event.eventObject = eventObject;
                event.widget = this;
                event.type = webface.Selection;
                this.notifyListeners(webface.Selection, event);
            }
        });

        // Text element
        this.textElement = jQuery("<span>");
        this.element.append(this.textElement);

        toolbar.addItem(this, index);
    }

    public setText(text: string): void {
        this.text = text;
        this.textElement.text(text);
    }

    public setImage(image: Image, info?: string): void {
        this.image = image;
        this.imageElement = functions.appendImage(this.element, image);
        if (image instanceof WebFontImage) {
            this.imageElement.css("font-size", "24px");
            this.imageElement.css("padding", "2px");
            this.imageElement.css("padding-left", "4px");
            this.imageElement.css("padding-right", "4px");
            this.imageElement.css("cursor", "pointer");
        }

        if (info !== undefined) {
            this.imageElement.attr("title", info);
        }
    }

    public setEnabled(state: boolean): void {
        if (state === this.enabled) {
            return;
        }
        if (state === true) {
            this.element.css("opacity", "1.00");
            if (this.image instanceof WebFontImage) {
                this.imageElement.css("color", "");
            }
        } else {
            this.element.css("opacity", "0.25");
            if (this.image instanceof WebFontImage) {
                this.imageElement.css("color", "#444");
            }
        }
        this.enabled = state;
    }

    public addSelectionListener(listener: SelectionListener) {
        let typedListener = new TypedListener(listener);
        super.addListener(webface.Selection, typedListener);
    }

    public removeSelectionListener(listener: SelectionListener) {
        let typedListener = new TypedListener(listener);
        super.removeListener(webface.Selection, typedListener);
    }

}