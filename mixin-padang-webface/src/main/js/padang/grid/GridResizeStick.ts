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
import Composite from "webface/widgets/Composite";

import * as view from "padang/view/view";

import GridControlStyle from "padang/grid/GridControlStyle";

export default class GridResizeStick {

    private static WIDTH = 8;
    private static MIN_RESIZE = GridControlStyle.MIN_COLUMN_WIDTH * 2 / 3;
    private static COLOR = "transparent";

    private resizeStick: ResizeStick = null;

    constructor(container: Composite) {

        this.resizeStick = new ResizeStick(GridResizeStick.WIDTH, GridResizeStick.MIN_RESIZE, GridResizeStick.COLOR);

        let element = container.getElement();
        element.append(this.resizeStick.element);
        element.on("mousemove", (event: JQueryEventObject) => {
            let offset = element.offset();
            this.resizeStick.initiate(offset.left, event);
        });

    }

    public updateChildren(container: Composite): void {
        let children = container.getChildren();
        let spots: number[] = [];
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            let layoutData = view.getAbsoluteData(child);
            spots.push(<number>layoutData.left + <number>layoutData.width);
        }
        this.resizeStick.setSpots(spots);

    }

    public setOnDragging(callback: (index: number, width: number) => void): void {
        this.resizeStick.setOnDragging(callback);
    }

    public setOnDragstop(callback: (index: number, width: number) => void): void {
        this.resizeStick.setOnDragstop(callback);
    }

}

class ResizeStick {

    public element: JQuery;
    private width = 0;
    private minResize = 0;
    private start = 0;
    private target = -1;
    private dragging = false;
    private spots: number[] = [];
    private onDragging = (index: number, width: number): void => { };
    private onDragstop = (index: number, width: number): void => { };

    constructor(width: number, minResize: number, color: string) {
        this.width = width;
        this.minResize = minResize;
        this.element = jQuery("<div>");
        this.element.addClass("padang-grid-resize-stick");
        this.element.css("z-index", "3");
        this.element.css("cursor", "ew-resize");
        this.element.css("width", width + "px");
        this.element.css("height", "100%");
        this.element.css("position", "absolute");
        this.element.css("background-color", color);
        this.element.draggable({

            axis: "x",

            drag: (event: JQueryEventObject) => {
                this.dragging = true;
                this.resize(event)
            },

            stop: (event: JQueryEventObject) => {
                this.dragging = false;
                this.resize(event)
                this.target = -1;
            }
        });
    }

    public setSpots(spots: number[]): void {
        this.spots = spots;
    }

    public initiate(start: number, event: JQueryEventObject): void {
        if (this.dragging === true) {
            return;
        }
        this.start = start;
        let position = event.clientX - this.start;
        let entries = this.spots.entries();
        for (let entry of entries) {
            let index = entry[0];
            let spot = entry[1];
            if (position >= spot - this.width && position <= spot + this.width) {
                let left = spot - this.width / 2;
                this.element.css("left", left + "px");
                this.target = index;
                break;
            }
        }

    }

    public resize(event: JQueryEventObject): void {
        let position = event.clientX - this.start;
        let spot = this.spots[this.target];
        let prev = this.target === 0 ? 0 : this.spots[this.target - 1];
        let width = position - prev;
        if (width >= this.minResize) {
            let left = spot - this.width / 2;
            this.element.css("left", left + "px");
            if (this.dragging === true) {
                this.onDragging(this.target, width);
            } else {
                this.onDragstop(this.target, width);
            }
        }
    }

    public setOnDragging(callback: (index: number, width: number) => void): void {
        this.onDragging = callback;
    }

    public setOnDragstop(callback: (index: number, width: number) => void): void {
        this.onDragstop = callback;
    }

}

