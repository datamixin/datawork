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
import Map from "webface/util/Map";

import Request from "webface/wef/Request";

export default class PositionDatumDefDragSourceDragRequest extends Request {

    public static REQUEST_NAME = "datum-def-drag-source-drag";

    public static DATA = "data";
    public static X = "x";
    public static Y = "y";

    constructor(data: Map<any>, x: number, y: number) {
        super(PositionDatumDefDragSourceDragRequest.REQUEST_NAME);
        super.setData(PositionDatumDefDragSourceDragRequest.DATA, data);
        super.setData(PositionDatumDefDragSourceDragRequest.X, x);
        super.setData(PositionDatumDefDragSourceDragRequest.Y, y);
    }

}

