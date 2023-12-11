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

import BaseAction from "webface/wef/base/BaseAction";

import LabelPopupPanel from "webface/ui/LabelPopupPanel";

import CustomNameBasePanel from "vegazoo/view/custom/CustomNameBasePanel";

export default class CustomNamePopupPanel extends CustomNameBasePanel {

    public static HEIGHT = 24;
    public static NAME_WIDTH = 100;

    private popupPanel: LabelPopupPanel = null;
    private popupActions: () => BaseAction[] = () => { return [] };

    protected createValueControl(parent: Composite): void {

        this.popupPanel = new LabelPopupPanel();
        this.popupPanel.createControl(parent);

        let control = this.popupPanel.getLabelControl();
        let element = control.getElement();
        element.css("line-height", (CustomNamePopupPanel.HEIGHT - 2) + "px");
        element.css("background-color", "#FFF");

        this.popupPanel.setPopupActions((callback: (actions: BaseAction[]) => void) => {
            callback(this.popupActions());
        });
    }

    public setValue(value: string): void {
        this.popupPanel.setText(value);
    }

    public setActions(popupActions: () => BaseAction[]): void {
        this.popupActions = popupActions;
    }

    protected getValueControl(): Control {
        return this.popupPanel.getControl();
    }

}