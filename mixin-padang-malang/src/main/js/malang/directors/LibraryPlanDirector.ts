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
export let LIBRARY_PLAN_DIRECTOR = "library-plan-director";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import XLibrary from "malang/model/XLibrary";
import XParameter from "malang/model/XParameter";
import XAutomatedTask from "malang/model/XAutomatedTask";

import LibraryPlan from "malang/plan/LibraryPlan";
import AutomatedTaskPlan from "malang/plan/AutomatedTaskPlan";

export interface LibraryPlanDirector {

	getDefaultName(): string;

	listPlanNames(): string[];

	getPlan(library: string | XLibrary): LibraryPlan;

	getDefaultSettings(name: string): Map<string, string>;

	getDescriptionDetail(name: string): Map<string, any>;

	getTaskPlan(library: string | XLibrary, task: string | XAutomatedTask): AutomatedTaskPlan;

	listTaskPlanNames(library: string): Map<string, string>;

	getTaskDescriptionDetail(library: string, task: string): Map<string, any>;

	getSettingLabel(model: XParameter): string;

	getSettingType(model: XParameter): string;

}

export function getLibraryPlanDirector(host: Controller | PartViewer): LibraryPlanDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <LibraryPlanDirector>viewer.getDirector(LIBRARY_PLAN_DIRECTOR);
}

export default LibraryPlanDirector;