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
import GraphicPremise from "padang/ui/GraphicPremise";

import PlotPlan from "rinjani/plan/PlotPlan";

import Plot from "rinjani/directors/plots/Plot";

export default class PlotFactory {

	private static instance = new PlotFactory();

	private types = new Map<string, any>();

	constructor() {
		if (PlotFactory.instance) {
			throw new Error("Error: Instantiation failed: Use PlotFactory.getInstance() instead of new");
		}
		PlotFactory.instance = this;
	}

	public static getInstance(): PlotFactory {
		return PlotFactory.instance;
	}

	public create(name: string, plan: PlotPlan, premise: GraphicPremise, parameters: Map<string, any>): Plot {
		return <Plot>(new (this.types.get(name))(plan, premise, parameters));
	}

	public register(name: string, type: any): void {
		this.types.set(name, type);
	}

}
