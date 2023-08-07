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
import ParameterPlan from "padang/plan/ParameterPlan";
import ValuePlanList from "padang/plan/ValuePlanList";

export default class FunctionPlan {

	private name: string = null
	private label: string = null;
	private image: string = null
	private description: string = null;
	private parameters: ParameterPlan[] = [];

	constructor(name: string, label: string, image: string, description: string) {
		this.name = name;
		this.label = label;
		this.image = image;
		this.description = description;
	}

	public getName(): string {
		return this.name;
	}

	public getLabel(): string {
		return this.label;
	}

	public getImage(): string {
		return this.image;
	}

	public getDescription(): string {
		return this.description;
	}

	public getParameters(): ParameterPlan[] {
		return this.parameters;
	}

	public getParameterList(): ValuePlanList {
		return new ValuePlanList(this.parameters);
	}

}