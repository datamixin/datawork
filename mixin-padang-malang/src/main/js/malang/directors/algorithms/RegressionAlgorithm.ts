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
import Algorithm from "malang/directors/algorithms/Algorithm";

import ResultPlan from "malang/plan/ResultPlan";
import AlgorithmPlan from "malang/plan/AlgorithmPlan";
import InstantResultPlan from "malang/plan/InstantResultPlan";
import CascadeResultPlan from "malang/plan/CascadeResultPlan";

import ResidualsPlot from "rinjani/directors/plots/ResidualsPlot";
import ErrorNumberPlot from "rinjani/directors/plots/ErrorNumberPlot";

export abstract class RegressionAlgorithm extends Algorithm {

	public static GROUP = "Regression";

	public static setDefaultResult(plan: AlgorithmPlan): void {
		let result = RegressionAlgorithm.getDefaultResult();
		plan.setDefaultResult(result);
	}

	public static getDefaultResult(): ResultPlan {
		return new CascadeResultPlan(CascadeResultPlan.VERTICAL, [
			new InstantResultPlan(RegressionAlgorithm.GROUP, ErrorNumberPlot.PLOT_NAME),
			new InstantResultPlan(RegressionAlgorithm.GROUP, ResidualsPlot.PLOT_NAME),
		]);
	}

}

export default RegressionAlgorithm;