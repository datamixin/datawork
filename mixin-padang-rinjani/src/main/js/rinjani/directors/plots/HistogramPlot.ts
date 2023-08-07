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

import ParameterPlan from "padang/plan/ParameterPlan";
import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";

import Histogram from "padang/functions/stat/Histogram";

import * as constants from "vegazoo/constants";

import VegazooCreator from "vegazoo/model/VegazooCreator";
import XTopLevelUnitSpec from "vegazoo/model/XTopLevelUnitSpec";
import XPositionFieldDef from "vegazoo/model/XPositionFieldDef";

import OutputPartSupport from "vegazoo/directors/OutputPartSupport";

import PlotPlan from "rinjani/plan/PlotPlan";
import PlotPlanRegistry from "rinjani/plan/PlotPlanRegistry";

import BasePlot from "rinjani/directors/plots/BasePlot";
import PlotFactory from "rinjani/directors/plots/PlotFactory";
import VegazooPanel from "rinjani/directors/plots/VegazooPanel";

import InputPlanUtils from "rinjani/plan/InputPlanUtils";

export default class HistogramPlot extends BasePlot {

	public static PLOT_NAME = "HistogramPlot";

	public static MAXBINS_PLAN: ParameterPlan = ParameterPlanUtils.createNumberPlan(
		"maxbins",
		"Maximum Bins",
		"Number of maximum bins",
		10
	);

	public static TARGET_PLAN = InputPlanUtils.createSingleContinuousPlanFromParameter(
		Histogram.TARGET_PLAN
	)

	public static getPlan(): PlotPlan {

		let base = Histogram.getPlan();
		let plan = new PlotPlan(
			HistogramPlot.PLOT_NAME,
			"Histogram Plot",
			base.getImage(),
			"Histogram plot"
		);

		let parameters = plan.getParameterList();
		parameters.add(HistogramPlot.MAXBINS_PLAN);

		let args = plan.getInputList();
		args.add(HistogramPlot.TARGET_PLAN);

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
				[11], [12], [22], [26], [28], [31], [34], [35],
				[37], [39], [40], [48], [45], [44], [46], [45],
				[50], [55], [58], [61], [69], [71], [73], [90]
			]
		});
		let unitSpec = this.createUnitSpec(size, btoa("x"), 25, 20);
		this.maker.setCSVDatasetFromTable(unitSpec, table);

		let support = new OutputPartSupport(this.premise);
		support.createSpec(unitSpec, (spec: any) => {
			let panel = new VegazooPanel(spec);
			callback(panel);
		});
	}

	public execute(assignments: XAssignment[], size: Point, callback: (panel: Panel) => void): void {

		if (this.validateAssignments(assignments, callback)) {

			let formula = this.getEncodedPointerAssignment(assignments, HistogramPlot.TARGET_PLAN);
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
		this.maker.setFieldTypeQuantitative(x);
		let maxbins = this.getParameter(HistogramPlot.MAXBINS_PLAN);
		let creator = VegazooCreator.eINSTANCE;
		let bin = creator.createBinParams(maxbins);
		x.setBin(bin);
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
registry.registerPlan(HistogramPlot.getPlan());

let factory = PlotFactory.getInstance();
factory.register(HistogramPlot.PLOT_NAME, HistogramPlot);