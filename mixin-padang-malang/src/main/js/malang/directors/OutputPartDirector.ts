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

import EList from "webface/model/EList";

import Command from "webface/wef/Command";
import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import XParameter from "malang/model/XParameter";
import XInstantResult from "malang/model/XInstantResult";
import XCascadeResult from "malang/model/XCascadeResult";
import XModeler from "malang/model/XModeler";

export interface OutputPartDirector {

	modelChanged(model: XModeler): void;

	executeModeler(model: XModeler, callback: () => void): void;

	readyExecute(model: XModeler, callback: (message: string) => void): void;

	getBuilderResultBriefType(formula: string, callback: (type: string) => void): void;

	buildParameters(list: EList<XParameter>, callback: (options: Map<string, any>) => void): void

	removeInstantCommand(model: XInstantResult): Command;

	createInstantAddCommand(cascade: XCascadeResult, instant: XInstantResult, position?: number): Command;

	createCascadeSetLayoutCommand(cascade: XCascadeResult, layout?: string): Command;

	enrollPreload(name: string): void;

}

export function getOutputPartDirector(host: Controller | PartViewer): OutputPartDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <OutputPartDirector>viewer.getDirector(OUTPUT_PART_DIRECTOR);
}

export default OutputPartDirector;