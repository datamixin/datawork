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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import * as functions from "webface/functions";

import LabelTextPanel from "webface/ui/LabelTextPanel";

import HeightAdjustablePart from "webface/wef/HeightAdjustablePart";

import * as view from "padang/view/view";

export default class NamePanel implements HeightAdjustablePart {

    private static HEIGHT = 30;
    private static ICON_WIDTH = 24;

    private namePanel = new LabelTextPanel();
    private onNameChanged = (newName: string, oldName: string, confirm: (success: boolean) => void): void => {
        confirm(false);
    };

    public createControl(parent: Composite, index?: number) {

        this.namePanel.createControl(parent);
        let control = this.namePanel.getControl();
        let element = control.getElement();
        element.attr("title", "Double click to rename this item");

        view.setGridData(this.namePanel, true, true);

        this.namePanel.onCommit((newText: string, oldText: string) => {
            this.onNameChanged(newText, oldText, (success: boolean) => {
                if (success === false) {
                    this.namePanel.setText(oldText);
                }
            });
        });

    }

    public setShowEdit(state: boolean): void {
        this.namePanel.setShowEdit(state);
    }

    public setColor(color: string): void {
        view.css(this.namePanel, "color", color);
    }

    public setName(name: string): void {
        this.namePanel.setText(name);
    }

    public getName(): string {
        return this.namePanel.getText();
    }

    public setOnNameChanged(callback: (newName: string, oldName: string,
        confirm: (success: boolean) => void) => void): void {
        this.onNameChanged = callback;
    }

    public adjustHeight(): number {
        return NamePanel.HEIGHT;
    }

    public adjustWidth(): number {
        let control = this.namePanel.getLabelControl();
        let element = control.getElement();
        let text = this.namePanel.getText();
        let width = Math.ceil(functions.measureTextWidth(element, text));
        return width + NamePanel.ICON_WIDTH;
    }

    public getControl(): Control {
        return this.namePanel.getControl();
    }

}
