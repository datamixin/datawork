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
export let PLOT_PLAN_DIRECTOR = "plot-plan-director";

import Point from "webface/graphics/Point";

import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import ParameterPlan from "padang/plan/ParameterPlan";

import XInput from "rinjani/model/XInput";
import XParameter from "rinjani/model/XParameter";

import PlotPlan from "rinjani/plan/PlotPlan";
import InputPlan from "rinjani/plan/InputPlan";

export interface PlotPlanDirector {

	getPlan(name: string): PlotPlan;

	getDefaultName(): string;

	getDefaultParameters(name: string): Map<string, string>;

	getInputPlans(name: string): InputPlan[];

	getParameterPlans(name: string): ParameterPlan[];

	listPlanNames(): string[];

	getDescriptionDetail(name: string): Map<string, any>;

	getSourcePreview(name: string, size: Point, callback: (preview: any) => void): void;

	getParameterLabel(model: XParameter): string;

	getParameterType(model: XParameter): string;

	getParameterPlan(model: XParameter): ParameterPlan;

	getInputTypes(model: XInput): string[];

}

export function getPlotPlanDirector(host: Controller | PartViewer): PlotPlanDirector {
	let viewer = host instanceof Controller ? host.getViewer() : <PartViewer>host;
	return <PlotPlanDirector>viewer.getDirector(PLOT_PLAN_DIRECTOR);
}

export default PlotPlanDirector;