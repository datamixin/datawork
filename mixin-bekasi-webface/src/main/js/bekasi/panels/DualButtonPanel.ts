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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridData from "webface/layout/GridData";
import GridLayout from "webface/layout/GridLayout";

import ButtonPanel from "bekasi/panels/ButtonPanel";

export default class DualButtonMenuPanel {

    private composite: Composite = null;

    private leftPanel: ButtonPanel = null;
    private rightPanel: ButtonPanel = null;

    constructor(
        leftText: string, leftIcon: string, leftClass: string,
        rightText: string, rightIcon: string, rightClass: string) {
        this.leftPanel = new ButtonPanel(leftText, leftIcon, leftClass);
        this.rightPanel = new ButtonPanel(rightText, rightIcon, rightClass);
    }

    public createControl(parent: Composite): void {

        this.composite = new Composite(parent);

        let element = this.composite.getElement();
        element.addClass("bekasi-dual-button-panel");

        let layout = new GridLayout(2, 0, 0, 10, 0);
        this.composite.setLayout(layout);

        this.createLeftPanel(this.composite);
        this.createRightPanel(this.composite);
    }

    private createLeftPanel(parent: Composite): void {

        this.leftPanel.createControl(parent);
        let control = this.leftPanel.getControl();

        let layoutData = new GridData(true, true);
        control.setLayoutData(layoutData);

    }

    private createRightPanel(parent: Composite): void {

        this.rightPanel.createControl(parent);
        let control = this.rightPanel.getControl();

        let layoutData = new GridData(true, true);
        control.setLayoutData(layoutData);

    }

    public onLeftSelection(callback: () => void): void {
        this.leftPanel.onSelection(callback);
    }

    public onRightSelection(callback: () => void): void {
        this.rightPanel.onSelection(callback);
    }

    public setLeftText(text: string): void {
        this.leftPanel.setText(text);
    }

    public setRightText(text: string): void {
        this.rightPanel.setText(text);
    }

    public getControl(): Control {
        return this.composite;
    }

}

