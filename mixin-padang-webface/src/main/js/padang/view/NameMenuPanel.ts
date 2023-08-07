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

import Action from "webface/action/Action";
import GroupAction from "webface/action/GroupAction";

import GridLayout from "webface/layout/GridLayout";

import HeightAdjustablePart from "webface/wef/HeightAdjustablePart";

import * as view from "padang/view/view";
import MenuPanel from "padang/view/MenuPanel";
import NamePanel from "padang/view/NamePanel";

export default class IconNameMenuPanel implements HeightAdjustablePart {

    private static HEIGHT = 30;

    private menuWidth: number = 24;
    private marginWidth: number = 0;
    private composite: Composite = null;
    private namePanel = new NamePanel();
    private menuPanel = new MenuPanel();
    private onSelection = () => { };

    constructor(menuWidth?: number, marginWidth?: number) {
        this.menuWidth = menuWidth === undefined ? this.menuWidth : menuWidth;
        this.marginWidth = marginWidth === undefined ? this.marginWidth : marginWidth;
    }

    public createControl(parent: Composite, index?: number) {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("padang-icon-name-menu-panel");

        let layout = new GridLayout(2, this.marginWidth, 0, 0, 0);
        this.composite.setLayout(layout);

        this.createNamePanel(this.composite);
        this.createMenuPanel(this.composite);

        this.composite.onSelection(() => {
            this.onSelection();
        });

    }

    private createNamePanel(parent: Composite): void {
        this.namePanel.createControl(parent);
        view.css(this.namePanel, "text-align", "inherit");
        view.setGridData(this.namePanel, true, true);
    }

    private createMenuPanel(parent: Composite): void {
        this.menuPanel.createControl(parent);
        view.setGridData(this.menuPanel, this.menuWidth, true);
    }

    public setMenuActions(actions: GroupAction | Action[]): void {
        this.menuPanel.setActions(actions);
    }

    public setMenuIcon(icon: string): void {
        this.menuPanel.setIcon(icon);
    }

    public setColor(color: string): void {
        this.namePanel.setColor(color);
        view.css(this.menuPanel, "color", color);
    }

    public setName(name: string): void {
        this.namePanel.setName(name);
    }

    public getName(): string {
        return this.namePanel.getName();
    }

    public setShowEdit(state: boolean): void {
        this.namePanel.setShowEdit(state);
    }

    public setOnNameChanged(callback: (newName: string, oldName: string,
        confirm: (success: boolean) => void) => void): void {
        this.namePanel.setOnNameChanged(callback);
    }

    public setOnSelection(callback: () => void): void {
        this.onSelection = callback;
        let element = this.composite.getElement();
        element.addClass("padang-icon-name-menu-panel-callback");
    }

    public setMenuEnabled(enabled: boolean): void {
        this.menuPanel.setEnabled(enabled);
    }

    public adjustHeight(): number {
        return IconNameMenuPanel.HEIGHT;
    }

    public adjustWidth(): number {
        let width = this.namePanel.adjustWidth();
        return width + this.menuWidth;
    }

    public getControl(): Control {
        return this.composite;
    }

}
