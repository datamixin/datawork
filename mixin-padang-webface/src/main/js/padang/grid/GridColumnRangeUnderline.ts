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

export default class GridColumnRangeUnderline {

    private stroke: number = grid.STROKE_WIDTH;
    private startLeft: number = 0;

    private left: number = 0;
    private width: number = 0;

    private position: GridScrollPosition = null;
    private baseline: Underline = null;

    constructor(composite: Composite, style: GridControlStyle, position: GridScrollPosition) {

        this.startLeft = style.markerVisible ? style.markerWidth : 0;
        let top = style.headerVisible ? style.headerHeight - 2 : 0;
        this.baseline = new Underline(top, this.stroke, grid.LINE_COLOR);

        let element = composite.getElement();
        element.append(this.baseline.element);

        this.position = position;
    }

    public update(left: number, width: number): void {
        this.left = left;
        this.width = width;
        this.doUpdate();
    }

    private doUpdate(): void {
        let left = this.startLeft + this.left + this.position.getLeft();
        this.baseline.element.css("left", (left - this.stroke) + "px");
        this.baseline.element.css("width", (this.width + this.stroke + 1) + "px");
    }

}

class Underline {

    public element: JQuery;

    constructor(top: number, stroke: number, color: string) {
        this.element = jQuery("<div>");
        this.element.addClass("padang-grid-column-range-underline");
        this.element.css("z-index", "2");
        this.element.css("border-bottom", stroke + "px solid " + color);
        this.element.css("position", "absolute");
        this.element.css("top", top + "px");
        this.element.css("background-color", "transparent");
    }

}

