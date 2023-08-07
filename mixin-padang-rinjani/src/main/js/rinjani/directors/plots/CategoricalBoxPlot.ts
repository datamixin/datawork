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

export default class CategoricalBoxPlot extends BasePlot {

	public static PLOT_NAME = "CategoricalBoxPlot";
	public static X = "x";
	public static Y = "y";

	public static X_PLAN = InputPlanUtils.createSingleDiscretePlan(
		CategoricalBoxPlot.X, "X", "Discrete values",
	)

	public static Y_PLAN = InputPlanUtils.createSingleDiscretePlan(
		CategoricalBoxPlot.Y, "Y", "Continues values",
	)

	public static getPlan(): PlotPlan {

		let plan = new PlotPlan(
			CategoricalBoxPlot.PLOT_NAME,
			"Categorical Box Plot",
			"mdi-choxt-box",
			"Categorical Box plot"
		);

		let oxgs = plan.getInputList();
		oxgs.add(CategoricalBoxPlot.X_PLAN);
		oxgs.add(CategoricalBoxPlot.Y_PLAN);

		return plan;
	}

	public thumbnail(size: Point, callback: (panel: Panel) => void): void {

		let factory = VisageValueFactory.getInstance();
		let columns = [CategoricalBoxPlot.X, CategoricalBoxPlot.Y];
		let table = <VisageTable>factory.create({
			"type": VisageTable.LEAN_NAME,
			"columnsKeys": columns,
			"columnsTypes": [VisageType.STRING, VisageType.NUMBER],
			"records": [
				["a", 2], ["a", 3], ["a", 4], ["a", 4], ["a", 3], ["a", 2],
				["b", 5], ["b", 6], ["b", 5], ["b", 4], ["b", 5], ["b", 6], ["b", 7], ["b", 5],
				["c", 1], ["c", 2], ["c", 2], ["c", 5],
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

			let xF = this.getEncodedPointerAssignment(assignments, CategoricalBoxPlot.X_PLAN);
			let yF = this.getEncodedPointerAssignment(assignments, CategoricalBoxPlot.Y_PLAN);
			let unitSpec = this.createUnitSpec(size, xF, yF, 40, 80);

			let support = new OutputPartSupport(this.premise);
			support.createSpec(unitSpec, (spec: any) => {
				let panel = new VegazooPanel(spec);
				callback(panel);
			});

		}

	}

	private createUnitSpec(size: Point, xF: string, yF: string,
		spaceWidth: number, spaceHeight: number): XTopLevelUnitSpec {

		// Box
		let unitSpec = this.maker.createBoxplotTopLevelUnitSpec();
		this.adjustTopLevelSizeWithSpace(unitSpec, size, spaceWidth, spaceHeight);
		let encoding = unitSpec.getEncoding();

		// X
		let x = <XPositionFieldDef>encoding.getX();
		this.maker.setFieldTypeNominal(x);
		x.setField(xF);

		// Y
		let y = <XPositionFieldDef>encoding.getY();
		this.maker.setFieldTypeQuantitative(y);
		this.maker.setFieldScaleZero(y, false);
		y.setField(yF);

		return unitSpec;

	}

}

let registry = PlotPlanRegistry.getInstance();
registry.registerPlan(CategoricalBoxPlot.getPlan());

let factory = PlotFactory.getInstance();
factory.register(CategoricalBoxPlot.PLOT_NAME, CategoricalBoxPlot);