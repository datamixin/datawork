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
import Request from "webface/wef/Request";

export default class SheetListSheetDropObjectRequest extends Request {

    public static REQUEST_NAME = "sheet-list-sheet-drop-object";

    public static SOURCE_POSITION = "source-position";
    public static TARGET_POSITION = "target-position";

    constructor(sourcePosition: number, targetPosition: number) {
        super(SheetListSheetDropObjectRequest.REQUEST_NAME);
        super.setData(SheetListSheetDropObjectRequest.SOURCE_POSITION, sourcePosition);
        super.setData(SheetListSheetDropObjectRequest.TARGET_POSITION, targetPosition);
    }

}

