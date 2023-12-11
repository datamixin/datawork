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
import * as webface from "webface/webface";

import Point from "webface/graphics/Point";

import Event from "webface/widgets/Event";
import Layout from "webface/widgets/Layout";
import Control from "webface/widgets/Control";
import Tracker from "webface/widgets/Tracker";
import Listener from "webface/widgets/Listener";
import TypedListener from "webface/widgets/TypedListener";
import SelectionListener from "webface/events/SelectionListener";

export default class Composite extends Control {

    private layout: Layout = null;
    private children: Control[] = [];
    private verticalBorder = 0;
    private horizontalBorder = 0;
    private clientWidth: number = null;
    private clientHeight: number = null;
    private tracker: Tracker = null;

    // Parent dapat berupa element jQuery atau Composite
    public constructor(parent: Composite | JQuery, index?: number) {
        super(
            parent instanceof jQuery ? <JQuery>parent : jQuery("<div>"),
            parent instanceof Composite ? <Composite>parent : undefined, index);

        this.element.addClass("widgets-composite");
        this.element.css("overflow", "hidden");

        if (parent instanceof jQuery) {
            let element = <JQuery>parent;
            this.width = element.outerWidth();
            this.height = element.outerHeight();
            this.clientWidth = element.innerWidth();
            this.clientHeight = element.innerHeight();
            this.element.css({
                "width": this.width + "px",
                "height": this.height + "px",
            });
        }

        // Response selection
        this.element.on("click", (object: JQueryEventObject) => {
            if (this.isEnabled()) {
                let event = this.createSelectionEvent(object);
                this.notifyListeners(webface.Selection, event);
            }
        });

        // Response double click
        this.element.on("dblclick", (object: JQueryEventObject) => {
            if (this.isEnabled()) {
                let event = this.createSelectionEvent(object);
                this.notifyListeners(webface.MouseDoubleClick, event);
            }
        });

    }

    public setLayout(layout: Layout) {
        this.layout = layout;
        this.layout.prepare(this);
    }

    public getLayout(): Layout {
        return this.layout;
    }

    protected addControl(control: Control, index?: number) {

        let element = control.getElement();
        element.css("position", "absolute"); // Semua anakan harus absolute position

        if (index >= 0) {

            // Tambahkan di children index tersebut 
            this.children.splice(index, 0, control);

            // Tambahkan di dom di index tersebut
            let children = this.element.children();
            let targetElement = children[index];
            if (targetElement !== undefined) {
                element.insertBefore(targetElement);
            } else {
                element.appendTo(this.element);
            }
        } else {

            // Tambahkan di akhir children
            this.children.push(control);

            element.appendTo(this.element);
        }

    }

    protected removeControl(control: Control) {
        let index = this.children.indexOf(control);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
    }

    /**
     * Kembalikan copy dari daftar children yang ada di composite ini.
     */
    public getChildren(): Control[] {
        let children: Control[] = [];
        for (var i = 0; i < this.children.length; i++) {
            children.push(this.children[i]);
        }
        return children;
    }

    protected indexOfControl(control: Control): number {
        for (var i = 0; i < this.children.length; i++) {
            if (control === this.children[i]) {
                return i;
            }
        }
        return -1;
    }

    public moveControl(control: Control, index: number) {
        let controlIndex = this.children.indexOf(control);
        if (controlIndex !== -1 && controlIndex !== index) {
            this.children.splice(controlIndex, 1);
            this.children.splice(index, 0, control);
            let element = control.getElement();
            let targetElement = this.element.children()[index];
            if (targetElement !== undefined) {
                element.insertBefore(targetElement);
            } else {
                element.appendTo(this.element);
            }
        }
    }

    protected sizeChanged(changed: boolean): void {
        if (changed === true) {
            this.updateClientArea();
            this.relayout();
        }
    }

    private updateClientArea(): void {
        let width = this.element.innerWidth();
        let height = this.element.innerHeight();
        this.clientWidth = width - this.horizontalBorder;
        this.clientHeight = height - this.verticalBorder;

    }

    public markLayout(): Layout {
        this.tracker = new Tracker(this);
        return this.layout;
    }

    public resized(): void {
        this.updateClientArea();
        this.relayout();
    }

    public relayout(): void {
        if (this.layout === null) {
            console.warn("No layout defined for Composite", this.element[0]);
        } else {
            if (this.tracker === null) {
                this.layout.layout(this);
            } else {
                this.tracker.relayout();
                this.tracker = null;
            }
        }
    }

    public addSelectionListener(listener: SelectionListener): void {
        let typedListener = new TypedListener(listener);
        this.addListener(webface.Selection, typedListener);
    }

    public onSelection(listener: (event: Event) => void): void {
        this.addListener(webface.Selection, <Listener>{
            handleEvent: (event: Event) => {
                listener(event);
            }
        });
    }

    public pack(): void {
        this.updateClientArea();
        this.relayout();
    }

    public setHorizontalBorder(border: number): void {
        this.horizontalBorder = border;
    }

    public setVerticalBorder(border: number): void {
        this.verticalBorder = border;
    }

    public getClientArea(): Point {
        if (this.clientWidth === null || this.clientHeight === null) {
            this.updateClientArea();
        }
        return new Point(this.clientWidth, this.clientHeight);
    }

    public dispose(): void {
        while (this.children.length > 0) {
            this.children[0].dispose();
        }
        super.dispose();
    }
}

