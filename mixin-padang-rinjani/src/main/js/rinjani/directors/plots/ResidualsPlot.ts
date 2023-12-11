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

import VisageTable from "bekasi/visage/VisageTable";
import VisageObject from "bekasi/visage/VisageObject";

import RegressionLearning from "padang/functions/model/RegressionLearning";

import * as constants from "vegazoo/constants";

import OutputPartSupport from "vegazoo/directors/OutputPartSupport";

import XTopLevelHConcatSpec from "vegazoo/model/XTopLevelHConcatSpec";

import PlotPlan from "rinjani/plan/PlotPlan";
import PlotPlanRegistry from "rinjani/plan/PlotPlanRegistry";

import MatrixPlot from "rinjani/directors/plots/MatrixPlot";
import PlotFactory from "rinjani/directors/plots/PlotFactory";
import VegazooPanel from "rinjani/directors/plots/VegazooPanel";

export default class ResidualsPlot extends MatrixPlot {

	public static PLOT_NAME = "ResidualsPlot";

	private static HISTOGRAM_WIDTH = 100;

	public static getPlan(): PlotPlan {

		let plan = new PlotPlan(
			ResidualsPlot.PLOT_NAME,
			"ResidualsPlot",
			"mdi-chart-scatter-plot",
			"Residuals plot"
		);

		return plan;
	}

	public execute(assignments: XAssignment[], size: Point, callback: (panel: Panel) => void): void {

		this.evaluate(assignments, callback, (result: VisageObject) => {

			let residuals = <VisageTable>result.getField(RegressionLearning.RESIDUALS);

			// HConcat
			let spec = this.maker.createTopLevelHConcatSpec();
			size = this.setMinimumSize(560, 300);
			this.maker.setCSVDatasetFromTable(spec, residuals);
			size.x -= 120;
			size.y -= 80;
			this.addScatterUnit(spec, size, result);
			this.addHistogramUnit(spec, size);

			let legend = this.maker.createLegendConfigOrient("bottom");
			legend.setOrient("top");
			legend.setTitle(constants.NULL);
			legend.setLabelFontSize(12);
			let config = spec.getConfig();
			config.setLegend(legend);

			// Spec
			let support = new OutputPartSupport(this.premise);
			support.createSpec(spec, (spec: any) => {
				let panel = new VegazooPanel(spec);
				callback(panel);
			});

		});
	}

	private addScatterUnit(concatSpec: XTopLevelHConcatSpec, size: Point, object: VisageObject): void {

		let spec = this.maker.addScatterFacetedUnitSpecHConcat(concatSpec);

		let point = new Point(size.x - ResidualsPlot.HISTOGRAM_WIDTH, size.y);
		this.maker.adjustSize(spec, point);

		// X
		let x = this.maker.addXFieldDef(spec, RegressionLearning.PREDICTION);
		this.maker.setFieldTypeQuantitative(x);
		x.setTitle("Prediction");

		// Y
		let y = this.maker.addYFieldDef(spec, RegressionLearning.ERROR);
		this.maker.setFieldTypeQuantitative(y);
		y.setTitle("Error");

		// Color
		let color = this.maker.addColorFieldDef(spec, RegressionLearning.STAGE);
		let train = this.maker.format(object.getFieldObject(RegressionLearning.TRAIN_SCORE), "#.00");
		let test = this.maker.format(object.getFieldObject(RegressionLearning.TEST_SCORE), "#.00");
		let expr = "datum.label == 'test' ? 'Test R²=" + test + "' : 'Train R²=" + train + "'";
		let legend = this.maker.createLegendLabelExpr(expr);
		color.setLegend(legend);

	}

	private addHistogramUnit(concatSpec: XTopLevelHConcatSpec, size: Point): void {

		let spec = this.maker.addBarFacetedUnitSpecHConcat(concatSpec);
		let point = new Point(ResidualsPlot.HISTOGRAM_WIDTH, size.y);
		this.maker.adjustSize(spec, point);

		// X
		let x = this.maker.addXFieldDef(spec, RegressionLearning.ERROR);
		x.setAggregate(constants.AggregateOp.COUNT);
		x.setTitle("Distribution");

		// Y
		let y = this.maker.addYFieldDef(spec, RegressionLearning.ERROR);
		this.maker.setFieldTypeQuantitative(y);
		let binParams = this.maker.createBinParams(50);
		y.setBin(binParams)
		y.setTitle(constants.NULL);
		y.setAxis(constants.NULL);

		// Color
		this.maker.addColorFieldDef(spec, RegressionLearning.STAGE);

	}

}

let registry = PlotPlanRegistry.getInstance();
registry.registerPlan(ResidualsPlot.getPlan());

let factory = PlotFactory.getInstance();
factory.register(ResidualsPlot.PLOT_NAME, ResidualsPlot);