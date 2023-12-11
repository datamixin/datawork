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

import XFieldDef from "vegazoo/model/XFieldDef";
import XColorDef from "vegazoo/model/XColorDef";
import XTopLevelUnitSpec from "vegazoo/model/XTopLevelUnitSpec";

import OutputPartSupport from "vegazoo/directors/OutputPartSupport";

import PlotPlan from "rinjani/plan/PlotPlan";
import PlotPlanRegistry from "rinjani/plan/PlotPlanRegistry";

import BasePlot from "rinjani/directors/plots/BasePlot";
import PlotFactory from "rinjani/directors/plots/PlotFactory";
import VegazooPanel from "rinjani/directors/plots/VegazooPanel";

import InputPlanUtils from "rinjani/plan/InputPlanUtils";

export default class PieChart extends BasePlot {

	public static PLOT_NAME = "PieChart";

	public static X = "x";
	public static Y = "y";

	public static X_PLAN = InputPlanUtils.createSingleDiscretePlan(
		PieChart.X, "X", "Discrete values",
	)

	public static Y_PLAN = InputPlanUtils.createSingleDiscretePlan(
		PieChart.Y, "Y", "Continues values",
	)

	public static getPlan(): PlotPlan {

		let plan = new PlotPlan(
			PieChart.PLOT_NAME,
			"Pie Chart",
			"mdi-chart-pie",
			"Pie Chart"
		);

		let args = plan.getInputList();
		args.add(PieChart.X_PLAN);
		args.add(PieChart.Y_PLAN);

		return plan;
	}

	public thumbnail(size: Point, callback: (panel: Panel) => void): void {
		let factory = VisageValueFactory.getInstance();
		let columns = [PieChart.X, PieChart.Y];
		let table = <VisageTable>factory.create({
			"type": VisageTable.LEAN_NAME,
			"columnsKeys": columns,
			"columnsTypes": [VisageType.STRING, VisageType.NUMBER],
			"records": [
				["a", 4],
				["b", 5],
				["c", 6]
			]
		});
		let unitSpec = this.createUnitSpec(size, btoa(PieChart.X), btoa(PieChart.Y), true, 20, 15);
		this.maker.setCSVDatasetFromTable(unitSpec, table);

		let support = new OutputPartSupport(this.premise);
		support.createSpec(unitSpec, (spec: any) => {
			let panel = new VegazooPanel(spec);
			callback(panel);
		});
	}

	public execute(assignments: XAssignment[], size: Point, callback: (panel: Panel) => void): void {

		if (this.validateAssignments(assignments, callback)) {

			let xF = this.getEncodedPointerAssignment(assignments, PieChart.X_PLAN);
			let yF = this.getEncodedPointerAssignment(assignments, PieChart.Y_PLAN);
			let unitSpec = this.createUnitSpec(size, xF, yF, false, 40, 80);

			let support = new OutputPartSupport(this.premise);
			support.createSpec(unitSpec, (spec: any) => {
				let panel = new VegazooPanel(spec);
				callback(panel);
			});

		}

	}

	private createUnitSpec(size: Point, xF: string, yF: string,
		thumbnail: boolean, spaceWidth: number, spaceHeight: number): XTopLevelUnitSpec {

		// Bar
		let unitSpec = this.maker.createArcTopLevelUnitSpec();
		this.adjustTopLevelSizeWithSpace(unitSpec, size, spaceWidth, spaceHeight);
		let encoding = unitSpec.getEncoding();

		// Color
		let color = <XColorDef>encoding.getColor();
		this.maker.setFieldTypeNominal(color);
		color.setField(xF);

		// Theta
		let theta = <XFieldDef>encoding.getTheta();
		this.maker.setFieldTypeQuantitative(theta);
		theta.setField(yF);

		if (thumbnail === true) {

			// Legend
			let config = unitSpec.getConfig();
			let legend = this.maker.createLegendConfigDisable();
			config.setLegend(legend);
		}

		return unitSpec;

	}

}

let registry = PlotPlanRegistry.getInstance();
registry.registerPlan(PieChart.getPlan());

let factory = PlotFactory.getInstance();
factory.register(PieChart.PLOT_NAME, PieChart);