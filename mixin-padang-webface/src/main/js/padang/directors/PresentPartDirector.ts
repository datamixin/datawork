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
export let PRESENT_PART_DIRECTOR = "present-part-director";

import EObjectController from "webface/wef/base/EObjectController";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import XVariable from "padang/model/XVariable";

import PreparationFormulator from "padang/ui/PreparationFormulator";

export interface PresentPartDirector {

	getContents(): Controller;

	refreshContent(callback: () => void): void;

	getSelection(): EObjectController;

	prepareVariable(controller: Controller, variable: XVariable,
		formulator: PreparationFormulator, callback: (formula: string) => void): void;

}

export function getPresentPartDirector(host: Controller | PartViewer): PresentPartDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <PresentPartDirector>viewer.getDirector(PRESENT_PART_DIRECTOR);
}

export default PresentPartDirector;

