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
import Point from "webface/graphics/Point";

import ConductorPanel from "webface/wef/ConductorPanel";

import GraphicPremise from "padang/ui/GraphicPremise";

import PlotPlan from "rinjani/plan/PlotPlan";
import PlotFactory from "rinjani/directors/plots/PlotFactory";

export default class PlotPlanSupport {

	private premise: GraphicPremise = null;

	constructor(premise: GraphicPremise) {
		this.premise = premise;
	}

	public getPreviewResult(plan: PlotPlan, size: Point, callback: (preview: any) => void): void {
		let factory = PlotFactory.getInstance();
		let name = plan.getName();
		let options = new Map<string, string>();
		let plot = factory.create(name, plan, this.premise, options);
		plot.setMinimumSize(120, 90);
		plot.thumbnail(size, (panel: ConductorPanel) => {
			callback(panel);
		});
	}

}