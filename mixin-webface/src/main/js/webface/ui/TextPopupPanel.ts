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

import Text from "webface/widgets/Text";
import Event from "webface/widgets/Event";
import Control from "webface/widgets/Control";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import Action from "webface/action/Action";
import PopupAction from "webface/action/PopupAction";

export default class TextPopupPanel {

    public static SIZE = 22;

    private composite: Composite = null;
    private editText: Text = null;
    private menuIcon: WebFontIcon = null;
    private onModify = (text: string) => { };
    private onCommit = (text: string) => { };
    private onCancel = () => { };
    private popupActions: (callback: (actions: Action[]) => void) => void = null;

    public createControl(parent: Composite, index?: number): void {

        this.composite = new Composite(parent, index);

        let element = this.composite.getElement();
        element.css("border", "1px solid #D8D8D8");
        element.css("border-radius", "3px");

        let layout = new GridLayout(2, 0, 0, 0, 0);
        this.composite.setLayout(layout);

        this.createTextLabel(this.composite);
        this.createMenuIcon(this.composite);
    }

    private createTextLabel(parent: Composite): void {

        this.editText = new Text(parent);

        let element = this.editText.getElement();
        element.css("text-indent", "5px");
        element.css("line-height", "inherit");
        element.css("border", "0px");

        let layoutData = new GridData(true, true);
        this.editText.setLayoutData(layoutData);

        // Key Enter -> commit
        element.on("keydown", (event: JQueryEventObject) => {

            if (event.which === 13) {
                this.commit();
            } else if (event.which === 27) {
                this.cancel();
            }

        });

        this.editText.onModify((value: string) => {
            this.onModify(value);
        });
    }

    public commit(): void {
        let value = this.editText.getText()
        this.onCommit(value);
    }

    private cancel(): void {
        this.onCancel();
    }

    private createMenuIcon(parent: Composite): void {

        this.menuIcon = new WebFontIcon(parent);
        this.menuIcon.addClasses("mdi", "mdi-menu-down");

        let element = this.menuIcon.getElement();
        element.css("border", 0);
        element.css("border-radius", 0);
        element.css("border-left", "1px solid #D8D8D8");
        element.css("padding", 0);
        element.css("color", "#888");
        element.css("line-height", TextPopupPanel.SIZE + "px");
        element.css("background-color", "#F4F4F4");
        element.css("font-size", TextPopupPanel.SIZE + "px");

        let layoutData = new GridData(TextPopupPanel.SIZE, true);
        this.menuIcon.setLayoutData(layoutData);

        this.menuIcon.addListener(webface.Selection, <Listener>{
            handleEvent: (event: Event) => {
                this.showPopup(event);
            }
        });

    }

    private showPopup(event: Event): void {
        if (this.popupActions !== null) {
            this.popupActions((actions: Action[]) => {
                let action = new TextPopupAction(actions);
                action.open(event);
            });
        }
    }

    public getLabelControl(): Text {
        return this.editText;
    }

    public getIconControl(): WebFontIcon {
        return this.menuIcon;
    }

    public setText(text: string): void {
        this.editText.setText(text);
    }

    public getText(): string {
        return this.editText.getText();
    }

    public setPopupActions(popupActions: (callback: (actions: Action[]) => void) => void): void {
        this.popupActions = popupActions;
    }

    public setOnChanged(callback: (text: string) => void): void {
        this.onCommit = callback;
    }

    public setEnabled(enabled: boolean): void {
        this.editText.setEnabled(enabled);
        this.menuIcon.setEnabled(enabled);
    }

    public getControl(): Control {
        return this.composite;
    }
}

class TextPopupAction extends PopupAction {

    private actions: Action[] = [];

    constructor(actions: Action[]) {
        super();
        this.actions = actions;
    }

    public getActions(): Action[] {
        return this.actions;
    }

}
