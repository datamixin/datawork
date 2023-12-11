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
import LibraryPlan from "malang/plan/LibraryPlan";

export default class LibraryPlanRegistry {

	private static instance = new LibraryPlanRegistry();

	private plans = new Map<string, LibraryPlan>();

	constructor() {
		if (LibraryPlanRegistry.instance) {
			throw new Error("Error: Instantiation failed: Use LibraryPlanRegistry.getInstance() instead of new");
		}
		LibraryPlanRegistry.instance = this;
	}

	public static getInstance(): LibraryPlanRegistry {
		return LibraryPlanRegistry.instance;
	}

	public registerPlan(plan: LibraryPlan): void {
		let name = plan.getName();
		this.plans.set(name, plan);
	}

	public getPlan(name: string): LibraryPlan {
		return this.plans.get(name);
	}

	public listPlans(): Iterable<LibraryPlan> {
		return this.plans.values();
	}

}