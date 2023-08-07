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
import PartViewer from "webface/wef/PartViewer";

import BaseDragDirector from "webface/wef/base/BaseDragDirector";

import { CellDragDirector } from "padang/directors/CellDragDirector";
import { CELL_DRAG_PARTICIPANT } from "padang/directors/CellDragParticipant";

export default class BaseCellDragDirector extends BaseDragDirector implements CellDragDirector {

    constructor(partViewer: PartViewer) {
        super(partViewer, CELL_DRAG_PARTICIPANT);
    }

}
