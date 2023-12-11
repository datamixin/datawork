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
export let DRAG_DIRECTOR = "drag-director";

import Map from "webface/util/Map";

import Controller from "webface/wef/Controller";

export interface DragDirector {

    start(data: Map<any>): void;

    drag(data: Map<any>, x: number, y: number): void;

    stop(): void;
}

export default DragDirector;

export function getDragDirector(controller: Controller): DragDirector {
    let viewer = controller.getViewer();
    let rootViewer = viewer.getRootViewer();
    return <DragDirector>rootViewer.getDirector(DRAG_DIRECTOR);
}

