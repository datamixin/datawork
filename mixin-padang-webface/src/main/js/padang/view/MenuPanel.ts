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

import Action from "webface/action/Action";
import GroupAction from "webface/action/GroupAction";

import * as view from "padang/view/view";
import IconPanel from "padang/view/IconPanel";
import ViewPopupAction from "padang/view/ViewPopupAction";

export default class MenuPanel {

    private iconPanel = new IconPanel();
    private actions: GroupAction | Action[] = [];

    public createControl(parent: Composite, index?: number): void {

        this.iconPanel.createControl(parent, index);
        this.iconPanel.setIcon("mdi-menu-down");
        this.iconPanel.setOnSelection((event: Event) => {
            let action = new ViewPopupAction(this.actions);
            action.open(event);
        });
        view.css(this.iconPanel, "cursor", "pointer");
    }

    public setIcon(icon: string): void {
        this.iconPanel.setIcon(icon);
    }

    public setColor(color: string): void {
        this.iconPanel.setColor(color);
    }

    public setEnabled(enabled: boolean): void {
        this.iconPanel.setEnabled(enabled);
    }

    public setVisible(visible: boolean): void {
        this.iconPanel.setVisible(visible);
    }

    public setActions(actions: GroupAction | Action[]): void {
        this.actions = actions;
    }

    public getControl(): Control {
        return this.iconPanel.getControl();
    }

}
