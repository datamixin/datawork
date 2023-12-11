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
import ValuePlanList from "padang/plan/ValuePlanList";
import ParameterPlan from "padang/plan/ParameterPlan";

import RoutinePlan from "rinjani/plan/RoutinePlan";

import ResultPlan from "malang/plan/ResultPlan";

export default class AlgorithmPlan extends RoutinePlan {

	public static REGRESSION = "regression";
	public static CLASSIFICATION = "classification";

	private tasks: string[] = [];
	private hyperParameters: ParameterPlan[] = [];
	private defaultResult: ResultPlan = null;

	constructor(name: string, label: string, image: string, description: string, tasks: string[]) {
		super(name, label, image, description);
		this.tasks = tasks;
	}

	public getHyperParameters(): ParameterPlan[] {
		return this.hyperParameters;
	}

	public getHyperParameterList(): ValuePlanList {
		return new ValuePlanList(this.hyperParameters);
	}

	public setDefaultResult(result: ResultPlan): void {
		this.defaultResult = result;
	}

	public getDefaultResult(): ResultPlan {
		return this.defaultResult;
	}

	public hasTask(task: string): boolean {
		return this.tasks.indexOf(task) >= 0;
	}

}