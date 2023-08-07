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

import LiteralFormula from "bekasi/LiteralFormula";

export default class FormulaEditor extends Control {

    private originalText: string = null;
    private progress = false;
    private onModify = (text: string) => { };
    private onCommit = (text: string, confirm: (confirm: boolean) => void) => { };
    private onSelect = (event: Event) => { };

    public constructor(parent: Composite, index?: number) {
        super(jQuery("<textarea>"), parent, index);
        this.element.addClass("padang-formula-editor");
        this.element.css("line-height", "18px");
        this.element.css("font-family", "monospace");
        this.element.css("white-space", "pre");
        this.element.css("overflow", "auto");
        this.element.css("resize", "none");

        this.element.on("click", (object: JQueryEventObject) => {
            if (this.isEnabled() === true) {
                let event = this.createSelectionEvent(object);
                this.onSelect(event);
            }
        });

        this.element.on("input", (event: JQueryEventObject) => {
            if (this.isEnabled() === true) {
                let text = this.element.val();
                this.onModify(text);
            }
        });

        this.element.on("blur", (event: JQueryEventObject) => {
            if (this.progress === false) {
                let text = this.element.val();
                if (this.originalText !== text) {
                    this.progress = true;
                    this.onCommit(text, (state: boolean) => {
                        if (state === true) {
                            this.originalText = text;
                        } else {
                            this.element.focus();
                        }
                        this.progress = false;
                    });
                }
            }
        });

    }

    public setFormula(formula: string | LiteralFormula) {
        if (formula instanceof LiteralFormula) {
            let literal = formula.literal;
            this.element.val(literal);
            this.originalText = literal;
        } else {
            let literal = <string>formula;
            this.element.val(literal);
            this.originalText = literal;
        }
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

    public setOnModify(callback: (text: string) => void): void {
        this.onModify = callback;
    }

    public setOnCommit(callback: (text: string, confirm: (state: boolean) => void) => void): void {
        this.onCommit = callback;
    }

    public setOnSelect(callback: (event: Event) => void): void {
        this.onSelect = callback;
    }

}
