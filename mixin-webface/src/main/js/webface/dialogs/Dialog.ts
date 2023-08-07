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
import * as webface from "webface/webface";

import Button from "webface/widgets/Button";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";
import FillLayout from "webface/layout/FillLayout";

import DialogButtons from "webface/dialogs/DialogButtons";
import DialogWindowBar from "webface/dialogs/DialogWindowBar";

var displayClass = "dialog-display";
var displaySelector = "." + displayClass;
var displayElement = jQuery(displaySelector);

// Untuk menampung semua dialog.
(() => {
    if (displayElement.length === 0) {

        let body = jQuery("body");
        displayElement = jQuery("<div>");
        displayElement.css({
            "overflow": "hidden",
            "z-index": "10"
        });
        displayElement.addClass(displayClass);
        body.append(displayElement);

    }
})();

export abstract class Dialog {

    public static OK: string = DialogButtons.OK;
    public static NO: string = DialogButtons.NO;
    public static CANCEL: string = DialogButtons.CANCEL;
    public static MIN_WIDTH: number = 240;
    public static MIN_HEIGHT: number = 180;

    private modalElement: JQuery;
    private dialogElement: JQuery;;

    private container: Composite = null;
    private windowBar: DialogWindowBar;
    private bodyPart: Composite = null;
    private buttons: DialogButtons;

    private windowTitle: string = "Dialog";

    private defaultButton: Button = null;

    constructor() {

        // Siapkan element penuh untuk memenuhi layar
        let modalClassName = "dialog-modal";
        this.modalElement = jQuery("." + modalClassName);
        this.modalElement = jQuery("<div>");
        this.modalElement.css({
            "opacity": "0.75",
            "background-color": "#FFFFFF",
            "position": "absolute",
            "overflow": "hidden",
            "z-index": "10"
        });
        this.modalElement.addClass(modalClassName);

        this.modalElement.css("top", 0);
        this.modalElement.css("left", 0);
        this.modalElement.css("width", "100%");
        this.modalElement.css("height", "100%");

        // Tambahkan ke dialog display
        displayElement.append(this.modalElement);

        // Div untuk menampung isi dialog.
        this.dialogElement = jQuery("<form>");
        this.dialogElement.attr("tabindex", "0");
        this.dialogElement.css({
            "position": "absolute",
            "display": "block",
            "background-color": "#FFFFFF",
            "box-shadow": "2px 2px 5px 2px #CCC",
            "min-width": Dialog.MIN_WIDTH + "px",
            "min-height": Dialog.MIN_HEIGHT + "px",
            "z-index": "10"

        });

        this.dialogElement.addClass("dialog-shell");
        displayElement.append(this.dialogElement);

        this.dialogElement.on("keydown", (event: JQueryEventObject) => {
            if (event.keyCode === 27) {
                this.defaultEscape();
            } else if (event.keyCode === 13) {
                this.defaultEnter();
            }
        });

        this.dialogElement.draggable({
            handle: ".dialog-windowBar",
            containment: this.modalElement,
        });

    }

    private create(): void {

        // Container
        this.container = new Composite(this.dialogElement);

        let layout = new GridLayout(1, 0, 0, 5, 0);
        this.container.setLayout(layout);

        // Window Bar
        this.windowBar = new DialogWindowBar(this.container);
        if (this.windowTitle) {
            this.windowBar.setText(this.windowTitle);
        }

        this.createBodyPart(this.container);
        this.buttons = new DialogButtons(this, this.container);
        this.createButtons(this.buttons);

        this.createContents(this.bodyPart);

    }

    private createBodyPart(parent: Composite): void {

        this.bodyPart = new Composite(parent);

        let layout = new FillLayout(webface.VERTICAL, 0, 0);
        this.bodyPart.setLayout(layout);

        let layoutData = new GridData(true, true);
        this.bodyPart.setLayoutData(layoutData);

    }

    protected setDialogSize(width: number, height: number): void {

        if (width !== webface.DEFAULT) {
            this.dialogElement.width(width);
        }

        if (height !== webface.DEFAULT) {
            this.dialogElement.height(height);
        }

        if (width !== webface.DEFAULT || height !== webface.DEFAULT) {
            if (this.container) {
                this.container.resized();
            }
        }
    }

    protected abstract createContents(parent: Composite): void;

    protected abstract createButtons(buttons: DialogButtons): void;

    public close(): void {
        if (this.modalElement) {
            this.modalElement.remove();
        }
        this.container.dispose();
    }

    protected defaultEscape(): void {
        this.close();
    }

    protected defaultEnter(): void {
        if (this.defaultButton !== null) {
            if (this.defaultButton.isEnabled() === true) {
                this.defaultButton.notifyListeners(webface.Selection);
            }
        }
    }

    protected setDefaultButton(button: Button): void {
        this.defaultButton = button;
    }

    public open(callback?: (result: string) => void): void {

        if (this.container === null) {
            this.create();
        }

        let dialogElement = this.container.getElement();
        dialogElement.show();
        dialogElement.focus();

        this.reposition();

        this.buttons.setCallback(callback);
        this.container.relayout();

        this.postOpen();
    }

    protected postOpen(): void {

    }

    protected getBaseHeight(): number {
        let height = DialogWindowBar.HEIGHT;
        height += DialogButtons.HEIGHT + 1;
        return height;
    }

    protected reposition(): void {
        let dialogElement = this.container.getElement();
        let windowWidth = this.modalElement.width();
        let windowHeight = this.modalElement.height();
        let elementWidth = dialogElement.width();
        let elementHeight = dialogElement.height();
        let left = Math.round((windowWidth - elementWidth) / 2);
        let top = Math.round((windowHeight - elementHeight) / 2);
        dialogElement.css("left", left);
        dialogElement.css("top", top);
    }

    public setWindowTitle(text: string): void {
        this.windowTitle = text;
        if (this.windowBar) {
            this.windowBar.setText(text);
        }
    }

    public setDialogLocation(left: number, top: number): void {
        let dialogElement = this.container.getElement();
        dialogElement.css("left", left);
        dialogElement.css("top", top);
    }

    protected getDialogButtons(): DialogButtons {
        return this.buttons;
    }

}

export default Dialog;
