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
import ValuePlanList from "padang/plan/ValuePlanList";
import ParameterPlan from "padang/plan/ParameterPlan";

import RoutinePlan from "rinjani/plan/RoutinePlan";

export default class PlotPlan extends RoutinePlan {

	public static MINIMUM_WIDTH = 400;
	public static MINIMUM_HEIGHT = 300;

	private parameters: ParameterPlan[] = [];
	private minimumWidth = PlotPlan.MINIMUM_WIDTH;
	private minimumHeight = PlotPlan.MINIMUM_HEIGHT;

	constructor(name: string, label: string, image: string, description: string) {
		super(name, label, image, description);
	}

	public getParameters(): ParameterPlan[] {
		return this.parameters;
	}

	public getParameterList(): ValuePlanList {
		return new ValuePlanList(this.parameters);
	}
	
	public setMinimumWidth(width: number): void {
		this.minimumWidth = width;
	}

	public getMinimumWidth(): number {
		return this.minimumWidth;
	}

	public setMinimumHeight(height: number): void {
		this.minimumHeight = height;
	}

	public getMinimumHeight(): number {
		return this.minimumHeight;
	}

}