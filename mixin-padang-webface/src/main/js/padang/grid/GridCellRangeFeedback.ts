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

import * as grid from "padang/grid/grid";
import GridControlStyle from "padang/grid/GridControlStyle";
import GridScrollPosition from "padang/grid/GridScrollPosition";

export default class GridCellRangeFeedback {

    private stroke: number = grid.STROKE_WIDTH;
    private startLeft: number = 0;
    private startTop: number = 0;

    private left: number = 0;
    private top: number = 0;
    private width: number = 0;
    private height: number = 0;

    private position: GridScrollPosition = null;
    private leftLine: VerticalLine = null;
    private topLine: HorizontalLine = null;
    private rightLine: VerticalLine = null;
    private bottomLine: HorizontalLine = null;
    private background: Background = null;

    constructor(composite: Composite, style: GridControlStyle, position: GridScrollPosition) {

        this.startLeft = style.markerVisible ? style.markerWidth : 0;
        this.startTop = style.headerVisible ? style.headerHeight : 0;
        this.background = new Background(grid.LINE_COLOR);
        this.leftLine = new VerticalLine(this.stroke, 0, "left", grid.LINE_COLOR);
        this.topLine = new HorizontalLine(0, this.stroke, "top", grid.LINE_COLOR);
        this.rightLine = new VerticalLine(this.stroke, 0, "right", grid.LINE_COLOR);
        this.bottomLine = new HorizontalLine(0, this.stroke, "bottom", grid.LINE_COLOR);

        let element = composite.getElement();
        element.append(this.background.element);
        element.append(this.leftLine.element);
        element.append(this.topLine.element);
        element.append(this.rightLine.element);
        element.append(this.bottomLine.element);

        this.position = position;
    }

    public update(left: number, top: number, width: number, height: number): void {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.doUpdate();
    }

    private doUpdate(): void {

        let left = this.startLeft + this.left + this.position.getLeft();
        let top = this.startTop + this.top + this.position.getTop();

        this.background.element.css("left", (left - this.stroke) + "px");
        this.background.element.css("top", (top - this.stroke) + "px");
        this.background.element.css("width", (this.width + this.stroke + 1) + "px");
        this.background.element.css("height", (this.height + this.stroke) + "px");

        this.leftLine.element.css("left", (left - this.stroke) + "px");
        this.leftLine.element.css("top", (top - this.stroke) + "px");
        this.leftLine.element.css("height", (this.height + this.stroke) + "px");

        this.topLine.element.css("left", (left - this.stroke) + "px");
        this.topLine.element.css("top", (top - this.stroke) + "px");
        this.topLine.element.css("width", (this.width + this.stroke + 1) + "px");

        this.rightLine.element.css("left", (left + this.width - this.stroke + 1) + "px");
        this.rightLine.element.css("top", (top - this.stroke) + "px");
        this.rightLine.element.css("height", (this.height + this.stroke) + "px");

        this.bottomLine.element.css("left", (left - this.stroke) + "px");
        this.bottomLine.element.css("top", (top + this.height - this.stroke + 1) + "px");
        this.bottomLine.element.css("width", (this.width + this.stroke + 1) + "px");
    }

}

class Background {

    public element: JQuery;

    constructor(color: string) {
        this.element = jQuery("<div>");
        this.element.addClass("padang-grid-cell-range-feedback-background");
        this.element.css("z-index", "0");
        this.element.css("position", "absolute");
        this.element.css("opacity", 0.1);
        this.element.css("background", color);
    }

}

class Line {

    public element: JQuery;

    constructor(border: string, color: string) {
        this.element = jQuery("<div>");
        this.element.addClass("padang-grid-cell-range-feedback-" + border);
        this.element.css("z-index", "1");
        this.element.css("position", "absolute");
        this.element.css("background-color", color);
    }

}

class VerticalLine extends Line {

    constructor(width: number, height: number, border: string, color: string) {
        super(border, color);
        this.element.css("width", width + "px");
    }

}

class HorizontalLine extends Line {

    constructor(width: number, height: number, border: string, color: string) {
        super(border, color);
        this.element.css("height", height + "px");
    }

}

