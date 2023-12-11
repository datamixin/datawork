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
import Label from "webface/widgets/Label";
import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import ToolboxToolPanel from "padang/view/toolbox/ToolboxToolPanel";

export default class ToolboxSeparatorPanel extends ToolboxToolPanel {

    public static WIDTH = 2;
    public static HEIGHT = 48;

    private label: Label = null;

    public createControl(parent: Composite): void {

        this.label = new Label(parent);

        let element = this.label.getElement();
        element.css("border-right", "1px solid #FFFFFF");
        element.css("border-left", "1px solid #D8D8D8");
        element.css("line-height", (ToolboxSeparatorPanel.HEIGHT) + "px");

    }

    public adjustWidth(): number {
        return ToolboxSeparatorPanel.WIDTH;
    }

    public getControl(): Control {
        return this.label;
    }

}