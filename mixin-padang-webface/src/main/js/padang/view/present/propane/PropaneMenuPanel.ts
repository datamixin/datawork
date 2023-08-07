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
import GroupAction from "webface/action/GroupAction";

import Event from "webface/widgets/Event";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import Conductor from "webface/wef/Conductor";
import ConductorPanel from "webface/wef/ConductorPanel";

import * as view from "padang/view/view";
import ViewPopupAction from "padang/view/ViewPopupAction";

export default class PropaneMenuPanel extends ConductorPanel {

    private icon: WebFontIcon = null;
    private action: GroupAction = null;

    constructor(conductor: Conductor, action: GroupAction) {
        super(conductor);
        this.action = action;
    }

    public createControl(parent: Composite, index?: number): void {

        this.icon = new WebFontIcon(parent);
        this.icon.addClasses("mdi", "mdi-menu-down");

        let element = this.icon.getElement();
        element.css("font-size", "24px");
        element.css("line-height", "inherit");
        view.setGridData(this.icon, 16, true);

        this.icon.onSelection((event: Event) => {
            let actions = this.action.getActions();
            if (actions.length > 0) {
                event.eventObject.stopPropagation();
                let action = new ViewPopupAction(actions);
                action.open(event);
            }
        });
    }

    public getControl(): Control {
        return this.icon;
    }

}