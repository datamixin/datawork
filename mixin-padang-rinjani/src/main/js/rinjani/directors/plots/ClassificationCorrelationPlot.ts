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

import ClassificationCorrelation from "padang/functions/feature/ClassificationCorrelation";

import OutputPartSupport from "vegazoo/directors/OutputPartSupport";

import PlotPlan from "rinjani/plan/PlotPlan";
import PlotPlanRegistry from "rinjani/plan/PlotPlanRegistry";

import BasePlot from "rinjani/directors/plots/BasePlot";
import PlotFactory from "rinjani/directors/plots/PlotFactory";
import VegazooPanel from "rinjani/directors/plots/VegazooPanel";

import InputPlanUtils from "rinjani/plan/InputPlanUtils";

export default class ClassificationCorrelationPlot extends BasePlot {

	public static PLOT_NAME = "ClassificationCorrelationPlot";
	public static FEATURE = "feature";
	public static CORRELATION = "correlation";

	public static FEATURES_PLAN = InputPlanUtils.createMultipleContinuousPlanFromParameter(
		ClassificationCorrelation.FEATURES_PLAN
	)

	public static TARGET_PLAN = InputPlanUtils.createSingleDiscretePlanFromParameter(
		ClassificationCorrelation.TARGET_PLAN
	)

	public static getPlan(): PlotPlan {

		let base = ClassificationCorrelation.getPlan();
		let plan = new PlotPlan(
			ClassificationCorrelationPlot.PLOT_NAME,
			"ClassificationCorrelationPlot",
			base.getImage(),
			"Classification correlation plot"
		);

		let parameters = plan.getParameterList();
		parameters.add(ClassificationCorrelation.METHOD_PLAN);

		let args = plan.getInputList();
		args.add(ClassificationCorrelationPlot.FEATURES_PLAN);
		args.add(ClassificationCorrelationPlot.TARGET_PLAN);

		return plan;
	}

	public thumbnail(size: Point, callback: (panel: Panel) => void): void {
		let factory = VisageValueFactory.getInstance();
		let columns = [ClassificationCorrelationPlot.FEATURE, ClassificationCorrelationPlot.CORRELATION];
		let table = <VisageTable>factory.create({
			"type": VisageTable.LEAN_NAME,
			"columnsKeys": columns,
			"columnsTypes": [VisageType.STRING, VisageType.FLOAT64],
			"records": [
				["a", 0.6],
				["b", 0.8],
				["c", -0.9],
			]
		});
		this.create(size, table, 20, 15, callback);
	}

	public execute(assignments: XAssignment[], size: Point, callback: (panel: Panel) => void): void {

		let name = ClassificationCorrelation.FUNCTION_NAME;
		this.evaluateFunction(name, assignments, callback, (table: VisageTable) => {
			this.create(size, table, 40, 80, callback);
		});

	}

	public create(size: Point, table: VisageTable,
		sw: number, sh: number, callback: (panel: Panel) => void): void {

		// Bar
		let unitSpec = this.maker.createBarTopLevelUnitSpec();
		this.adjustTopLevelSizeWithSpace(unitSpec, size, sw, sh);
		this.maker.setCSVDatasetFromTable(unitSpec, table);

		// X
		let x = this.maker.addXFieldDef(unitSpec, ClassificationCorrelationPlot.CORRELATION);
		this.maker.setFieldTypeQuantitative(x);

		// Y
		let y = this.maker.addYFieldDef(unitSpec, ClassificationCorrelationPlot.FEATURE);
		this.maker.setFieldTypeNominal(y);

		let support = new OutputPartSupport(this.premise);
		support.createSpec(unitSpec, (spec: any) => {
			let panel = new VegazooPanel(spec);
			callback(panel);
		});

	}
}

let registry = PlotPlanRegistry.getInstance();
registry.registerPlan(ClassificationCorrelationPlot.getPlan());

let factory = PlotFactory.getInstance();
factory.register(ClassificationCorrelationPlot.PLOT_NAME, ClassificationCorrelationPlot);