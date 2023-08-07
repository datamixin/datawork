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
import Widget from "webface/widgets/Widget";
import Composite from "webface/widgets/Composite";

import Point from "webface/graphics/Point";

export default class Control extends Widget {

    private layoutData: any = null;
    private parent: Composite = null;
    private enabled: boolean = true;
    private visible: boolean = true;
    private cover: JQuery = null;
    private data: any = null;

    protected width: number = webface.DEFAULT;
    protected height: number = webface.DEFAULT;

    public constructor(element: JQuery, parent: Composite, index?: number) {
        super(element);
        this.element = element;
        if (parent !== undefined) {
            this.parent = parent;
            parent["addControl"](this, index);
        }
    }

    protected createSelectionEvent(eventObject: JQueryEventObject): Event {
        let event = new Event();
        event.type = webface.Selection;
        event.eventObject = eventObject;
        event.widget = this;
        return event;
    }

    protected createItemEvent(item: any): Event {
        let event = new Event();
        event.type = webface.Selection;
        event.item = item;
        event.widget = this;
        return event;
    }

    public getParent(): Composite {
        return this.parent;
    }

    public setParent(parent: Composite, index?: number): void {
        this.parent["removeControl"](this);
        parent["addControl"](this, index);
        this.parent = parent;
    }

    public setData(data: any): void {
        return this.data = data;
    }

    public getData(): any {
        return this.data;
    }

    public setLayoutData(layoutData: any) {
        this.layoutData = layoutData;
    }

    public getLayoutData(): any {
        return this.layoutData;
    }

    public moveAbove(control: Control): void {
        let indexOfReference = this.parent["indexOfControl"](control);
        this.parent.moveControl(control, indexOfReference);
    }

    public moveBelow(control: Control): void {
        let indexOfReference = this.parent["indexOfControl"](control) + 1;
        this.parent.moveControl(control, indexOfReference);
    }

    public setEnabled(enabled: boolean): void {
        if (enabled === this.enabled) {
            return;
        }
        this.enabled = enabled;
        this.applyEnabled(enabled);
    }

    protected applyEnabled(enabled: boolean): void {
        if (enabled === true) {
            if (this.cover !== null) {
                this.cover.remove();
            }
            this.element.removeClass("disabled");
            this.element.css("opacity", "1.0");
            this.element.css("cursor", "pointer");
        } else {
            this.cover = jQuery("<div>");
            this.cover.css("background-color", "#FFF");
            this.cover.css("opacity", 0);
            this.cover.css("position", "absolute");
            this.cover.css("top", "0px");
            this.cover.css("left", "0px");
            this.cover.width(this.width);
            this.cover.height(this.height);
            this.element.append(this.cover);
            this.element.addClass("disabled");
            this.element.css("opacity", "0.5");
            this.element.css("cursor", "default");
        }
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public setVisible(visible: boolean): void {
        if (visible === this.visible) {
            return;
        }
        if (visible === false) {
            this.element.hide();
        } else {
            this.element.show();
        }
        this.visible = visible;
    }

    public isVisible(): boolean {
        return this.visible;
    }

    public computeSize(): Point {
        let changed = false;
        if (this.width === webface.DEFAULT) {
            let width = this.element.outerWidth();
            if (this.width !== width) {
                this.width = width;
                changed = true;
            }
        }
        if (this.height === webface.DEFAULT) {
            let height = this.element.outerHeight();
            if (this.height !== height) {
                this.height = height;
                changed = true;
            }
        }
        if (this.width > 0 && this.height > 0) {
            this.sizeChanged(changed);
        }
        return new Point(this.width, this.height);
    }

    public forceFocus(): void {
        this.element.focus();
    }

    public setSize(width: number, height: number): void {
        let changed = false;
        if (width !== this.width && width !== webface.DEFAULT) {
            this.element.outerWidth(width);
            this.width = width;
            if (this.cover !== null) {
                this.cover.width(this.width);
            }
            changed = true;
        }
        if (height !== this.height && height !== webface.DEFAULT) {
            this.element.outerHeight(height);
            this.height = height;
            if (this.cover !== null) {
                this.cover.height(this.height);
            }
            changed = true;
        }
        if (this.width > 0 && this.height > 0) {
            this.sizeChanged(changed)
        }
    }

    protected sizeChanged(changed: boolean): void {

    }

    public dispose(): void {

        // Remove element dari DOM
        super.dispose();

        // Remove element dari daftar control di parent
        if (this.parent !== null) {
            this.parent["removeControl"](this);
        }
    }
}

