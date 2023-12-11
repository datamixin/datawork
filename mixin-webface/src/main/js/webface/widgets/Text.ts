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

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";
import ModifyEvent from "webface/events/ModifyEvent";
import TypedListener from "webface/widgets/TypedListener";
import ModifyListener from "webface/events/ModifyListener";

export default class Text extends Control {

    private static TYPE_TEXT = "text";
    private static TYPE_PASSWORD = "password";

    public constructor(parent: Composite, index?: number) {
        super(jQuery("<input>"), parent, index);
        this.element.addClass("widgets-text");
        this.element.attr("type", Text.TYPE_TEXT);
        this.element.css({
            "line-height": "24px"
        });
        this.element.on("input", (event: JQueryEventObject) => {
            if (this.isEnabled() === true) {
                this.sendEvent(webface.Modify, event);
            }
        });
    }

    public setText(text: string) {
        this.element.val(text);
    }

    public setPlaceholderText(text: string) {
        this.element.attr("placeholder", text);
    }

    public getText(): string {
        return this.element.val();
    }

    public setReadOnly(state: boolean): void {
        this.element.prop('readonly', state);
    }

    public setPassword(enabled: boolean): void {
        if (enabled) {
            this.element.attr("type", Text.TYPE_PASSWORD);
        } else {
            this.element.attr("type", Text.TYPE_TEXT);
        }
    }

    protected applyEnabled(enabled: boolean): void {
        this.element.prop("disabled", !enabled);
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

    public onKeyUp(callback: (key: number) => void): void {
        this.element.on("keyup", (event: JQueryEventObject) => {
            callback(event.which);
        });
    }

    public onKeyDown(callback: (key: number) => void): void {
        this.element.on("keydown", (event: JQueryEventObject) => {
            callback(event.which);
        });
    }

}
