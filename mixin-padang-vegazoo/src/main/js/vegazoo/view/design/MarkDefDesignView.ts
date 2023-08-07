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
import Label from "webface/widgets/Label";
import Event from "webface/widgets/Event";
import Control from "webface/widgets/Control";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import * as webface from "webface/webface";

import Conductor from "webface/wef/Conductor";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import BaseAction from "webface/wef/base/BaseAction";
import BasePopupAction from "webface/wef/base/BasePopupAction";

import WebFontImage from "webface/graphics/WebFontImage";

import ObjectDefDesignView from "vegazoo/view/design/ObjectDefDesignView";

import MarkDefTypeSetRequest from "vegazoo/requests/design/MarkDefTypeSetRequest";
import MarkDefSelectionRequest from "vegazoo/requests/design/MarkDefSelectionRequest";

export default class MarkDefDesignView extends ObjectDefDesignView {

    private static HEIGHT = 24;
    private static ICON_WIDTH = 24;
    private static BORDER_WIDTH = 2;
    private static LABEL_WIDTH = 54;

    private composite: Composite = null;
    private markLabel: Label = null;
    private templates: { [name: string]: string[] } = {};
    private typeIcon: WebFontIcon = null;
    private nameLabel: Label = null;
    private menuIcon: WebFontIcon = null;
    private actions: BaseAction[] = [];

    public createControl(parent: Composite, index?: number): void {

        this.composite = new Composite(parent);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("vegazoo-mark-def-design-view");
        element.css("background-color", "#E0E0E0");
        element.css("border", MarkDefDesignView.BORDER_WIDTH + "px solid transparent");

        let layout = new GridLayout(4, 0, 0, 0, 0);
        this.composite.setLayout(layout);

        let layoutData = new GridData(true, true);
        this.composite.setLayoutData(layoutData);

        this.createMarkLabel(this.composite);
        this.createTypeIcon(this.composite);
        this.createNameLabel(this.composite);
        this.createMenuIcon(this.composite);

        this.composite.onSelection((event: Event) => {
            event.eventObject.stopPropagation();
            let request = new MarkDefSelectionRequest();
            this.conductor.submit(request);
        });

    }

    private createTypeIcon(parent: Composite): void {
        this.typeIcon = this.createIcon(parent);
        let element = this.typeIcon.getElement();
        element.css("color", "#888");
        element.css("background", "#FFF");
    }

    private createMarkLabel(parent: Composite): void {

        this.markLabel = new Label(parent);
        this.markLabel.setText("Mark");

        let element = this.markLabel.getElement();
        element.css("line-height", MarkDefDesignView.HEIGHT + "px");
        element.css("background-color", "transparent");

        let layoutData = new GridData(MarkDefDesignView.LABEL_WIDTH, true);
        layoutData.horizontalIndent = 6;
        this.markLabel.setLayoutData(layoutData);

    }

    private createNameLabel(parent: Composite): void {

        this.nameLabel = new Label(parent);

        let element = this.nameLabel.getElement();
        element.css("line-height", MarkDefDesignView.HEIGHT + "px");
        element.css("background-color", "#FDFDFD");
        element.css("text-indent", "6px");

        let layoutData = new GridData(true, true);
        this.nameLabel.setLayoutData(layoutData);

    }

    private createIcon(parent: Composite): WebFontIcon {

        let icon = new WebFontIcon(parent);
        icon.addClass("mdi");

        let element = icon.getElement();
        element.css("color", "#888");
        element.css("font-size", "24px");
        element.css("text-align", "center");
        element.css("background-color", "#FFF");
        element.css("line-height", MarkDefDesignView.HEIGHT + "px");

        let layoutData = new GridData(MarkDefDesignView.ICON_WIDTH, true);
        icon.setLayoutData(layoutData);

        return icon;
    }

    private createMenuIcon(parent: Composite): void {

        this.menuIcon = this.createIcon(parent);
        this.menuIcon.addClass("mdi-menu-down");

        this.menuIcon.addListener(webface.Selection, <Listener>{
            handleEvent: (event: Event) => {
                let action = new MarkDefPopupAction(this.conductor, this.actions);
                action.open(event);
            }
        });
    }

    public setType(type: string): void {

        let pair = this.templates[type];
        let name = pair[0];
        this.nameLabel.setText(name);

        let icon = pair[1];
        this.typeIcon.removeClasses();
        this.typeIcon.addClasses("mdi", icon);
    }

    public setTemplates(templates: { [name: string]: string[] }): void {
        this.actions = [];
        let keys = Object.keys(templates);
        for (let key of keys) {
            let pair = templates[key];
            let name = pair[0];
            let icon = pair[1];
            let action = new MarkDefTypeSetAction(this.conductor, key, name, icon);
            this.actions.push(action);
        }
        this.templates = templates;
    }

    public onSelection(callback: () => void): void {
        this.composite.onSelection(callback);
    }

    public setSelected(selected: boolean): void {
        let element = this.composite.getElement();
        element.css("border-color", selected === true ? "#80bdff" : "transparent");
    }

    public adjustHeight(): number {
        return MarkDefDesignView.HEIGHT + MarkDefDesignView.BORDER_WIDTH * 2;
    }

    public getControl(): Control {
        return this.composite;
    }

}

class MarkDefPopupAction extends BasePopupAction {

    private typeSetActions: BaseAction[] = [];

    constructor(conductor: Conductor, typeSetActions: BaseAction[]) {
        super(conductor);
        this.typeSetActions = typeSetActions;
    }

    public getActions(): BaseAction[] {
        return this.typeSetActions;
    }

}

class MarkDefTypeSetAction extends BaseAction {

    private key: string = null;
    private name: string = null;
    private icon: string = null;

    constructor(conductor: Conductor, key: string, name: string, icon: string) {
        super(conductor);
        this.key = key;
        this.name = name;
        this.icon = icon;
    }

    public getText(): string {
        return this.name;
    }

    public getImage(): WebFontImage {
        return new WebFontImage("mdi", this.icon);
    }

    public run(): void {
        let request = new MarkDefTypeSetRequest(this.key);
        this.conductor.submit(request);
    }

}
