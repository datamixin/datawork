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

import Conductor from "webface/wef/Conductor";
import ConductorPanel from "webface/wef/ConductorPanel";

import WebFontImage from "webface/graphics/WebFontImage";

import ToolboxIconPanel from "padang/view/toolbox/ToolboxIconPanel";
import ToolboxGroupPanel from "padang/view/toolbox/ToolboxGroupPanel";
import ToolboxToolbarPanel from "padang/view/toolbox/ToolboxToolbarPanel";
import ToolboxSeparatorPanel from "padang/view/toolbox/ToolboxSeparatorPanel";

export default class GroupToolbarPanel extends ConductorPanel {

    private text: string = null;
    private separator?: boolean = null;
    private toolbarPanel: ToolboxToolbarPanel = null;
    private groupPanel: ToolboxGroupPanel = null;

    constructor(conductor: Conductor, text: string, separator?: boolean) {
        super(conductor);
        this.text = text;
        this.separator = separator;
    }

    public createControl(parent: Composite, index?: number): void {
        this.toolbarPanel = new ToolboxToolbarPanel();
        this.toolbarPanel.createControl(parent, index);
        this.createGroupPanel(this.toolbarPanel)
    }

    private createGroupPanel(parent: ToolboxToolbarPanel): void {
        this.groupPanel = new ToolboxGroupPanel(this.text);
        parent.addPanel(this.groupPanel);
        if (this.separator === true) {
            let separator = new ToolboxSeparatorPanel();
            parent.addPanel(separator);
        }
    }

    public clearIcons(): void {
        this.groupPanel.clear();
    }

    public createIcon(icon: string | WebFontImage, title: string, callback: () => void): ToolboxIconPanel {
        let panel = new ToolboxIconPanel(icon, title);
        this.groupPanel.addPanel(panel);
        panel.onSelection(callback);
        return panel;
    }

    public adjustWidth(): number {
        let groupWidth = this.groupPanel.adjustWidth();
        let toolbarWidth = this.toolbarPanel.adjustWidth();
        return Math.max(groupWidth, toolbarWidth);
    }

    public getControl(): Control {
        return this.toolbarPanel.getControl();
    }

}
