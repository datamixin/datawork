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
export let PROGRESS_QUEUE_DIRECTOR = "progress-queue-director";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import AdvertiserAgent from "bekasi/ui/AdvertiserAgent";

import ProgressQueueEntry from "bekasi/directors/ProgressQueueEntry";

export interface ProgressQueueDirector {

	registerSupport(part: AdvertiserAgent): void;

	createQueueEntry(title: string): ProgressQueueEntry;

}

export function getProgressQueueDirector(host: Controller | PartViewer): ProgressQueueDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <ProgressQueueDirector>viewer.getDirector(PROGRESS_QUEUE_DIRECTOR);
}

export default ProgressQueueDirector;

