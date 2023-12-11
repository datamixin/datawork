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
export let SELECTION_DIRECTOR = "selection-director";

import Controller from "webface/wef/Controller";

import BasePartViewer from "webface/wef/base/BasePartViewer";

import SelectionProvider from "webface/viewers/SelectionProvider";

export interface SelectionDirector extends SelectionProvider {

    select(controller: Controller): void;

    clear(): void;

}

export default SelectionDirector;

export function getSelectionDirector(host: Controller | BasePartViewer): SelectionDirector {
    let viewer: BasePartViewer = null;
    if (host instanceof Controller) {
        viewer = <BasePartViewer><any>host.getViewer();
    } else {
        viewer = host;
    }
    let key = SELECTION_DIRECTOR;
    return <SelectionDirector>viewer.getDirector(key);
}
