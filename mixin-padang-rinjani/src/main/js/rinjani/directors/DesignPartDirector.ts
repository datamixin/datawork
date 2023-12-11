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
export let DESIGN_PART_DIRECTOR = "design-part-director";

import EList from "webface/model/EList";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import XRoutine from "rinjani/model/XRoutine";
import XParameter from "rinjani/model/XParameter";

export interface DesignPartDirector {

	createRoutine(callback: (routine: XRoutine, pristine: boolean) => void): void

	getParameterType(model: XParameter): string;

	getParameterLabel(model: XParameter): string;

	getParameterAssignable(model: XParameter): string;

	getOtherParameters(model: XParameter): EList<XParameter>;

	getSourceName(): string;

}

export function getDesignPartDirector(host: Controller | PartViewer): DesignPartDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <DesignPartDirector>viewer.getDirector(DESIGN_PART_DIRECTOR);
}

export default DesignPartDirector;