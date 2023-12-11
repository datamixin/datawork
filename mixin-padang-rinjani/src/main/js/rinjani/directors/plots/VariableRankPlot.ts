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
import Panel from "webface/wef/Panel";

import Point from "webface/graphics/Point";

import XAssignment from "sleman/model/XAssignment";

import VisageType from "bekasi/visage/VisageType";
import VisageTable from "bekasi/visage/VisageTable";
import VisageValueFactory from "bekasi/visage/VisageValueFactory";

import VariableRank from "padang/functions/feature/VariableRank";

import OutputPartSupport from "vegazoo/directors/OutputPartSupport";

import PlotPlan from "rinjani/plan/PlotPlan";
import PlotPlanRegistry from "rinjani/plan/PlotPlanRegistry";

import BasePlot from "rinjani/directors/plots/BasePlot";
import PlotFactory from "rinjani/directors/plots/PlotFactory";
import VegazooPanel from "rinjani/directors/plots/VegazooPanel";

import InputPlanUtils from "rinjani/plan/InputPlanUtils";

export default class VariableRankPlot extends BasePlot {

	public static PLOT_NAME = "VariableRankPlot";

	public static VARIABLE = "variable";
	public static RESULT = "result";

	public static FEATURES_PLAN = InputPlanUtils.createMultipleContinuousPlanFromParameter(
		VariableRank.FEATURES_PLAN
	)

	public static getPlan(): PlotPlan {

		let base = VariableRank.getPlan();
		let plan = new PlotPlan(
			VariableRankPlot.PLOT_NAME,
			"Variable Rank Plot",
			base.getImage(),
			"Variable rank plot"
		);

		let parameters = plan.getParameterList();
		parameters.add(VariableRank.ALGORITHM_PLAN);

		let args = plan.getInputList();
		args.add(VariableRankPlot.FEATURES_PLAN);

		return plan;
	}

	public thumbnail(size: Point, callback: (panel: Panel) => void): void {
		let factory = VisageValueFactory.getInstance();
		let columns = [VariableRankPlot.VARIABLE, VariableRankPlot.RESULT];
		let table = <VisageTable>factory.create({
			"type": VisageTable.LEAN_NAME,
			"columnsKeys": columns,
			"columnsTypes": [VisageType.STRING, VisageType.FLOAT64],
			"records": [
				["a", 0.6],
				["b", 0.8],
				["c", 0.9],
			]
		});
		this.create(size, table, 20, 15, callback);
	}

	public execute(assignments: XAssignment[], size: Point, callback: (panel: Panel) => void): void {
		let name = VariableRank.FUNCTION_NAME;
		this.evaluateFunction(name, assignments, callback, (table: VisageTable) => {
			this.create(size, table, 20, 40, callback);
		});
	}

	private create(size: Point, table: VisageTable,
		sw: number, sh: number, callback: (panel: Panel) => void): void {

		// Bar
		let unitSpec = this.maker.createBarTopLevelUnitSpec();
		this.adjustTopLevelSizeWithSpace(unitSpec, size, sw, sh);
		this.maker.setCSVDatasetFromTable(unitSpec, table);
		let x = this.maker.addXFieldDef(unitSpec, VariableRankPlot.RESULT);
		this.maker.setFieldTypeQuantitative(x);
		this.maker.addYFieldDef(unitSpec, VariableRankPlot.VARIABLE);

		// Spec
		let support = new OutputPartSupport(this.premise);
		support.createSpec(unitSpec, (spec: any) => {
			let panel = new VegazooPanel(spec);
			callback(panel);
		});

	}

}

let registry = PlotPlanRegistry.getInstance();
registry.registerPlan(VariableRankPlot.getPlan());

let factory = PlotFactory.getInstance();
factory.register(VariableRankPlot.PLOT_NAME, VariableRankPlot);