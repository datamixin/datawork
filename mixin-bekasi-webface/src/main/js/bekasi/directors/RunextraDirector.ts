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
export let RUNEXTRA_DIRECTOR = "runextra-director";

import EObject from "webface/model/EObject";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

export interface RunextraDirector {

	getNames(group: string, callback: (names: string[]) => void): void;

	getNamesByType(group: string, type: string, callback: (names: string[]) => void): void;

	save(group: string, name: string, model: EObject, callback: () => void): void;

	load(group: string, name: string): Promise<EObject>;

	remove(group: string, name: string, callback: () => void): void;

}

export function getRunextraDirector(host: Controller | PartViewer): RunextraDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <RunextraDirector>viewer.getDirector(RUNEXTRA_DIRECTOR);
}

export default RunextraDirector;

