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
import Composite from "webface/widgets/Composite";
import Listener from "webface/widgets/Listener";
import ModifyEvent from "webface/events/ModifyEvent";
import TypedListener from "webface/widgets/TypedListener";

import ModifyListener from "webface/events/ModifyListener";
import SelectionListener from "webface/events/SelectionListener";

export default class TextArea extends Control {

    public constructor(parent: Composite, index?: number) {
        super(jQuery("<textarea>"), parent, index);
        this.element.addClass("widgets-textarea");
        this.element.attr("wrap", "off");
        this.element.css("resize", "none");
        this.element.css("border-color", webface.COLOR_BORDER);
        this.element.on("click", this.fireSelection);
        this.element.on("select", this.fireSelection);
        this.element.on("keydown", this.fireSelection);
        this.element.on("input", (event: JQueryEventObject) => {
            if (this.isEnabled() === true) {
                this.sendEvent(webface.Modify, event);
            }
        });
    }

    private fireSelection = (event: JQueryEventObject) => {
        if (this.isEnabled() === true) {
            this.sendEvent(webface.Selection, event);
        }
    }

    public setText(text: string) {
        this.element.val(text);
        this.sendEvent(webface.Modify);
    }

    public getText(): string {
        return this.element.val();
    }

    public setEnabled(enabled: boolean): void {
        super.setEnabled(enabled);
        if (enabled === true) {
            this.element.removeAttr("readonly");
        } else {
            this.element.attr("readonly", "true");
        }
    }

    public getSelectionEnd(): number {

        let input = <HTMLTextAreaElement>this.element[0];
        let pos = input.value.length;

        if (input["createTextRange"]) {
            let range = document["selection"].createRange().duplicate();
            range.moveStart('character', -input.value.length);
            if (range.text == '') {
                pos = input.value.length;
            }
            pos = input.value.lastIndexOf(range.text);
        } else if (typeof (input.selectionEnd) != "undefined") {
            pos = input.selectionEnd;
        }

        return pos;
    }

    public addSelectionListener(listener: SelectionListener): void {
        let typedListener = new TypedListener(listener);
        this.addListener(webface.Selection, typedListener);
    }

    public onSelection(listener: (event: Event) => void): void {
        this.addListener(webface.Selection, <Listener>{
            handleEvent: (event: Event) => {
                listener(event);
            }
        });
    }

    public addModifyListener(listener: ModifyListener): void {
        let typedListener: TypedListener = new TypedListener(listener);
        this.addListener(webface.Modify, typedListener);
    }

    public onModify(callback: (text: string, event: ModifyEvent) => void): void {
        this.addModifyListener(<ModifyListener>{
            modifyText: (event: ModifyEvent) => {
                let text = this.element.val();
                callback(text, event);
            }
        });
    }
}
