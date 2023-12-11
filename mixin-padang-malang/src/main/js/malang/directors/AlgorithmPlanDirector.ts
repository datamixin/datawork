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
export let ALGORITHM_PLAN_DIRECTOR = "algorithm-plan-director";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import InputPlan from "rinjani/plan/InputPlan";

import XInput from "malang/model/XInput";
import XParameter from "malang/model/XParameter";

import AlgorithmPlan from "malang/plan/AlgorithmPlan";

export interface AlgorithmPlanDirector {

	getDefaultName(): string;

	listPlanNames(): string[];

	getPlan(name: string): AlgorithmPlan;

	getDefaultParameters(name: string): Map<string, string>;

	getInputPlans(name: string): InputPlan[];

	getDescriptionDetail(name: string): Map<string, any>;

	getParameterLabel(model: XParameter): string;

	getParameterType(model: XParameter): string;

	getInputTypes(model: XInput): string[];

}

export function getAlgorithmPlanDirector(host: Controller | PartViewer): AlgorithmPlanDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <AlgorithmPlanDirector>viewer.getDirector(ALGORITHM_PLAN_DIRECTOR);
}

export default AlgorithmPlanDirector;