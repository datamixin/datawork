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
import Event from "webface/widgets/Event";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridLayout from "webface/layout/GridLayout";

import ConductorView from "webface/wef/ConductorView";
import HeightAdjustablePart from "webface/wef/HeightAdjustablePart";

import * as view from "padang/view/view";
import ElementPanel from "padang/view/ElementPanel";
import LabelIconPanel from "padang/view/LabelIconPanel";

export default class UpsideElementPanel implements ElementPanel {

    private static HEADER_HEIGHT = 24;

    private composite: Composite = null;
    private headerPanel = new LabelIconPanel();
    private view: ConductorView = null;
    private onLabel = (index: number): string => { return <any>index; };

    constructor(view: ConductorView) {
        this.view = view;
    }

    public getView(): ConductorView {
        return this.view;
    }

    public createControl(parent: Composite, index: number) {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("padang-upside-element-view");

        let layout = new GridLayout(1, 0, 0);
        this.composite.setLayout(layout);

        this.createHeaderPanel(this.composite);
        this.createElementView(this.composite);
    }

    private createHeaderPanel(parent: Composite): void {
        this.headerPanel.createControl(parent);
        let control = this.headerPanel.getControl();
        let element = control.getElement();
        element.css("color", "#888");
        element.css("font-style", "italic");
        element.css("line-height", UpsideElementPanel.HEADER_HEIGHT + "px");
        view.setGridData(this.headerPanel, true, UpsideElementPanel.HEADER_HEIGHT);
    }

    private createElementView(parent: Composite): void {
        this.view.createControl(parent, 1);
        view.setGridData(this.view, true, true);
    }

    private getIndex(): number {
        let parent = this.composite.getParent();
        let children = parent.getChildren();
        let index = children.indexOf(this.composite);
        return index;
    }

    public setOnLabel(callback: (index: number) => string): void {
        this.onLabel = callback;
    }

    public setIcon(icon: string): void {
        this.headerPanel.setIcon(icon);
    }

    public setOnIconSelection(callback: (index: number, event: Event) => void) {
        this.headerPanel.setOnIconSelection((event: Event) => {
            let index = this.getIndex();
            callback(index, event);
        });
    }

    public updateLabel(): void {
        let index = this.getIndex();
        let label = this.onLabel(index);
        this.headerPanel.setLabel(label);
    }

    public adjustHeight(): number {
        let height = view.getGridLayoutHeight(this.composite, [UpsideElementPanel.HEADER_HEIGHT]);
        height += (<HeightAdjustablePart><any>this.view).adjustHeight();
        return height;
    }

    public getControl(): Control {
        return this.composite;
    }

}
