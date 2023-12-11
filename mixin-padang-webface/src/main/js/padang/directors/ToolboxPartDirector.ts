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
export let TOOLBOX_PART_DIRECTOR = "toolbox-part-director";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import XSheet from "padang/model/XSheet";

export interface ToolboxPartDirector {

	executeAddDatasetSheet(controller: Controller): XSheet;

}

export function getToolboxPartDirector(host: Controller | PartViewer): ToolboxPartDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <ToolboxPartDirector>viewer.getDirector(TOOLBOX_PART_DIRECTOR);
}

export default ToolboxPartDirector;