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
import Composite from "webface/widgets/Composite";

import * as grid from "padang/grid/grid";
import GridControlStyle from "padang/grid/GridControlStyle";
import GridScrollPosition from "padang/grid/GridScrollPosition";

export default class GridRowRangeSideline {

    private stroke: number = grid.STROKE_WIDTH;
    private startTop: number = 1;

    private top: number = 0;
    private height: number = 0;

    private position: GridScrollPosition = null;
    private baseline: Sideline = null;

    constructor(composite: Composite, style: GridControlStyle, position: GridScrollPosition) {

        let left = style.markerVisible ? style.markerWidth - 2 : 0;
        this.baseline = new Sideline(left, this.stroke, grid.LINE_COLOR);
        this.startTop = style.headerVisible ? style.headerHeight + 1 : 1;

        let element = composite.getElement();
        element.append(this.baseline.element);

        this.position = position;
    }

    public update(top: number, height: number): void {
        this.top = top;
        this.height = height;
        this.doUpdate();
    }

    private doUpdate(): void {
        let top = this.startTop + this.top + this.position.getTop();
        this.baseline.element.css("top", (top - this.stroke - 1) + "px");
        this.baseline.element.css("height", (this.height + this.stroke + 1) + "px");
    }

}

class Sideline {

    public element: JQuery;

    constructor(left: number, stroke: number, color: string) {
        this.element = jQuery("<div>");
        this.element.addClass("padang-grid-row-range-sideline");
        this.element.css("z-index", "2");
        this.element.css("border-right", stroke + "px solid " + color);
        this.element.css("position", "absolute");
        this.element.css("left", left + "px");
        this.element.css("background-color", "transparent");
    }

}

