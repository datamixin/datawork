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
import Request from "webface/wef/Request";

export default class CellCellDropObjectRequest extends Request {

    public static REQUEST_NAME = "cell-cell-drop-object";

    public static CELL = "cell";
    public static SOURCE_POSITION = "source-position";
    public static TARGET_POSITION = "target-position";
    public static NEW_POSITION = "new-position";

    constructor(cell: any, sourcePosition: number, targetPosition: number, newPosition: number) {
        super(CellCellDropObjectRequest.REQUEST_NAME);
        super.setData(CellCellDropObjectRequest.CELL, cell);
        super.setData(CellCellDropObjectRequest.SOURCE_POSITION, sourcePosition);
        super.setData(CellCellDropObjectRequest.TARGET_POSITION, targetPosition);
        super.setData(CellCellDropObjectRequest.NEW_POSITION, newPosition);
    }

}

