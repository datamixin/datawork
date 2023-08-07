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
export let SYNCHRONIZATION_DIRECTOR = "synchronization-director";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

export interface SynchronizationDirector {

	/**
	 * Tambahkan callback yang akan di panggil saat semua task di commit. 
	 * Daftar task dan daftar callback akan di buat saat awal commit.
	 * Dartar ini terpisah dari task dan callback yang ditambahkan selama commit.  
	 * @param callback
	 */
	onCommit(callback: () => void): void;

}

export default SynchronizationDirector;

export function getSynchronizationDirector(host: Controller | PartViewer): SynchronizationDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <SynchronizationDirector>viewer.getDirector(SYNCHRONIZATION_DIRECTOR);
}
