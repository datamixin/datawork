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
import AlgorithmPlan from "malang/plan/AlgorithmPlan";

export default class AlgorithmPlanRegistry {

	private static instance = new AlgorithmPlanRegistry();

	private plans = new Map<string, AlgorithmPlan>();

	constructor() {
		if (AlgorithmPlanRegistry.instance) {
			throw new Error("Error: Instantiation failed: Use AlgorithmPlanRegistry.getInstance() instead of new");
		}
		AlgorithmPlanRegistry.instance = this;
	}

	public static getInstance(): AlgorithmPlanRegistry {
		return AlgorithmPlanRegistry.instance;
	}

	public registerPlan(plan: AlgorithmPlan): void {
		let name = plan.getName();
		this.plans.set(name, plan);
	}

	public getPlan(name: string): AlgorithmPlan {
		return this.plans.get(name);
	}

	public listPlans(): Iterable<AlgorithmPlan> {
		return this.plans.values();
	}

}