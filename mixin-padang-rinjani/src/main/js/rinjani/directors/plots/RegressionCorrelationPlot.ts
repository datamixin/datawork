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
import Panel from "webface/wef/Panel";

import Point from "webface/graphics/Point";

import XAssignment from "sleman/model/XAssignment";

import VisageType from "bekasi/visage/VisageType";
import VisageTable from "bekasi/visage/VisageTable";
import VisageValueFactory from "bekasi/visage/VisageValueFactory";

import RegressionCorrelation from "padang/functions/feature/RegressionCorrelation";

import OutputPartSupport from "vegazoo/directors/OutputPartSupport";

import PlotPlan from "rinjani/plan/PlotPlan";
import PlotPlanRegistry from "rinjani/plan/PlotPlanRegistry";

import BasePlot from "rinjani/directors/plots/BasePlot";
import PlotFactory from "rinjani/directors/plots/PlotFactory";
import VegazooPanel from "rinjani/directors/plots/VegazooPanel";

import InputPlanUtils from "rinjani/plan/InputPlanUtils";

export default class RegressionCorrelationPlot extends BasePlot {

	public static PLOT_NAME = "RegressionCorrelationPlot";
	public static FEATURE = "feature";
	public static CORRELATION = "correlation";

	public static FEATURES_PLAN = InputPlanUtils.createMultipleContinuousPlanFromParameter(
		RegressionCorrelation.FEATURES_PLAN
	)

	public static TARGET_PLAN = InputPlanUtils.createSingleContinuousPlanFromParameter(
		RegressionCorrelation.TARGET_PLAN
	)

	public static getPlan(): PlotPlan {

		let base = RegressionCorrelation.getPlan();
		let plan = new PlotPlan(
			RegressionCorrelationPlot.PLOT_NAME,
			"RegressionCorrelationPlot",
			base.getImage(),
			"Regression correlation plot"
		);

		let parameters = plan.getParameterList();
		parameters.add(RegressionCorrelation.METHOD_PLAN);

		let args = plan.getInputList();
		args.add(RegressionCorrelationPlot.FEATURES_PLAN);
		args.add(RegressionCorrelationPlot.TARGET_PLAN);

		return plan;
	}

	public thumbnail(size: Point, callback: (panel: Panel) => void): void {
		let factory = VisageValueFactory.getInstance();
		let columns = [RegressionCorrelationPlot.FEATURE, RegressionCorrelationPlot.CORRELATION];
		let table = <VisageTable>factory.create({
			"type": VisageTable.LEAN_NAME,
			"columnsKeys": columns,
			"columnsTypes": [VisageType.STRING, VisageType.FLOAT64],
			"records": [
				["a", -0.6],
				["b", 0.8],
				["c", 0.9],
			]
		});
		this.create(size, table, 25, 15, callback);
	}

	public execute(assignments: XAssignment[], size: Point, callback: (panel: Panel) => void): void {

		if (this.validateAssignments(assignments, callback)) {

			let name = RegressionCorrelation.FUNCTION_NAME;
			let call = this.maker.createCall(name, assignments);
			this.inspectEvaluate(call, callback, (table: VisageTable) => {
				this.create(size, table, 10, 20, callback);
			});
		}

	}

	private create(size: Point, table: VisageTable,
		sw: number, sh: number, callback: (panel: Panel) => void): void {

		// Bar
		let unitSpec = this.maker.createBarTopLevelUnitSpec();
		this.adjustTopLevelSizeWithSpace(unitSpec, size, sw, sh);
		this.maker.setCSVDatasetFromTable(unitSpec, table);

		// X
		let x = this.maker.addXFieldDef(unitSpec, RegressionCorrelationPlot.CORRELATION);
		this.maker.setFieldTypeQuantitative(x);

		// Y
		let y = this.maker.addYFieldDef(unitSpec, RegressionCorrelationPlot.FEATURE);
		this.maker.setFieldTypeNominal(y);

		let support = new OutputPartSupport(this.premise);
		support.createSpec(unitSpec, (spec: any) => {
			let panel = new VegazooPanel(spec);
			callback(panel);
		});

	}

}

let registry = PlotPlanRegistry.getInstance();
registry.registerPlan(RegressionCorrelationPlot.getPlan());

let factory = PlotFactory.getInstance();
factory.register(RegressionCorrelationPlot.PLOT_NAME, RegressionCorrelationPlot);