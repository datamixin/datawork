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
import AccuracyNumberPlot from "rinjani/directors/plots/AccuracyNumberPlot";
import ClassificationMatrixPlot from "rinjani/directors/plots/ClassificationMatrixPlot";
import ClassificationPerformancePlot from "rinjani/directors/plots/ClassificationPerformancePlot";

import ResultPlan from "malang/plan/ResultPlan";
import AlgorithmPlan from "malang/plan/AlgorithmPlan";
import InstantResultPlan from "malang/plan/InstantResultPlan";
import CascadeResultPlan from "malang/plan/CascadeResultPlan";

import Algorithm from "malang/directors/algorithms/Algorithm";

export abstract class ClassificationAlgorithm extends Algorithm {

	public static GROUP = "Classification";

	public static setDefaultResult(plan: AlgorithmPlan): void {
		let result = ClassificationAlgorithm.getDefaultResult();
		plan.setDefaultResult(result);
	}

	public static getDefaultResult(): ResultPlan {
		return new CascadeResultPlan(CascadeResultPlan.VERTICAL, [
			new InstantResultPlan(ClassificationAlgorithm.GROUP, AccuracyNumberPlot.PLOT_NAME),
			new CascadeResultPlan(CascadeResultPlan.HORIZONTAL, [
				new InstantResultPlan(ClassificationAlgorithm.GROUP, ClassificationMatrixPlot.PLOT_NAME),
				new InstantResultPlan(ClassificationAlgorithm.GROUP, ClassificationPerformancePlot.PLOT_NAME),
			])
		]);
	}

}

export default ClassificationAlgorithm;