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
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import GridLayout from "webface/layout/GridLayout";

import HeightAdjustablePart from "webface/wef/HeightAdjustablePart";

import * as view from "padang/view/view";
import IconPanel from "padang/view/IconPanel";
import IconLabelPanel from "padang/view/IconLabelPanel";

export default class IconLabelIconPanel implements HeightAdjustablePart {

    private static HEIGHT = 30;
    private static MENU_WIDTH = 30;

    private composite: Composite = null;
    private labelPanel = new IconLabelPanel();
    private iconPanel = new IconPanel();
    private onSelection = () => { };
    private onActionSelection = (event: Event) => { };

    public createControl(parent: Composite, index?: number) {

        this.composite = new Composite(parent, index);
        this.composite.setData(this);

        let element = this.composite.getElement();
        element.addClass("padang-icon-name-menu-panel");

        let layout = new GridLayout(2, 0, 0, 0, 0);
        this.composite.setLayout(layout);

        this.createLabelPanel(this.composite);
        this.createIconPanel(this.composite);

        this.composite.onSelection(() => {
            this.onSelection();
        });
    }

    private createLabelPanel(parent: Composite): void {
        this.labelPanel.createControl(parent);
        view.setGridData(this.labelPanel, true, true);
    }

    private createIconPanel(parent: Composite): void {
        this.iconPanel.createControl(parent);
        this.iconPanel.setOnSelection((event: Event) => {
            this.onActionSelection(event);
        });
        view.css(this.iconPanel, "cursor", "pointer");
        view.setGridData(this.iconPanel, IconLabelIconPanel.MENU_WIDTH, true);
    }

    public setLabelIcon(icon: string): void {
        this.labelPanel.setIcon(icon);
    }

    public setActionIcon(icon: string): void {
        this.iconPanel.setIcon(icon);
    }

    public setLabel(name: string): void {
        this.labelPanel.setLabel(name);
    }

    public setSelection(callback: () => void): void {
        this.onSelection = callback;
    }

    public setOnActionSelection(callback: (event: Event) => void): void {
        this.onActionSelection = callback;
    }

    public setIconEnabled(enabled: boolean): void {
        this.iconPanel.setEnabled(enabled);
    }

    public adjustHeight(): number {
        return IconLabelIconPanel.HEIGHT;
    }

    public getControl(): Control {
        return this.composite;
    }

}
