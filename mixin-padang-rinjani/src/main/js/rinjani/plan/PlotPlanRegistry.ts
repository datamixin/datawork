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
import PlotPlan from "rinjani/plan/PlotPlan";

export default class PlotPlanRegistry {

	private static instance = new PlotPlanRegistry();

	private plans = new Map<string, PlotPlan>();

	constructor() {
		if (PlotPlanRegistry.instance) {
			throw new Error("Error: Instantiation failed: Use PlotPlanRegistry.getInstance() instead of new");
		}
		PlotPlanRegistry.instance = this;
	}

	public static getInstance(): PlotPlanRegistry {
		return PlotPlanRegistry.instance;
	}

	public registerPlan(plan: PlotPlan): void {
		let name = plan.getName();
		this.plans.set(name, plan);
	}

	public getPlan(name: string): PlotPlan {
		return this.plans.get(name);
	}

	public listPlans(): Iterable<PlotPlan> {
		return this.plans.values();
	}

}