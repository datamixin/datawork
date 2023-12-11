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
import Label from "webface/widgets/Label";
import Button from "webface/widgets/Button";
import Control from "webface/widgets/Control";
import * as functions from "webface/functions";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import LabelProvider from "webface/viewers/LabelProvider";
import StringLabelProvider from "webface/viewers/StringLabelProvider";

import ListSelectionDialog from "webface/dialogs/ListSelectionDialog";

export default class LabelDialogPanel {

    public static BUTTON_WIDTH = 18;

    private composite: Composite = null;
    private textLabel: Label = null;
    private labelCallback: (text: string) => void = null;
    private dialogInput: (callback: (input: any) => void) => void = null;
    private dialogButton: Button = null;
    private dialogLabelProvider: LabelProvider = new StringLabelProvider();

    public createControl(parent: Composite, index?: number): void {

        this.composite = new Composite(parent, index);

        let element = this.composite.getElement();
        element.css("border", "1px solid #D8D8D8");
        element.css("border-radius", "3px");

        let layout = new GridLayout(2, 0, 0, 0, 0);
        this.composite.setLayout(layout);

        this.createTextLabel(this.composite);
        this.createDialogButton(this.composite);
    }

    private createTextLabel(parent: Composite): void {

        this.textLabel = new Label(parent);

        let element = this.textLabel.getElement();
        element.css("text-indent", "5px");
        element.css("line-height", "inherit");

        let layoutData = new GridData(true, true);
        this.textLabel.setLayoutData(layoutData);
    }

    private createDialogButton(parent: Composite): void {

        this.dialogButton = new Button(parent);

        let element = this.dialogButton.getElement();
        element.css("border", 0);
        element.css("border-radius", 0);
        element.css("border-left", "1px solid #D8D8D8");
        element.css("padding", 0);

        let layoutData = new GridData(LabelDialogPanel.BUTTON_WIDTH, true);
        this.dialogButton.setLayoutData(layoutData);

        this.dialogButton.onSelection(() => {
            if (this.dialogInput !== null) {
                this.dialogInput((input: any) => {
                    let dialog = new ListSelectionDialog();
                    dialog.setInput(input);
                    dialog.setFiltered(true);
                    dialog.setLabelProvider(this.dialogLabelProvider);
                    dialog.open((result: string) => {
                        if (result === ListSelectionDialog.OK) {
                            let selection = dialog.getFirstSelection();
                            let text = this.dialogLabelProvider.getText(selection);
                            this.textLabel.setText(text);
                            if (this.labelCallback !== null) {
                                this.labelCallback(selection);
                            }
                        }
                    });
                });
            }
        });
    }

    public getLabelControl(): Label {
        return this.textLabel;
    }

    public getButtonControl(): Button {
        return this.dialogButton;
    }

    public setText(text: string): void {
        let value = this.textLabel.getText();
        if (value !== text) {
            this.textLabel.setText(text);
        }
    }

    public getText(): string {
        return this.textLabel.getText();
    }

    public setButtonText(text: string): void {

        let element = this.dialogButton.getElement();
        let width = functions.measureTextWidth(element, text);
        width += LabelDialogPanel.BUTTON_WIDTH;

        let layoutData = <GridData>this.dialogButton.getLayoutData();
        layoutData.widthHint = width;

        this.dialogButton.setText(text);
        this.composite.relayout();
    }

    public setDialogInput(dialogInput: (callback: (input: any) => void) => void): void {
        this.dialogInput = dialogInput;
    }

    public setDialogLabelProvider(provider: LabelProvider): void {
        this.dialogLabelProvider = provider;
    }

    public onLabelChange(callback: (text: string) => void): void {
        this.labelCallback = callback;
    }

    public setEnabled(enabled: boolean): void {
        this.textLabel.setEnabled(enabled);
        this.dialogButton.setEnabled(enabled);
    }

    public getControl(): Control {
        return this.composite;
    }
}
