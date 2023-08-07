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

export default class WebFontIcon extends Control {

    constructor(parent: Composite, index?: number) {
        super(jQuery("<span>"), parent, index);
        this.element.addClass("widgets-webFontIcon");
        this.element.on("click", (event: JQueryEventObject) => {
            if (this.isEnabled()) {
                this.sendEvent(webface.Selection, event);
            }
        });
    }

    /**
     * Tambah daftar css class untuk memberikan nama css yang me-representasikan icon
     * @param classes daftar kelas css
     */
    public addClasses(...classes: string[]): void {
        for (var i = 0; i < classes.length; i++) {
            this.element.addClass(classes[i]);
        }
    }

    /**
     * Tambah className css ke element
     * @param className
     */
    public addClass(className: string): void {
        this.element.addClass(className);
    }

    public removeClass(className: string): void {
        this.element.removeClass(className);
    }

    public removeClasses(regex?: string): void {
        let classList = this.element.attr("class").split(/\s+/);
        for (let i = 0; i < classList.length; i++) {
            let className = classList[i];
            if (regex !== undefined) {
                if (className.match(regex)) {
                    this.element.removeClass(className);
                }
            } else {
                this.element.removeClass(className);
            }
        }
    }

    public onSelection(listener: (event: Event) => void): void {
        this.addListener(webface.Selection, <Listener>{
            handleEvent: (event: Event) => {
                if (this.isEnabled()) {
                    listener(event);
                }
            }
        });
    }
}
