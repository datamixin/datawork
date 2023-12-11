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
import Popup from "webface/popup/Popup";
import PopupStyle from "webface/popup/PopupStyle";
import FlexiblePopup from "webface/popup/FlexiblePopup";

import * as util from "webface/functions";

import Label from "webface/widgets/Label";
import Event from "webface/widgets/Event";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";
import * as functions from "webface/widgets/functions";

import * as webface from "webface/webface";

import Action from "webface/action/Action";

import Image from "webface/graphics/Image";
import WebFontImage from "webface/graphics/WebFontImage";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import GroupAction from "webface/action/GroupAction";
import CascadeAction from "webface/action/CascadeAction";
import SeparatorAction from "webface/action/SeparatorAction";

export default class MenuPopup extends FlexiblePopup {

    public static ITEM_HEIGHT = 28;
    public static ICON_WIDTH = 20;

    public static SEPARATOR_HEIGHT = 1;
    public static MIN_WIDTH = 120;

    private action: GroupAction;
    private width = MenuPopup.MIN_WIDTH;

    constructor(action: GroupAction, style?: PopupStyle) {
        super(style);
        this.action = action;
    }

    public setAction(action: GroupAction): void {
        this.action = action;
    }

    public getAction(): GroupAction {
        return this.action;
    }

    public createControl(parent: Composite) {

        // Composite penampung daftar action
        let composite = new Composite(parent);

        // Composite layout
        let layout = new GridLayout(1, 0, 0, 0, 0);
        composite.setLayout(layout);

        // Tampilkan semua action agar dapat dipilih
        let actions = this.action.getActions();
        for (var i = 0; i < actions.length; i++) {

            let action = actions[i];
            if (action.isVisible() === false) {
                continue;
            }

            // Container untuk setiap action
            let container = this.createActionContainer(composite, action);

            // Action container data
            let containerData = new GridData(true);

            if (action instanceof SeparatorAction) {
                new Label(container);
                containerData.heightHint = MenuPopup.SEPARATOR_HEIGHT;
                container.setLayoutData(containerData);
                continue;
            } else {
                containerData.heightHint = MenuPopup.ITEM_HEIGHT;
                container.setLayoutData(containerData);
            }

            // Action label
            let text = action.getText();
            let label: Label = null;

            // Calculate required width
            let element = composite.getElement();
            let width = util.measureTextWidth(element, text);
            this.width = Math.max(width, this.width);

            // Label data
            let labelData = new GridData();
            labelData.grabExcessVerticalSpace = true;

            // Atur tinggi action label
            if (action instanceof ParentAction) {

                // Cascade action ada tanda panah ke kanan
                this.createCevron(container, "mdi-chevron-left");
                let parentAction = <ParentAction>action;
                let listener = new PopupPopulateListener(this, parent, parentAction, false);
                container.addListener(webface.Selection, listener);

                // Label di sebelah kanan
                label = this.createLabel(container, text);

            } else {

                let image = action.getImage();

                this.createActionImage(container, image);

                // Label di sebelah kiri
                label = this.createLabel(container, text);

                if (action instanceof CascadeAction) {

                    // Cascade action ada tanda panah ke kanan
                    this.createCevron(container, "mdi-chevron-right");
                    let cascade = <CascadeAction>action;
                    let groupAction = new PopupCascadeAction(this.getAction(), cascade);
                    let listener = new PopupPopulateListener(this, parent, groupAction, true);
                    container.addListener(webface.Selection, listener);
                } else {

                    let actionListener = new ActionListener(this, action);
                    container.addListener(webface.Selection, actionListener);

                }
                labelData.grabExcessHorizontalSpace = true;
            }

            label.setLayoutData(labelData);

        }
    }

    public repopulate(parent: Composite, action: GroupAction, close: boolean): void {

        // Berikan action baru
        this.setAction(action);

        // Bangun kembali isi parent
        functions.repopulateSlide(parent, close, () => {
            this.createControl(parent);
            this.layout();
        });
    }

    private createActionContainer(parent: Composite, action: Action): Composite {

        let container = new Composite(parent);

        let element = container.getElement();
        if (action instanceof SeparatorAction) {
            element.addClass("menu-popup-separator");
        } else {
            element.addClass("menu-popup-action");
        }

        // Layout
        let layout = new GridLayout(3, 2, 5, 3, 0);
        container.setLayout(layout);

        return container;
    }

    private createLabel(parent: Composite, text: string): Label {

        let label = new Label(parent);
        label.setText(text);

        let element = label.getElement();
        element.css("color", "#444");
        element.css("line-height", "18px");

        return label;
    }

    private createActionImage(parent: Composite, image: Image): void {

        // Arrow image
        let label = new Label(parent);
        let element = label.getElement();
        element.css("color", "#444");
        element.css("font-size", "18px");
        element.css("line-height", "18px");
        if (image !== null) {
            functions.appendImage(element, image);
        }

        // Layout data
        let layoutData = new GridData(MenuPopup.ICON_WIDTH, true);
        layoutData.horizontalIndent = 4;
        label.setLayoutData(layoutData);
    }

    private createCevron(parent: Composite, icon: string): void {

        // Arrow label
        let label = new Label(parent);
        let image = new WebFontImage("mdi", icon);
        let element = label.getElement();
        element.css("font-size", "20px");
        element.css("line-height", "18px");
        functions.appendImage(element, image);

        // Layout data
        let layoutData = new GridData(MenuPopup.ICON_WIDTH, true);
        label.setLayoutData(layoutData);

    }

    public getWidth(): number {
        return this.width + MenuPopup.ICON_WIDTH * 2;
    }

    public getHeight(): number {
        let actions = this.action.getActions();
        let height = 0;
        for (var i = 0; i < actions.length; i++) {
            let action = actions[i];
            if (action.isVisible() === false) {
                continue;
            }
            if (action instanceof SeparatorAction) {
                height += MenuPopup.SEPARATOR_HEIGHT;
            } else {
                height += MenuPopup.ITEM_HEIGHT;
            }
        }
        return height;
    }

}

class PopupPopulateListener implements Listener {

    private popup: MenuPopup;
    private parent: Composite;
    private action: GroupAction;
    private close: boolean;

    constructor(popup: MenuPopup, parent: Composite, action: GroupAction, close: boolean) {
        this.popup = popup;
        this.parent = parent;
        this.action = action;
        this.close = close;
    }

    public handleEvent(event: Event): void {

        // Stop propagation
        let eventObject = event.eventObject;
        eventObject.stopPropagation();

        this.popup.repopulate(this.parent, this.action, this.close);
    }
}

class ActionListener implements Listener {

    private popup: Popup;
    private action: Action;

    constructor(popup: Popup, action: Action) {
        this.popup = popup;
        this.action = action;
    }

    public handleEvent(event: Event): void {
        this.popup.close();
        this.action.run();
    }
}

class PopupCascadeAction extends GroupAction {

    private parentAction: GroupAction;
    private cascadeAction: CascadeAction;

    constructor(parentAction: GroupAction, action: CascadeAction) {
        super();
        this.parentAction = parentAction;
        this.cascadeAction = action;
    }

    public getActions(): Action[] {

        let actions: Action[] = [];

        // Action pertama untuk kembali ke parent
        let parentAction = new ParentAction(this.parentAction);
        actions.push(parentAction);

        // Action berikutnya adalah dari action di cascade
        let cascadeActions = this.cascadeAction.getActions();
        for (var i = 0; i < cascadeActions.length; i++) {
            let action = cascadeActions[i];
            if (action.isVisible() === false) {
                continue;
            }
            actions.push(action);
        }
        return actions;
    }
}

class ParentAction extends GroupAction {

    private action: GroupAction;

    constructor(action: GroupAction) {
        super();
        this.action = action;
    }

    public getActions(): Action[] {
        return this.action.getActions();
    }

    public getText(): string {
        return this.action.getText();
    }
}

