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

import * as functions from "webface/util/functions";

export function reconcileDragData(event: any, data: Map<any>): void {
    let draggable = $(event.target);
    functions.populateJQueryData(draggable, data);
}

export function getDragData(event: any, name: string): any {
    let draggable = $(event.target);
    return draggable.data(name);
}

export function getUIDraggableDataMap(event: any, ui: any): Map<any> {
    let draggable = $(ui.draggable);
    let data = functions.getJQueryDataAsMap(draggable);
    reconcileDragData(event, data);
    return data;
}
