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
import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

export let PROVISION_RESULT_DIRECTOR = "provision-result-director";

import Provision from "padang/provisions/Provision";

export interface ProvisionResultDirector {

    inspect(controller: Controller, provision: Provision, callback: (result: any) => void): void;

    inspectPreparationResultAt(controller: Controller, index: number,
        provision: Provision, callback: (result: any) => void): void;

}

export function getProvisionResultDirector(host: Controller | PartViewer): ProvisionResultDirector {
    let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
    return <ProvisionResultDirector>viewer.getDirector(PROVISION_RESULT_DIRECTOR);
}

export default ProvisionResultDirector;

