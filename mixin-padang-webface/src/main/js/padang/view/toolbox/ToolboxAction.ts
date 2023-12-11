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
import Action from "webface/action/Action";

import WebFontImage from "webface/graphics/WebFontImage";

export default class ToolboxAction extends Action {

    private icon: string = null;
    private tooltip: string = null;
    private callback = () => { };

    constructor(text: string, icon: string, tooltip: string, callback: () => void) {
        super(text);
        this.icon = icon;
        this.tooltip = tooltip;
        this.callback = callback;
    }

    public getImage(): WebFontImage {
        if (this.icon !== null) {
            return new WebFontImage("mdi", this.icon);
        } else {
            return null;
        }
    }

    public getTooltip(): string {
        return this.tooltip;
    }

    public run(): void {
        this.callback();
    }

}