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

import GridLayout from "webface/layout/GridLayout";

import HeightAdjustablePart from "webface/wef/HeightAdjustablePart";

import * as view from "padang/view/view";
import IconPanel from "padang/view/IconPanel";
import NamePanel from "padang/view/NamePanel";

export default class IconNamePanel implements HeightAdjustablePart {

    private static HEIGHT = 30;
    private static ICON_WIDTH = 24;

    private composite: Composite = null;
    private iconPanel = new IconPanel();
    private namePanel = new NamePanel();

    public createControl(parent: Composite, index?: number) {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("padang-icon-name-panel");

        let layout = new GridLayout(2, 0, 0, 0, 0);
        layout.marginLeft = 5;
        this.composite.setLayout(layout);

        this.createIconPanel(this.composite);
        this.createNamePanel(this.composite);

    }

    private createIconPanel(parent: Composite): void {
        this.iconPanel.createControl(parent);
        view.setGridData(this.iconPanel, IconNamePanel.ICON_WIDTH, true);
    }

    private createNamePanel(parent: Composite): void {
        this.namePanel.createControl(parent);
        view.setGridData(this.namePanel, true, true);
    }

    public setIcon(icon: string): void {
        this.iconPanel.setIcon(icon);
    }

    public setColor(color: string): void {
        view.css(this.namePanel, "color", color);
        view.css(this.iconPanel, "color", color);
    }

    public setName(name: string): void {
        this.namePanel.setName(name);
    }

    public getName(): string {
        return this.namePanel.getName();
    }

    public setOnNameChanged(callback: (newName: string, oldName: string,
        confirm: (success: boolean) => void) => void): void {
        this.namePanel.setOnNameChanged(callback);
    }

    public adjustHeight(): number {
        return IconNamePanel.HEIGHT;
    }

    public adjustWidth(): number {
        let width = this.namePanel.adjustHeight();
        let layout = <GridLayout>this.composite.getLayout();
        width += layout.marginLeft;
        return width + IconNamePanel.ICON_WIDTH;
    }

    public getControl(): Control {
        return this.composite;
    }

}
