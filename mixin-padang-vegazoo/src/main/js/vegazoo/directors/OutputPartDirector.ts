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
export let OUTPUT_PART_DIRECTOR = "output-part-director";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import XOutlook from "vegazoo/model/XOutlook";
import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";

export interface OutputPartDirector {

	refresh(): void;

	getLastSpec(): any;

	createSpec(topLevelSpec: XTopLevelSpec, callback: (spec: any) => void): void;

	outlookChanged(outlook: XOutlook): void;

}

export function getOutputPartDirector(host: Controller | PartViewer): OutputPartDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <OutputPartDirector>viewer.getDirector(OUTPUT_PART_DIRECTOR);
}

export default OutputPartDirector;