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
import Event from "webface/widgets/Event";
import Control from "webface/widgets/Control";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import Image from "webface/graphics/Image";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import Action from "webface/action/Action";
import PopupAction from "webface/action/PopupAction";

export default class LabelPopupPanel {

    public static SIZE = 22;

    private composite: Composite = null;
    private textLabel: Label = null;
    private menuIcon: WebFontIcon = null;
    private labelChanged: (text: string) => void = null;
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

        this.textLabel = new Label(parent);

        let element = this.textLabel.getElement();
        element.css("text-indent", "5px");
        element.css("line-height", "inherit");

        let layoutData = new GridData(true, true);
        this.textLabel.setLayoutData(layoutData);

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
        element.css("line-height", LabelPopupPanel.SIZE + "px");
        element.css("background-color", "#F4F4F4");
        element.css("font-size", LabelPopupPanel.SIZE + "px");

        let layoutData = new GridData(LabelPopupPanel.SIZE, true);
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
                let action = new LabelPopupAction(actions, this.textLabel, this.labelChanged);
                action.open(event);
            });
        }
    }

    public getLabelControl(): Label {
        return this.textLabel;
    }

    public getIconControl(): WebFontIcon {
        return this.menuIcon;
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

    public setPopupActions(popupActions: (callback: (actions: Action[]) => void) => void): void {
        this.popupActions = popupActions;
    }

    public onLabelChanged(callback: (text: string) => void): void {
        this.labelChanged = callback;
    }

    public setEnabled(enabled: boolean): void {
        this.textLabel.setEnabled(enabled);
        this.menuIcon.setEnabled(enabled);
    }

    public getControl(): Control {
        return this.composite;
    }
}

class LabelPopupAction extends PopupAction {

    private actions: Action[] = [];
    private label: Label = null;
    private callback: (text: string) => void = null;

    constructor(actions: Action[], label: Label, callback: (text: string) => void) {
        super();
        this.actions = actions;
        this.label = label;
        this.callback = callback;
    }

    public getActions(): Action[] {
        let actions: Action[] = [];
        for (let i = 0; i < this.actions.length; i++) {
            let action = new LabelAction(this.actions[i], this.label, this.callback);
            actions.push(action);
        }
        return actions;
    }

}


class LabelAction extends Action {

    private action: Action = null;
    private label: Label = null;
    private callback: (text: string) => void = null;

    constructor(action: Action, label: Label, callback: (text: string) => void) {
        super();
        this.action = action;
        this.label = label;
        this.callback = callback;
    }

    public getText(): string {
        return this.action.getText();
    }

    public getImage(): Image {
        return this.action.getImage();
    }

    public run(): void {
        this.action.run();
        let text = this.label.getText();
        if (this.callback !== null) {
            this.callback(text);
        }
    }
}