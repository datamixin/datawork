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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import Conductor from "webface/wef/Conductor";
import ConductorView from "webface/wef/ConductorView";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import CustomHeaderPanel from "vegazoo/view/custom/CustomHeaderPanel";
import CustomCompositePanel from "vegazoo/view/custom/CustomCompositePanel";

export abstract class ObjectDefCustomView extends ConductorView {

    private static CONTAINER_VERTICAL_INDENT = 10;

    private composite: Composite = null;
    private header: boolean = false;
    private headerText: string = null;
    private headerPanel = new CustomHeaderPanel();
    private contentPanel = new CustomCompositePanel();
    private containerPanel = new CustomCompositePanel();

    constructor(conductor: Conductor, header?: boolean, headerText?: string) {
        super(conductor);
        this.header = header === undefined ? false : header;
        this.headerText = headerText === undefined ? null : headerText;
    }

    public createControl(parent: Composite, index: number): void {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("vegazoo-object-def-custom-view");

        let layout = new GridLayout(1, 0, 0, 0, 0);
        this.composite.setLayout(layout);

        if (this.header === true) {
            this.createHeaderPanel(this.composite);
        }
        this.createContentPanel(this.composite);
        this.createContainerPanel(this.composite);

    }

    private createHeaderPanel(parent: Composite): void {

        this.headerPanel.createControl(parent);
        this.headerPanel.setText(this.headerText);

        let control = this.headerPanel.getControl();
        let layoutData = new GridData(true, CustomHeaderPanel.HEIGHT);
        control.setLayoutData(layoutData);

    }

    private createContentPanel(parent: Composite): void {

        this.contentPanel.createControl(parent);
        let control = this.contentPanel.getControl();

        let layoutData = new GridData(true, 0);
        control.setLayoutData(layoutData);

        this.addContentPanels(this.contentPanel);

    }

    protected abstract addContentPanels(panel: CustomCompositePanel): void;

    private createContainerPanel(parent: Composite): void {

        this.containerPanel.createControl(parent);
        let control = this.containerPanel.getControl();

        let layoutData = new GridData(true, 0);
        layoutData.verticalIndent = ObjectDefCustomView.CONTAINER_VERTICAL_INDENT;
        control.setLayoutData(layoutData);

    }

    public setHeaderText(name: string): void {
        this.headerPanel.setText(name);
    }

    public adjustHeight(): number {
        let part = new GridCompositeAdjuster(this.composite);
        let height = part.adjustHeight();
        height += ObjectDefCustomView.CONTAINER_VERTICAL_INDENT;
        return height;
    }

    public relayout(): void {
        this.adjustHeight();
    }

    public getControl(): Control {
        return this.composite;
    }

    public addView(child: ConductorView, index: number): void {
        this.containerPanel.addPanel(child, index);
    }

    public removeView(child: ConductorView): void {
        this.containerPanel.removePanel(child);
    }

}

export default ObjectDefCustomView;
