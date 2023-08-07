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
export let INPUT_FEATURE_DRAG_DIRECTOR = "input-feature-drag-director";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";
import DragDirector from "webface/wef/DragDirector";

export interface InputFeatureDragDirector extends DragDirector {

}

export default InputFeatureDragDirector;

export function getInputFeatureDragDirector(host: Controller | PartViewer): InputFeatureDragDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <InputFeatureDragDirector>viewer.getDirector(INPUT_FEATURE_DRAG_DIRECTOR);
}

