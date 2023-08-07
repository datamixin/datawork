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
import * as webface from "webface/webface";

import Event from "webface/widgets/Event";
import Control from "webface/widgets/Control";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";
import TypedListener from "webface/widgets/TypedListener";

import SelectionListener from "webface/events/SelectionListener";

export default class ButtonGroup extends Control {

    private static SELECTED_CLASS = "btn-primary";

    private items: string[] = [];
    private selection: number = webface.DEFAULT;

    constructor(parent: Composite, index?: number) {
        super(jQuery("<div>"), parent, index);
        this.element.addClass("widgets-button-group");
        this.element.addClass("btn-group");
        this.element.attr("data-toggle", "buttons");

        this.element.on("click", (eventObject: JQueryEventObject) => {
            if (this.isEnabled()) {
                let target = eventObject.target;
                let button = $(target);
                if (target === this.element[0]) {
                    return;
                }
                let text = button.text();
                button.addClass(ButtonGroup.SELECTED_CLASS);
                let index = this.items.indexOf(text);
                if (index !== this.selection) {
                    let children = this.element.children();
                    $(children[this.selection]).removeClass(ButtonGroup.SELECTED_CLASS);
                }
                this.selection = index;
                this.sendEvent(webface.Selection, eventObject);
            }
        });
    }

    public setItems(items: string[]): void {
        this.element.children().remove();
        for (var i = 0; i < items.length; i++) {
            let button = jQuery("<button>");
            button.css("line-height", "inherit");
            button.addClass("btn");
            button.addClass("btn-sm");
            button.addClass("btn-default");
            button.attr("type", "button");
            button.text(items[i]);
            this.element.append(button);
        }
        this.items = items;
    }

    public getSelection(): number {
        return this.selection;
    }

    public getSelectionText(): string {
        return this.items[this.selection];
    }

    public setSelection(selection: number): void {

        // Clear previous selection
        let children = this.element.children();
        $(children[this.selection]).removeClass(ButtonGroup.SELECTED_CLASS);

        // Set new selection
        this.selection = selection;
        $(children[this.selection]).addClass(ButtonGroup.SELECTED_CLASS);
    }

    public setSelectionText(text: string): void {
        let index = this.items.indexOf(text);
        if (index >= 0) {
            this.setSelection(index);
        }
    }

    public addSelectionListener(listener: SelectionListener): void {
        let typedListener = new TypedListener(listener);
        this.addListener(webface.Selection, typedListener);
    }

    public onSelection(listener: (selection: string, event: Event) => void): void {
        this.addListener(webface.Selection, <Listener>{
            handleEvent: (event: Event) => {
                let selection = this.getSelectionText();
                listener(selection, event);
            }
        });
    }
}
