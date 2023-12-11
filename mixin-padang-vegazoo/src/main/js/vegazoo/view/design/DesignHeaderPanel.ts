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
import Event from "webface/widgets/Event";
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import * as webface from "webface/webface";

import Conductor from "webface/wef/Conductor";
import ConductorPanel from "webface/wef/ConductorPanel";
import HeightAdjustablePart from "webface/wef/HeightAdjustablePart";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import BaseAction from "webface/wef/base/BaseAction";
import BasePopupAction from "webface/wef/base/BasePopupAction";

export default class DesignHeaderPanel extends ConductorPanel implements HeightAdjustablePart {

    public static HEIGHT = 24;
    public static ICON_WIDTH = 24;

    private composite: Composite = null;
    private textLabel: Label = null;
    private briefLabel: Label = null;
    private menuIcon: WebFontIcon = null;
    private actions: BaseAction[] = [];

    public createControl(parent: Composite, index: number): void {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("vegazoo-design-header-panel");

        let layout = new GridLayout(3, 0, 0, 0, 0);
        this.composite.setLayout(layout);

        this.createTextLabel(this.composite);
        this.createBriefLabel(this.composite);
        this.createMenuIcon(this.composite);
    }

    private createTextLabel(parent: Composite): void {

        this.textLabel = new Label(parent);

        let element = this.textLabel.getElement();
        element.css("line-height", DesignHeaderPanel.HEIGHT + "px");
        element.css("font-weight", "500");

        let layoutData = new GridData(true, true);
        this.textLabel.setLayoutData(layoutData);
    }

    private createBriefLabel(parent: Composite): void {

        this.briefLabel = new Label(parent);

        let element = this.briefLabel.getElement();
        element.css("color", "#888");
        element.css("line-height", DesignHeaderPanel.HEIGHT + "px");
        element.css("font-style", "italic");

        let layoutData = new GridData(true, true);
        this.briefLabel.setLayoutData(layoutData);
    }

    private createMenuIcon(parent: Composite): void {

        this.menuIcon = new WebFontIcon(parent);

        let size = DesignHeaderPanel.ICON_WIDTH;
        let element = this.menuIcon.getElement();
        element.css("color", "#888");
        element.css("font-size", size + "px");
        element.css("line-height", DesignHeaderPanel.HEIGHT + "px");

        // Layout data
        let layoutData = new GridData(size, true);
        this.menuIcon.setLayoutData(layoutData);

        this.menuIcon.addListener(webface.Selection, <Listener>{
            handleEvent: (event: Event) => {
                let action = new DesignHeaderPopupAction(this.conductor, this.actions);
                action.open(event);
            }
        });

    }

    public setText(text: string): void {
        this.textLabel.setText(text);
    }

    public setChannelsBrief(text: string): void {
        this.briefLabel.setText(text);
    }

    public setActions(actions: BaseAction[]): void {
        this.actions = actions;
    }

    public setMenuIcon(icon: string): void {
        this.menuIcon.removeClasses();
        this.menuIcon.addClasses("mdi", icon);
    }

    public adjustHeight(): number {
        return DesignHeaderPanel.HEIGHT;
    }

    public getControl(): Control {
        return this.composite;
    }

}

class DesignHeaderPopupAction extends BasePopupAction {

    private actions: BaseAction[] = [];

    constructor(conductor: Conductor, actions: BaseAction[]) {
        super(conductor);
        this.actions = actions;
    }

    public getActions(): BaseAction[] {
        return this.actions;
    }

}