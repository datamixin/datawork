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

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import ConductorView from "webface/wef/ConductorView";

import GridCompositeAdjuster from "webface/wef/util/GridCompositeAdjuster";

import CustomCompositePanel from "vegazoo/view/custom/CustomCompositePanel";
import ViceReferenceCheckPanel from "vegazoo/view/custom/ViceReferenceCheckPanel";

import ViceReferenceUsedSetRequest from "vegazoo/requests/custom/ViceReferenceUsedSetRequest";

export default class ViceReferenceCustomView extends ConductorView {

    private composite: Composite = null;
    private switchPanel = new ViceReferenceCheckPanel();
    private containerPanel = new CustomCompositePanel();

    public createControl(parent: Composite, index: number): void {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("vegazoo-vice-reference-custom-view");

        let layout = new GridLayout(1, 0, 0, 0, 0);
        this.composite.setLayout(layout);

        this.createSwitchPanel(this.composite);
        this.createContainerPanel(this.composite);

    }

    private createSwitchPanel(parent: Composite): void {

        this.switchPanel.createControl(parent);
        let control = this.switchPanel.getControl();

        let layoutData = new GridData(true, ViceReferenceCheckPanel.HEIGHT);
        control.setLayoutData(layoutData);

        this.switchPanel.onUsed((state: boolean) => {
            let request = new ViceReferenceUsedSetRequest(state);
            this.conductor.submit(request);
        });

    }

    private createContainerPanel(parent: Composite): void {

        this.containerPanel.createControl(parent);
        let control = this.containerPanel.getControl();

        let layoutData = new GridData(true, true);
        control.setLayoutData(layoutData);

    }

    public adjustHeight(): number {
        let part = new GridCompositeAdjuster(this.composite);
        return part.adjustHeight();
    }

    public setName(name: string): void {
        this.switchPanel.setName(name);
    }

    public setUsed(used: boolean): void {
        this.switchPanel.setUsed(used);
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
