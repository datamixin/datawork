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

import LabelTextPanel from "webface/ui/LabelTextPanel";

import CustomNameBasePanel from "vegazoo/view/custom/CustomNameBasePanel";

export default class CustomNameTextPanel extends CustomNameBasePanel {

    public static HEIGHT = 24;
    public static NAME_WIDTH = 100;

    private textPanel = new LabelTextPanel();

    protected createValueControl(parent: Composite): void {
     this.textPanel.createControl(parent);
        this.textPanel.setEditOnFocus(true);
        let control = this.textPanel.getControl();

        let element = control.getElement();
        element.css("background-color", "#FFF");
        element.css("line-height", (CustomNameTextPanel.HEIGHT - 2) + "px");
        element.css("border", "1px solid #E8E8E8");
    }

    public setValue(value: string): void {
        this.textPanel.setText(value);
    }

    public onCommit(callback: (newText: string, oldText: string) => void): void {
        this.textPanel.onCommit(callback);
    }

    public getValueControl(): Control {
        return this.textPanel.getControl();
    }

}