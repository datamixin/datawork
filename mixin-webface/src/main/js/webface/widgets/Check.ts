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

export default class Check extends Control {

    private static CHECKED = "checked";
    private input: JQuery = null;
    private span: JQuery = null;
    private text: string = null;

    public constructor(parent: Composite, index?: number) {
        super(jQuery("<label>"), parent, index);
        this.element.addClass("widgets-check");

        this.input = jQuery("<input>");
        this.input.attr("type", "checkbox");
        this.element.append(this.input);

        this.span = jQuery("<span>");
        this.span.addClass("checkmark");
        this.element.append(this.span);

        this.element.on("click", (event: JQueryEventObject) => {
            if (this.isEnabled()) {
                if (event.target === this.element[0]) {
                    this.setChecked(!this.isChecked());
                    this.sendEvent(webface.Selection, event);
                    this.setChecked(!this.isChecked());
                }
            }
        });

        this.span.on("click", (event: JQueryEventObject) => {
            if (this.isEnabled()) {
                if (event.target === this.span[0]) {
                    this.setChecked(!this.isChecked());
                    this.sendEvent(webface.Selection, event);
                    this.setChecked(!this.isChecked());
                    event.stopPropagation();
                }
            }
        });
    }

    public setText(text: string): void {
        this.element.append(text);
        this.text = text;
    }

    public getText(): string {
        return this.text;
    }

    public isChecked(): boolean {
        return this.input.prop(Check.CHECKED);
    }

    public setChecked(checked: boolean): void {
        this.input.prop(Check.CHECKED, checked);
    }

    public getInputElement(): JQuery {
        return this.input;
    }

    public addSelectionListener(listener: SelectionListener): void {
        let typedListener = new TypedListener(listener);
        super.addListener(webface.Selection, typedListener);
    }

    public onSelection(listener: (checked: boolean) => void): void {
        this.addListener(webface.Selection, <Listener>{
            handleEvent: (event: Event) => {
                if (this.isEnabled()) {
                    let checked = this.input.prop(Check.CHECKED);
                    listener(checked);
                }
            }
        });
    }
}
