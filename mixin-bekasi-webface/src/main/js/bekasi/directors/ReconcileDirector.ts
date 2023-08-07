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
export let RECONCILE_DIRECTOR = "reconcile-director";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import FileReconcileApplier from "bekasi/directors/FileReconcileApplier";
import RunspaceReconcileApplier from "bekasi/directors/RunspaceReconcileApplier";

export interface ReconcileDirector {

    registerRunspaceApplier(leanName: string, applier: RunspaceReconcileApplier): void;

    registerFileApplier(leanName: string, fileId: string, applier: FileReconcileApplier): void;

    unregisterFileApplier(leanName: string, fileId: string): void;

    unregisterFileApplierSpecific(leanName: string, fileId: string, applier: FileReconcileApplier): void;

}

export function getReconcileDirector(host: Controller | PartViewer): ReconcileDirector {
    let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
    return <ReconcileDirector>viewer.getDirector(RECONCILE_DIRECTOR);
}

export default ReconcileDirector;

