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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import LabelDialogPanel from "webface/ui/LabelDialogPanel";

import CustomNameBasePanel from "vegazoo/view/custom/CustomNameBasePanel";

export default class CustomNameDialogPanel extends CustomNameBasePanel {

    public static HEIGHT = 24;
    public static NAME_WIDTH = 100;

    private dialogPanel: LabelDialogPanel = null;
    private dialogInput = (callback: (list: string[]) => void) => { };
    private labelCallback = (value: string) => { };

    protected createValueControl(parent: Composite): void {

        this.dialogPanel = new LabelDialogPanel();
        this.dialogPanel.createControl(parent);

        let control = this.dialogPanel.getLabelControl();
        let element = control.getElement();
        element.css("line-height", (CustomNameDialogPanel.HEIGHT - 2) + "px");
        element.css("background-color", "#FFF");

        this.dialogPanel.setDialogInput((callback: (list: string[]) => void) => {
            this.dialogInput(callback);
        });
        this.dialogPanel.onLabelChange((text: string) => {
            this.labelCallback(text);
        });
    }

    public setButtonText(text: string): void {
        this.dialogPanel.setButtonText(text);
    }

    public setInputCallback(dialogInput: (callback: (list: string[]) => void) => void): void {
        this.dialogInput = dialogInput;
    }

    public setLabelCallback(callback: (value: string) => void): void {
        this.labelCallback = callback;
    }

    public setValue(value: string): void {
        this.dialogPanel.setText(value);
    }

    protected getValueControl(): Control {
        return this.dialogPanel.getControl();
    }

}