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
export let CUSTOM_PART_DIRECTOR = "custom-part-director";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

export interface CustomPartDirector {

}

export function getCustomPartDirector(host: Controller | PartViewer): CustomPartDirector {
    let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
    return <CustomPartDirector>viewer.getDirector(CUSTOM_PART_DIRECTOR);
}

export default CustomPartDirector;