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
import HomeMenuFactory from "bekasi/ui/HomeMenuFactory";

import InteractionPlan from "padang/plan/InteractionPlan";

import StarterProjectHomeMenu from "padang/ui/StarterProjectHomeMenu";

export default class InteractionPlanRegistry {

	private static instance = new InteractionPlanRegistry();

	private plans = new Map<string, InteractionPlan>();
	private starters = new Map<string, InteractionPlan>();
	private initiators = new Map<string, InteractionPlan>();

	constructor() {
		if (InteractionPlanRegistry.instance) {
			throw new Error("Error: Instantiation failed: Use InteractionPlanRegistry.getInstance() instead of new");
		}
		InteractionPlanRegistry.instance = this;
	}

	public static getInstance(): InteractionPlanRegistry {
		return InteractionPlanRegistry.instance;
	}

	public registerPlan(plan: InteractionPlan): void {
		let name = plan.getName();
		this.plans.set(name, plan);
	}

	public registerStarter(plan: InteractionPlan): void {
		let name = plan.getName();
		this.plans.set(name, plan);
		this.starters.set(name, plan);
		let factory = HomeMenuFactory.getInstance();
		factory.register(StarterProjectHomeMenu.DATA_SOURCES, <any>StarterProjectHomeMenu, [plan]);
	}

	public isStarter(name: string): boolean {
		return this.starters.has(name);
	}

	public registerInitiator(plan: InteractionPlan): void {
		let name = plan.getName();
		this.plans.set(name, plan);
		this.initiators.set(name, plan);
	}

	public getPlan(name: string): InteractionPlan {
		return this.plans.get(name);
	}

	public getStarters(): InteractionPlan[] {
		let starters: InteractionPlan[] = [];
		for (let starter of this.starters.values()) {
			starters.push(starter);
		}
		starters.sort((a: InteractionPlan, b: InteractionPlan) => {
			let aLabel = a.getPriority();
			let bLabel = b.getPriority();
			return aLabel - bLabel;
		});
		return starters;

	}

	public getInitiators(): InteractionPlan[] {
		let initiators: InteractionPlan[] = [];
		for (let initiator of this.initiators.values()) {
			initiators.push(initiator);
		}
		initiators.sort((a: InteractionPlan, b: InteractionPlan) => {
			let aLabel = a.getPriority();
			let bLabel = b.getPriority();
			return aLabel - bLabel;
		});
		return initiators;

	}

}