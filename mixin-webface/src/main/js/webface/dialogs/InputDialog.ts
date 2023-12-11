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
import Text from "webface/widgets/Text";
import Label from "webface/widgets/Label";
import Button from "webface/widgets/Button";
import Composite from "webface/widgets/Composite";

import Dialog from "webface/dialogs/Dialog";
import DialogButtons from "webface/dialogs/DialogButtons";
import InputValidator from "webface/dialogs/InputValidator";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

export default class InputDialog extends Dialog {

    private prompt: string = "Please specify input";
    private value: string = "";

    private promptLabel: Label;
    private valueText: Text;
    private message: Label;
    private validator: InputValidator;

    private okButton: Button;

    constructor(validator: InputValidator) {
        super();
        this.validator = validator;
        this.setDialogSize(360, 180);
        this.setWindowTitle("Input Dialog");
    }

    public createContents(parent: Composite): void {

        let composite = new Composite(parent);
        let layout = new GridLayout();
        layout.marginWidth = 10;
        layout.marginHeight = 15;
        composite.setLayout(layout);

        this.createPrompt(composite);
        this.createValue(composite);
        this.createMessage(composite);

    }

    private createPrompt(parent: Composite): void {

        this.promptLabel = new Label(parent);
        this.promptLabel.setText(this.prompt);

        let layoutData = new GridData();
        layoutData.grabExcessHorizontalSpace = true;
        this.promptLabel.setLayoutData(layoutData);
    }

    private createValue(parent: Composite): void {

        this.valueText = new Text(parent);
        this.updateValueText();

        let valueData = new GridData();
        valueData.grabExcessHorizontalSpace = true;
        this.valueText.setLayoutData(valueData);

        // Input element
        let element = this.valueText.getElement();
        element.focus();

        // Dengarkan perubahan input untuk validasi.
        this.valueText.addModifyListener({
            modifyText: (event) => {
                this.validate();
            }
        });

    }

    private updateValueText(): void {
        this.valueText.setText(this.value);
        let element = this.valueText.getElement();
        let htmlText = <HTMLInputElement>element[0];
        htmlText.selectionStart = 0;
        htmlText.selectionEnd = this.value.length;
    }

    private createMessage(parent: Composite): void {
        this.message = new Label(parent);
    }

    public createButtons(buttons: DialogButtons): void {
        buttons.createCancelButton();
        this.okButton = buttons.createOKButton();
        this.okButton.setEnabled(false);
        this.setDefaultButton(this.okButton);
    }

    private setMessage(text: string): void {
        this.message.setText(text);
        this.setMessageColor("#444");
    }

    private setErrorMessage(text: string): void {
        this.message.setText(text);
        this.setMessageColor("#B00");
    }

    private setMessageColor(color: string): void {
        let element = this.message.getElement();
        element.css("color", color);
    }

    public setPrompt(message: string): void {
        this.prompt = message;
        if (this.promptLabel) {
            this.promptLabel.setText(message);
        }
    }

    public setInitialInput(text: string): void {
        this.value = text;
        if (this.valueText) {
            this.updateValueText();
        }
    }

    protected postOpen(): void {
        this.valueText.forceFocus();
    }

    public setValidator(validator: InputValidator): void {
        this.validator = validator;
    }

    public validate(): void {
        if (this.validator !== undefined) {
            this.value = this.valueText.getText();
            this.validator.validate(this.value, (message: string) => {
                if (message === null) {
                    this.setMessage(null);
                    this.okButton.setEnabled(true);
                } else {
                    this.setErrorMessage(message);
                    this.okButton.setEnabled(false);
                }
            });
        }
    }

    public getValue(): string {
        return this.value;
    }
}
