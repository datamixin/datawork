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
import Panel from "webface/wef/Panel";
import ConductorView from "webface/wef/ConductorView";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";
import Scrollable from "webface/widgets/Scrollable";

import HeightAdjustablePart from "webface/wef/HeightAdjustablePart";

import ElementPanel from "padang/view/ElementPanel";
import ElementListPanel from "padang/view/ElementListPanel";

export default class ScrollableListPanel implements Panel, HeightAdjustablePart {

    private scrollable: Scrollable = null;
    private listPanel: ElementListPanel = null;

    constructor(itemHeight?: number, verticalSpacing?: number, marginWidth?: number, marginHeight?: number) {
        this.listPanel = new ElementListPanel(itemHeight, verticalSpacing, marginWidth, marginHeight);
    }

    public createControl(parent: Composite, index?: number): void {

        this.scrollable = new Scrollable(parent);
        this.scrollable.setExpandHorizontal(true);
        this.scrollable.setData(this);

        let element = this.scrollable.getElement();
        element.addClass("padang-scrollable-list-panel");

        this.createListPanel(this.scrollable);

    }

    private createListPanel(parent: Scrollable): void {

        this.listPanel.createControl(parent);

        let control = this.listPanel.getControl();
        this.scrollable.setContent(control);
    }

    public setOnNewPanel(callback: (child: ConductorView) => ElementPanel): void {
        this.listPanel.setOnNewPanel(callback);
    }

    public setOnPostNew(callback: (panel: ElementPanel) => void): void {
        this.listPanel.setOnPostNew(callback);
    }

    public adjustHeight(): number {
        let height = this.listPanel.adjustHeight();
        this.scrollable.setMinHeight(height);
        this.scrollable.relayout();
        return height;
    }

    public getSize(): number {
        return this.listPanel.getSize();
    }

    public getListControl(): Control {
        return this.listPanel.getControl();
    }

    public getControl(): Control {
        return this.scrollable;
    }

    public addView(child: ConductorView, index: number): void {
        this.listPanel.addView(child, index);
    }

    public moveView(child: ConductorView, index: number): void {
        this.listPanel.moveView(child, index);
    }

    public removeView(child: ConductorView): void {
        this.listPanel.removeView(child);
    }

}