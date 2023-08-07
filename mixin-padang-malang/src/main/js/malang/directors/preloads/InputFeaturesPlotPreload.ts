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
import XAssignment from "sleman/model/XAssignment";

import Learning from "padang/functions/model/Learning";

import BuilderPremise from "padang/ui/BuilderPremise";

import PlotPlan from "rinjani/plan/PlotPlan";

import RadVizPlot from "rinjani/directors/plots/RadVizPlot";
import FrequencyPlot from "rinjani/directors/plots/FrequencyPlot";
import HistogramPlot from "rinjani/directors/plots/HistogramPlot";
import VariableRankPlot from "rinjani/directors/plots/VariableRankPlot";
import CorrelationRankPlot from "rinjani/directors/plots/CorrelationRankPlot";
import ParallelCoordinatePlot from "rinjani/directors/plots/ParallelCoordinatePlot";
import RegressionCorrelationPlot from "rinjani/directors/plots/RegressionCorrelationPlot";
import ClassificationCorrelationPlot from "rinjani/directors/plots/ClassificationCorrelationPlot";

import * as malang from "malang/malang";

import XModeler from "malang/model/XModeler";
import XSingleAssignment from "malang/model/XSingleAssignment";
import XMultipleAssignment from "malang/model/XMultipleAssignment";

import PlotPreload from "malang/directors/preloads/PlotPreload";
import PreloadSupport from "malang/directors/preloads/PreloadSupport";
import PreloadRegistry from "malang/directors/preloads/PreloadRegistry";
import InputDatasetPlotPreload from "malang/directors/preloads/InputDatasetPreload";

import AssignmentMaker from "malang/directors/executors/AssignmentMaker";

export default class InputFeaturesPlotPreload extends PlotPreload {

	constructor(name: string, presume: string, plan: PlotPlan) {
		super(InputDatasetPlotPreload.GROUP, name, presume, plan);
	}

	public getSequence(): number {
		return 1;
	}

	public isApplicable(support: PreloadSupport, model: XModeler): boolean {
		let plans = this.plan.getInputs();
		let inputs = model.getInputs();
		let satisfies = 0;
		for (let plan of plans) {
			let name = plan.getName();
			let types = plan.getTypes();
			for (let input of inputs) {
				if (name === input.getName()) {
					let assignment = input.getAssignment();
					let single = plan.isSingle();
					if (single === true && assignment instanceof XSingleAssignment) {
						let feature = assignment.getInputFeature();
						if (feature !== null) {
							let type = support.getFeatureType(feature);
							if (types.indexOf(type) !== -1) {
								satisfies++;
							}
							break;
						}
					} else if (single === false && assignment instanceof XMultipleAssignment) {
						let features = assignment.getInputFeatures();
						let matches = 0;
						for (let feature of features) {
							let type = support.getFeatureType(feature);
							if (types.indexOf(type) !== -1) {
								matches++;
							}
						}
						if (features.size === matches) {
							satisfies++;
						}
						break;
					}
				}
			}
		}
		return satisfies === plans.length;
	}

	protected createAssignments(premise: BuilderPremise, model: XModeler): XAssignment[] {
		let maker = new AssignmentMaker(premise);
		let plans = this.plan.getInputs();
		return maker.createInputAssignments(plans, model);
	}

}

let addPlot = (name: string, presume: string, plan: PlotPlan) => {
	let preload = new InputFeaturesPlotPreload(name, presume, plan);
	let registry = PreloadRegistry.getInstance();
	registry.register(preload);
}

let addBarPlot = (name: string, plan: PlotPlan) => {
	addPlot(name, malang.RESULT_ICON_MAP.BAR, plan);
}

let addLinePlot = (name: string, plan: PlotPlan) => {
	addPlot(name, malang.RESULT_ICON_MAP.LINE, plan);
}

let addScatterPlot = (name: string, plan: PlotPlan) => {
	addPlot(name, malang.RESULT_ICON_MAP.SCATTER, plan);
}

addBarPlot(FrequencyPlot.PLOT_NAME + "(" + Learning.TARGET_LABEL + ")", FrequencyPlot.getPlan());
addBarPlot(HistogramPlot.PLOT_NAME + "(" + Learning.TARGET_LABEL + ")", HistogramPlot.getPlan());
addBarPlot(VariableRankPlot.PLOT_NAME + "(" + Learning.FEATURES_LABEL + ")", VariableRankPlot.getPlan());
addScatterPlot(RadVizPlot.PLOT_NAME, RadVizPlot.getPlan());
addBarPlot(CorrelationRankPlot.PLOT_NAME, CorrelationRankPlot.getPlan());
addLinePlot(ParallelCoordinatePlot.PLOT_NAME, ParallelCoordinatePlot.getPlan());
addBarPlot(RegressionCorrelationPlot.PLOT_NAME, RegressionCorrelationPlot.getPlan());
addBarPlot(ClassificationCorrelationPlot.PLOT_NAME, ClassificationCorrelationPlot.getPlan());

