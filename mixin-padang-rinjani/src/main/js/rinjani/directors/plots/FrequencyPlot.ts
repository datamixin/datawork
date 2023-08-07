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

import Learning from "padang/functions/model/Learning";

import * as constants from "vegazoo/constants";

import XPositionFieldDef from "vegazoo/model/XPositionFieldDef";
import XTopLevelUnitSpec from "vegazoo/model/XTopLevelUnitSpec";

import OutputPartSupport from "vegazoo/directors/OutputPartSupport";

import PlotPlan from "rinjani/plan/PlotPlan";
import PlotPlanRegistry from "rinjani/plan/PlotPlanRegistry";

import BasePlot from "rinjani/directors/plots/BasePlot";
import PlotFactory from "rinjani/directors/plots/PlotFactory";
import VegazooPanel from "rinjani/directors/plots/VegazooPanel";

import InputPlanUtils from "rinjani/plan/InputPlanUtils";

export default class FrequencyPlot extends BasePlot {

	public static PLOT_NAME = "FrequencyPlot";

	public static TARGET_PLAN = InputPlanUtils.createSingleDiscretePlan(
		Learning.TARGET, "Values", "Discrete values",
	)

	public static getPlan(): PlotPlan {

		let plan = new PlotPlan(
			FrequencyPlot.PLOT_NAME,
			"Frequency Plot",
			"mdi-chart-bar",
			"Frequency plot"
		);

		let args = plan.getInputList();
		args.add(FrequencyPlot.TARGET_PLAN);

		return plan;
	}

	public thumbnail(size: Point, callback: (panel: Panel) => void): void {
		let factory = VisageValueFactory.getInstance();
		let columns = ["x"];
		let table = <VisageTable>factory.create({
			"type": VisageTable.LEAN_NAME,
			"columnsKeys": columns,
			"columnsTypes": [VisageType.STRING],
			"records": [
				["a"], ["a"], ["a"],
				["b"], ["b"], ["b"], ["b"],
				["c"], ["c"]
			]
		});
		let unitSpec = this.createUnitSpec(size, btoa("x"), 20, 15);
		this.maker.setCSVDatasetFromTable(unitSpec, table);

		let support = new OutputPartSupport(this.premise);
		support.createSpec(unitSpec, (spec: any) => {
			let panel = new VegazooPanel(spec);
			callback(panel);
		});
	}

	public execute(assignments: XAssignment[], size: Point, callback: (panel: Panel) => void): void {

		if (this.validateAssignments(assignments, callback)) {

			let formula = this.getEncodedPointerAssignment(assignments, FrequencyPlot.TARGET_PLAN);
			let unitSpec = this.createUnitSpec(size, formula, 40, 80);

			let support = new OutputPartSupport(this.premise);
			support.createSpec(unitSpec, (spec: any) => {
				let panel = new VegazooPanel(spec);
				callback(panel);
			});

		}

	}

	private createUnitSpec(size: Point, formula: string,
		spaceWidth: number, spaceHeight: number): XTopLevelUnitSpec {

		// Bar
		let unitSpec = this.maker.createBarTopLevelUnitSpec();
		this.adjustTopLevelSizeWithSpace(unitSpec, size, spaceWidth, spaceHeight);
		let encoding = unitSpec.getEncoding();

		// X
		let x = <XPositionFieldDef>encoding.getX();
		this.maker.setFieldTypeNominal(x);
		x.setField(formula);

		// Y
		let y = <XPositionFieldDef>encoding.getY();
		y.setAggregate(constants.AggregateOp.COUNT);
		y.setField(formula);
		y.setTitle("Count");

		return unitSpec;

	}

}

let registry = PlotPlanRegistry.getInstance();
registry.registerPlan(FrequencyPlot.getPlan());

let factory = PlotFactory.getInstance();
factory.register(FrequencyPlot.PLOT_NAME, FrequencyPlot);