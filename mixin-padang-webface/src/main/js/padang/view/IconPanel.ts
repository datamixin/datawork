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
import * as webface from "webface/webface";

import Event from "webface/widgets/Event";
import Control from "webface/widgets/Control";
import Listener from "webface/widgets/Listener";
import Composite from "webface/widgets/Composite";
import WebFontIcon from "webface/widgets/WebFontIcon";

import * as view from "padang/view/view";

export default class IconPanel {

    private icon: WebFontIcon = null;
    private onSelection = (event: Event) => { };

    public createControl(parent: Composite, index?: number): void {

        this.icon = new WebFontIcon(parent);
        this.icon.addClass("mdi");
        this.icon.setData(this);

        let element = this.icon.getElement();
        element.css("color", "#888");
        element.css("font-size", "24px");
        element.css("line-height", "inherit");

        this.icon.addListener(webface.Selection, <Listener>{
            handleEvent: (event: Event) => {
                this.onSelection(event);
            }
        });
    }

    public setIcon(icon: string): void {
        this.icon.removeClasses("^mdi-");
        this.icon.addClass(icon);
    }

    public setColor(color: string): void {
        view.css(this.icon, "color", color);
    }

    public setEnabled(enabled: boolean): void {
        this.icon.setEnabled(enabled);
    }

    public setVisible(visible: boolean): void {
        this.icon.setVisible(visible);
    }

    public setOnSelection(callback: (event: Event) => void): void {
        this.onSelection = callback;
    }

    public getControl(): Control {
        return this.icon;
    }

}
