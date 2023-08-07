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
import Event from "webface/widgets/Event";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

export default class FormulaText extends Control {

    private originalText: string = null;
    private modifyCallback = (text: string) => { };
    private commitCallback = (text: string, confirm: (confirm: boolean) => void) => { };
    private selectCallback = (event: Event) => { };
    private cancelCallback = () => { };

    public constructor(parent: Composite, index?: number) {
        super(jQuery("<input>"), parent, index);
        this.element.attr("type", "text");
        this.element.addClass("padang-formula-text");
        this.element.css("line-height", "inherit");
        this.element.css("font-family", "monospace");
        this.element.css("white-space", "pre");
        this.element.css("overflow", "hidden");
        this.element.css("resize", "none");

        this.element.on("click", (object: JQueryEventObject) => {
            if (this.isEnabled() === true) {
                let event = this.createSelectionEvent(object);
                this.selectCallback(event);
            }
        });

        this.element.on("input", (event: JQueryEventObject) => {
            if (this.isEnabled() === true) {
                let text = this.element.val();
                this.modifyCallback(text);
            }
        });

        this.element.on("keydown", (event: JQueryEventObject) => {

            // Enter
            if (event.which === 13) {
                let text = this.element.val();
                this.element.blur();
                this.commitConfirm(text);
            }

            // Escape
            if (event.which === 27) {
                this.cancelCallback();
                this.element.val(this.originalText);
            }
        });

        this.element.on("blur", (event: JQueryEventObject) => {
            let text = this.element.val();
            if (this.originalText !== text) {
                this.commitConfirm(text);
            }
        });

    }

    private commitConfirm(text: string): void {
        this.commitCallback(text, (state: boolean) => {
            if (state === true) {
                this.originalText = text;
            } else {
                this.element.focus();
            }
        });
    }

    public setText(text: string) {
        this.element.val(text);
        this.originalText = text;
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

    protected applyEnabled(enabled: boolean): void {
        this.element.prop("disabled", !enabled);
    }

    public onModify(callback: () => void): void {
        this.modifyCallback = callback;
    }

    public onCommit(callback: (text: string, confirm: (state: boolean) => void) => void): void {
        this.commitCallback = callback;
    }

    public onSelect(callback: (event: Event) => void): void {
        this.selectCallback = callback;
    }

    public onCancel(callback: () => void): void {
        this.cancelCallback = callback;
    }

}
