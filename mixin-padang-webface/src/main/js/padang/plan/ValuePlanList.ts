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
import ValuePlan from "padang/plan/ValuePlan";

export default class ValuePlanList {

	private list: ValuePlan[] = [];

	constructor(list: ValuePlan[]) {
		this.list = list;
	}

	public getPlan(name: string): ValuePlan {
		for (let plan of this.list) {
			if (plan.getName() === name) {
				return plan;
			}
		}
		return null;
	}

	public getPlanIndex(plan: ValuePlan): number {
		for (let i = 0; i < this.list.length; i++) {
			let parameter = this.list[i];
			if (parameter === plan) {
				return i;
			}
		}
		return -1;
	}

	public getPlanIndexByName(name: string): number {
		for (let i = 0; i < this.list.length; i++) {
			let parameter = this.list[i];
			if (parameter.getName() === name) {
				return i;
			}
		}
		return -1;
	}

	public add(plan: ValuePlan): void {
		this.list.push(plan);
	}

	public getNames(): string[] {
		let names: string[] = []
		for (let plan of this.list) {
			let name = plan.getName();
			names.push(name);
		}
		return names;
	}

}