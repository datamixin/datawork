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
import Conductor from "webface/wef/Conductor";
import ConductorView from "webface/wef/ConductorView";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import BaseAction from "webface/wef/base/BaseAction";

import WebFontImage from "webface/graphics/WebFontImage";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import DesignHeaderPanel from "vegazoo/view/design/DesignHeaderPanel";

import EncodingChannelApplyRequest from "vegazoo/requests/design/EncodingChannelApplyRequest";

export default class EncodingDesignView extends ConductorView {

    public static ICON_WIDTH = 24;

    private composite: Composite = null;
    private headerPanel: DesignHeaderPanel = null;
    private container: Composite = null;
    private channelApplyActions: EncodingChannelApplyAction[] = [];

    public createControl(parent: Composite, index: number): void {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("vegazoo-encoding-design-view");

        let layout = new GridLayout(1, 0, 0, 0, 0);
        this.composite.setLayout(layout);

        this.createHeaderPanel(this.composite);
        this.createContainer(this.composite);
    }

    private createHeaderPanel(parent: Composite): void {

        this.headerPanel = new DesignHeaderPanel(this.conductor);
        this.headerPanel.createControl(parent, 0);
        this.headerPanel.setText("Encoding");
        this.headerPanel.setMenuIcon("mdi-format-list-checks");

        let control = this.headerPanel.getControl();
        let layoutData = new GridData(true, DesignHeaderPanel.HEIGHT);
        control.setLayoutData(layoutData);
    }

    private createContainer(parent: Composite): void {

        this.container = new Composite(parent);

        let element = this.container.getElement();
        element.addClass("vegazoo-encoding-design-container");

        let layout = new GridLayout(1, 0, 0, 0, 5);
        this.container.setLayout(layout);

        let layoutData = new GridData(true, true);
        this.container.setLayoutData(layoutData);

    }

    public setUsableChannels(channels: string[]): void {
        this.channelApplyActions = [];
        for (let feature of channels) {
            let action = new EncodingChannelApplyAction(this.conductor, feature);
            this.channelApplyActions.push(action);
        }
        this.headerPanel.setActions(this.channelApplyActions);
    }

    public setAppliedChannels(channels: string[]): void {
        for (let action of this.channelApplyActions) {
            let channel = action.getChannel();
            if (channels.indexOf(channel) !== -1) {
                action.setApplied(true);
            }
        }
    }

    public setChannelsBrief(brief: string): void {
        this.headerPanel.setChannelsBrief(brief);
    }

    public adjustHeight(): number {
        let height = DesignHeaderPanel.HEIGHT;
        let part = new GridCompositeAdjuster(this.container);
        height += part.adjustHeight();
        return height;
    }

    public getControl(): Control {
        return this.composite;
    }

    public addView(child: ConductorView, index: number): void {

        child.createControl(this.container, index);
        let control = child.getControl();
        control.setData(child);

        let layoutData = new GridData(true, 0);
        control.setLayoutData(layoutData);
    }

    public moveView(child: ConductorView, index: number): void {

        let control = child.getControl();
        this.container.moveControl(control, index);
    }

    public removeView(child: ConductorView): void {
        let control = child.getControl();
        control.dispose();
    }

}

class EncodingChannelApplyAction extends BaseAction {

    private channel: string = null;
    private applied: boolean = false;

    constructor(conductor: Conductor, feature: string) {
        super(conductor);
        this.channel = feature;
    }

    public getChannel(): string {
        return this.channel;
    }

    public getText(): string {
        let firstChar = this.channel[0].toUpperCase();
        return firstChar + this.channel.substr(1);
    }

    public getImage(): WebFontImage {
        return new WebFontImage("mdi", this.applied ? "mdi-check" : "mdi-blank");
    }

    public setApplied(applied: boolean): void {
        this.applied = applied;
    }

    public run(): void {
        let request = new EncodingChannelApplyRequest(this.channel, !this.applied);
        this.conductor.submit(request);
    }

}
