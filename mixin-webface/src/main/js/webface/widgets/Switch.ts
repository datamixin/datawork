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

import Event from "webface/widgets/Event";
import Control from "webface/widgets/Control";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";
import TypedListener from "webface/widgets/TypedListener";
import SelectionListener from "webface/events/SelectionListener";

/**
 * https://proto.io/freebies/onoff/
 */
export default class Switch extends Control {

    public static ON = "on";
    public static OFF = "off";

    public static DEFAULT_WIDTH = "60px";

    private checkbox: JQuery;
    private switchSpan: JQuery;
    private innerSpan: JQuery;

    private selected: boolean = false;

    public constructor(parent: Composite, index?: number) {

        super(jQuery("<div>"), parent, index);
        this.element.addClass("widgets-switch");

        let element = jQuery("<div>");
        element.addClass("onoffswitch");
        element.css("width", Switch.DEFAULT_WIDTH);
        this.element.append(element);

        let random = Math.random();
        this.checkbox = jQuery("<input>");
        this.checkbox.addClass("onoffswitch-checkbox");
        this.checkbox.attr("type", "checkbox");
        this.checkbox.attr("id", "onoffswitch-" + random);
        element.append(this.checkbox);

        let label = jQuery("<label>");
        label.addClass("onoffswitch-label");
        label.attr("for", "onoffswitch-" + random);
        element.append(label);

        this.innerSpan = jQuery("<span>");
        this.innerSpan.attr(Switch.ON, "ON");
        this.innerSpan.attr(Switch.OFF, "OFF");
        this.innerSpan.addClass("onoffswitch-inner");
        label.append(this.innerSpan);

        this.switchSpan = jQuery("<span>");
        this.switchSpan.addClass("onoffswitch-switch");
        label.append(this.switchSpan);

        // Handle click
        this.checkbox.click((event) => {
            if (this.isEnabled()) {
                this.selected = !this.selected;
                this.sendEvent(webface.Selection, event);
            }
        });

    }

    public setSelection(state: boolean) {
        this.selected = state;
        if (state === true) {
            this.checkbox.prop("checked", true);
        } else {
            this.checkbox.prop("checked", false);
        }
    }

    public getSelection(): boolean {
        return this.selected;
    }

    public addSelectionListener(listener: SelectionListener): void {
        let typedListener = new TypedListener(listener);
        this.addListener(webface.Selection, typedListener);
    }

    public onSelection(listener: (state: boolean, event: Event) => void): void {
        this.addListener(webface.Selection, <Listener>{
            handleEvent: (event: Event) => {
                if (this.isEnabled()) {
                    listener(this.selected, event);
                }
            }
        });
    }
}
