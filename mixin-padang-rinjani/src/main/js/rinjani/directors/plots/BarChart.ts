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

import XPositionFieldDef from "vegazoo/model/XPositionFieldDef";
import XTopLevelUnitSpec from "vegazoo/model/XTopLevelUnitSpec";

import OutputPartSupport from "vegazoo/directors/OutputPartSupport";

import PlotPlan from "rinjani/plan/PlotPlan";
import PlotPlanRegistry from "rinjani/plan/PlotPlanRegistry";

import BasePlot from "rinjani/directors/plots/BasePlot";
import PlotFactory from "rinjani/directors/plots/PlotFactory";
import VegazooPanel from "rinjani/directors/plots/VegazooPanel";

import InputPlanUtils from "rinjani/plan/InputPlanUtils";

export default class BarChart extends BasePlot {

	public static PLOT_NAME = "BarChart";
	public static X = "x";
	public static Y = "y";

	public static X_PLAN = InputPlanUtils.createSingleDiscretePlan(
		BarChart.X, "X", "Discrete values",
	)

	public static Y_PLAN = InputPlanUtils.createMultipleDiscretePlan(
		BarChart.Y, "Y", "Continues values",
	)

	public static getPlan(): PlotPlan {

		let plan = new PlotPlan(
			BarChart.PLOT_NAME,
			"Bar Plot",
			"mdi-chart-bar",
			"Bar plot"
		);

		let args = plan.getInputList();
		args.add(BarChart.X_PLAN);
		args.add(BarChart.Y_PLAN);

		return plan;
	}

	public thumbnail(size: Point, callback: (panel: Panel) => void): void {

		let factory = VisageValueFactory.getInstance();
		let columns = [BarChart.X, BarChart.Y];
		let table = <VisageTable>factory.create({
			"type": VisageTable.LEAN_NAME,
			"columnsKeys": columns,
			"columnsTypes": [VisageType.STRING, VisageType.NUMBER],
			"records": [
				["a", 3],
				["b", 4],
				["c", 2]
			]
		});
		let unitSpec = this.createUnitSpec(size, btoa("x"), btoa("y"), 20, 15);
		this.maker.setCSVDatasetFromTable(unitSpec, table);

		let support = new OutputPartSupport(this.premise);
		support.createSpec(unitSpec, (spec: any) => {
			let panel = new VegazooPanel(spec);
			callback(panel);
		});
	}

	public execute(assignments: XAssignment[], size: Point, callback: (panel: Panel) => void): void {

		if (this.validateAssignments(assignments, callback)) {

			let xf = this.getEncodedPointerAssignment(assignments, BarChart.X_PLAN);
			let yf = this.getEncodedPointerAssignment(assignments, BarChart.Y_PLAN);
			let unitSpec = this.createUnitSpec(size, xf, yf, 40, 80);

			let support = new OutputPartSupport(this.premise);
			support.createSpec(unitSpec, (spec: any) => {
				let panel = new VegazooPanel(spec);
				callback(panel);
			});

		}

	}

	private createUnitSpec(size: Point, xf: string, yf: string,
		spaceWidth: number, spaceHeight: number): XTopLevelUnitSpec {

		// Bar
		let unitSpec = this.maker.createBarTopLevelUnitSpec();
		this.adjustTopLevelSizeWithSpace(unitSpec, size, spaceWidth, spaceHeight);
		let encoding = unitSpec.getEncoding();

		// X
		let x = <XPositionFieldDef>encoding.getX();
		this.maker.setFieldTypeNominal(x);
		x.setField(xf);

		// Y
		let y = <XPositionFieldDef>encoding.getY();
		this.maker.setFieldTypeQuantitative(y);
		y.setField(yf);

		return unitSpec;

	}

}

let registry = PlotPlanRegistry.getInstance();
registry.registerPlan(BarChart.getPlan());

let factory = PlotFactory.getInstance();
factory.register(BarChart.PLOT_NAME, BarChart);