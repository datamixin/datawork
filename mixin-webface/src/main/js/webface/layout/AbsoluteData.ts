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

export default class AbsoluteData {

    public left: number | string = webface.DEFAULT;
    public top: number | string = webface.DEFAULT;
    public width: number | string = webface.DEFAULT;
    public height: number | string = webface.DEFAULT;
    public right: number | string = webface.DEFAULT;
    public bottom: number | string = webface.DEFAULT;
    public transform: string = null;

    constructor(left?: number | string, top?: number | string,
        width?: number | string, height?: number | string) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}

