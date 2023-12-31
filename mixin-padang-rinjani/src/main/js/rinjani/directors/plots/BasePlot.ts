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
import VisageValue from "bekasi/visage/VisageValue";

import GraphicPremise from "padang/ui/GraphicPremise";

import PlotPlan from "rinjani/plan/PlotPlan";

import Plot from "rinjani/directors/plots/Plot";

export abstract class BasePlot extends Plot {

	constructor(plan: PlotPlan, premise: GraphicPremise, parameters: Map<string, VisageValue>) {
		super(plan, premise, parameters)
		this.plan = plan;
		this.premise = premise;
		this.parameters = parameters;
	}

}

export default BasePlot;