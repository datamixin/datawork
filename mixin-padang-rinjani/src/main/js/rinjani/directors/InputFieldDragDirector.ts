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
export let INPUT_FIELD_DRAG_DIRECTOR = "input-field-drag-director";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";
import DragDirector from "webface/wef/DragDirector";

export interface InputFieldDragDirector extends DragDirector {

}

export default InputFieldDragDirector;

export function getInputFieldDragDirector(host: Controller | PartViewer): InputFieldDragDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <InputFieldDragDirector>viewer.getDirector(INPUT_FIELD_DRAG_DIRECTOR);
}

