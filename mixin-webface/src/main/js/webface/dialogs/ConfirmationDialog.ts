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

import Label from "webface/widgets/Label";
import Composite from "webface/widgets/Composite";

import Dialog from "webface/dialogs/Dialog";
import DialogButtons from "webface/dialogs/DialogButtons";

import FillLayout from "webface/layout/FillLayout";

export default class ConfirmationDialog extends Dialog {

    private prompt: string = "Confirmation message prompt?";
    private noButton: boolean = false;
    private cancelButton: boolean = true;
    private promptLabel: Label;

    constructor() {
        super();
        super.setDialogSize(Dialog.MIN_WIDTH * 2, Dialog.MIN_HEIGHT);
        this.setWindowTitle("Confirmation Dialog");
    }

    public setShowNoButton(state: boolean): void {
        this.noButton = state;
    }

    public setShowCancelButton(state: boolean): void {
        this.cancelButton = state;
    }

    public createContents(parent: Composite): void {

        let composite = new Composite(parent);

        let layout = new FillLayout(webface.VERTICAL, 20, 20);
        composite.setLayout(layout);

        this.createPromptLabel(composite);

    }

    private createPromptLabel(parent: Composite): void {

        this.promptLabel = new Label(parent);
        this.promptLabel.setText(this.prompt);

        let element = this.promptLabel.getElement();
        element.css("line-height", "24px");
        element.css("white-space", "pre-wrap");
    }

    public createButtons(buttons: DialogButtons): void {
        if (this.noButton === true) {
            buttons.createNOButton();
        }
        if (this.cancelButton === true) {
            buttons.createCancelButton();
        }
        let okButton = buttons.createOKButton();
        this.setDefaultButton(okButton);
    }

    public setPrompt(message: string): void {
        this.prompt = message;
        if (this.promptLabel) {
            this.promptLabel.setText(message);
        }
    }

}

