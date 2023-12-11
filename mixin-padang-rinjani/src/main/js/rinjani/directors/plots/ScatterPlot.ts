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

import XUnitSpec from "vegazoo/model/XUnitSpec";
import XPositionFieldDef from "vegazoo/model/XPositionFieldDef";
import XTopLevelLayerSpec from "vegazoo/model/XTopLevelLayerSpec";

import OutputPartSupport from "vegazoo/directors/OutputPartSupport";

import PlotPlan from "rinjani/plan/PlotPlan";
import PlotPlanRegistry from "rinjani/plan/PlotPlanRegistry";

import BasePlot from "rinjani/directors/plots/BasePlot";
import PlotFactory from "rinjani/directors/plots/PlotFactory";
import VegazooPanel from "rinjani/directors/plots/VegazooPanel";

import InputPlanUtils from "rinjani/plan/InputPlanUtils";
import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";

export default class ScatterPlot extends BasePlot {

	public static PLOT_NAME = "ScatterPlot";
	public static X = "x";
	public static Y = "y";
	public static LINEAR = "linear";
	public static LOGARITHMIC = "log";
	public static EXPONENTIAL = "exp";
	public static POWER = "pow";
	public static QUADRATIC = "quad";
	public static PLYNOMIAL = "poly";
	public static REGRESSIONS = [
		ScatterPlot.LINEAR,
		ScatterPlot.LOGARITHMIC,
		ScatterPlot.EXPONENTIAL,
		ScatterPlot.POWER,
		ScatterPlot.QUADRATIC,
		ScatterPlot.PLYNOMIAL
	];

	public static X_PLAN = InputPlanUtils.createSingleDiscretePlan(
		ScatterPlot.X, "X", "Discrete values",
	)

	public static Y_PLAN = InputPlanUtils.createSingleDiscretePlan(
		ScatterPlot.Y, "Y", "Continues values",
	)

	public static REGRESSION_PLAN = ParameterPlanUtils.createTextPlan(
		"regression", "Regression", "Regression line", "linear",
		"=['"
		+ ScatterPlot.LINEAR + "', '"
		+ ScatterPlot.LOGARITHMIC + "', '"
		+ ScatterPlot.EXPONENTIAL + "', '"
		+ ScatterPlot.POWER + "', '"
		+ ScatterPlot.QUADRATIC + "', '"
		+ ScatterPlot.PLYNOMIAL + "']");

	public static getPlan(): PlotPlan {

		let plan = new PlotPlan(
			ScatterPlot.PLOT_NAME,
			"Scatter Plot",
			"mdi-choxt-box",
			"Scatter plot"
		);

		let inputs = plan.getInputList();
		inputs.add(ScatterPlot.X_PLAN);
		inputs.add(ScatterPlot.Y_PLAN);

		let parameters = plan.getParameterList();
		parameters.add(ScatterPlot.REGRESSION_PLAN);

		return plan;
	}

	public thumbnail(size: Point, callback: (panel: Panel) => void): void {

		let factory = VisageValueFactory.getInstance();
		let columns = [ScatterPlot.X, ScatterPlot.Y];
		let table = <VisageTable>factory.create({
			"type": VisageTable.LEAN_NAME,
			"columnsKeys": columns,
			"columnsTypes": [VisageType.STRING, VisageType.NUMBER],
			"records": [
				[1.0, 2], [1.1, 3], [1.6, 4], [1.9, 4], [1.4, 3], [1.2, 2],
				[2.1, 5], [2.2, 6], [2.3, 5], [2.0, 4], [2.5, 5], [2.6, 6], [2.7, 7], [2.8, 5],
				[3.2, 7], [3.5, 8], [3.7, 9], [3.9, 9],
			]
		});
		let unitSpec = this.createLayerSpec(size, btoa("x"), btoa("y"), 25, 20);
		this.maker.setCSVDatasetFromTable(unitSpec, table);

		let support = new OutputPartSupport(this.premise);
		support.createSpec(unitSpec, (spec: any) => {
			let panel = new VegazooPanel(spec);
			callback(panel);
		});
	}

	public execute(assignments: XAssignment[], size: Point, callback: (panel: Panel) => void): void {

		if (this.validateAssignments(assignments, callback)) {

			let xf = this.getEncodedPointerAssignment(assignments, ScatterPlot.X_PLAN);
			let yf = this.getEncodedPointerAssignment(assignments, ScatterPlot.Y_PLAN);
			let unitSpec = this.createLayerSpec(size, xf, yf, 40, 80);

			let support = new OutputPartSupport(this.premise);
			support.createSpec(unitSpec, (spec: any) => {
				let panel = new VegazooPanel(spec);
				callback(panel);
			});

		}

	}

	private createLayerSpec(size: Point, xF: string, yF: string,
		spaceWidth: number, spaceHeight: number): XTopLevelLayerSpec {

		// Plot
		let layerSpec = this.maker.createTopLevelLayerSpec(true);
		this.adjustTopLevelSizeWithSpace(layerSpec, size, spaceWidth, spaceHeight);

		this.createScatterSpec(layerSpec, xF, yF);
		let regression = this.getParameter(ScatterPlot.REGRESSION_PLAN);
		if (ScatterPlot.REGRESSIONS.indexOf(regression) !== -1) {
			this.createRegressionSpec(layerSpec, xF, yF);
		}

		return layerSpec;

	}

	private createScatterSpec(layer: XTopLevelLayerSpec, xF: string, yF: string): XUnitSpec {

		// Scatter
		let unitSpec = this.maker.addScatterUnitSpecLayer(layer);
		let encoding = unitSpec.getEncoding();

		// X
		let x = <XPositionFieldDef>encoding.getX();
		this.maker.setFieldTypeQuantitative(x);
		this.maker.setFieldScaleZero(x, false);
		x.setField(xF);

		// Y
		let y = <XPositionFieldDef>encoding.getY();
		this.maker.setFieldTypeQuantitative(y);
		this.maker.setFieldScaleZero(y, false);
		y.setField(yF);

		return unitSpec;

	}

	private createRegressionSpec(layer: XTopLevelLayerSpec, xF: string, yF: string): XUnitSpec {

		// Line
		let unitSpec = this.maker.addLineUnitSpecLayer(layer);
		let mark = unitSpec.getMark();
		mark.setColor("firebrick");

		// Transform
		let method = this.getParameter(ScatterPlot.REGRESSION_PLAN);
		this.maker.addTransformRegression(unitSpec, method, "x", "y");

		// X
		let encoding = unitSpec.getEncoding();
		let x = <XPositionFieldDef>encoding.getX();
		this.maker.setFieldTypeQuantitative(x);
		this.maker.setFieldScaleZero(x, false);
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
registry.registerPlan(ScatterPlot.getPlan());

let factory = PlotFactory.getInstance();
factory.register(ScatterPlot.PLOT_NAME, ScatterPlot);