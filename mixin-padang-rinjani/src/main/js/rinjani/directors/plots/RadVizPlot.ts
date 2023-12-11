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

import VisageList from "bekasi/visage/VisageList";
import VisageText from "bekasi/visage/VisageText";
import VisageObject from "bekasi/visage/VisageObject";
import VisageNumber from "bekasi/visage/VisageNumber";
import VisageValueFactory from "bekasi/visage/VisageValueFactory";

import RadViz from "padang/functions/feature/RadViz";

import XUnitSpec from "vegazoo/model/XUnitSpec";
import VegazooCreator from "vegazoo/model/VegazooCreator";
import XTopLevelLayerSpec from "vegazoo/model/XTopLevelLayerSpec";

import OutputPartSupport from "vegazoo/directors/OutputPartSupport";

import PlotPlan from "rinjani/plan/PlotPlan";
import PlotPlanRegistry from "rinjani/plan/PlotPlanRegistry";

import Plot from "rinjani/directors/plots/Plot";
import PlotFactory from "rinjani/directors/plots/PlotFactory";
import VegazooPanel from "rinjani/directors/plots/VegazooPanel";

import InputPlanUtils from "rinjani/plan/InputPlanUtils";

export default class RadVizPlot extends Plot {

	public static PLOT_NAME = "RadVizPlot";
	public static X = "x";
	public static Y = "y";
	public static T = "t";
	public static SIN_T = "sin(t)";
	public static COS_T = "cos(t)";
	public static LABEL = "label";
	public static POINTS = "points";
	public static CORNERS = "corners";

	public static FEATURES_PLAN = InputPlanUtils.createMultipleContinuousPlanFromParameter(
		RadViz.FEATURES_PLAN, 3
	)

	public static TARGET_PLAN = InputPlanUtils.createSingleDiscretePlanFromParameter(
		RadViz.TARGET_PLAN
	)

	public static getPlan(): PlotPlan {

		let base = RadViz.getPlan();
		let plan = new PlotPlan(
			RadVizPlot.PLOT_NAME,
			"RadVizPlot",
			base.getImage(),
			"Radial Visualization (RadVis) plot"
		);

		let args = plan.getInputList();
		args.add(RadVizPlot.FEATURES_PLAN);
		args.add(RadVizPlot.TARGET_PLAN);

		return plan;
	}

	public thumbnail(size: Point, callback: (panel: Panel) => void): void {
		let names = ["A", "B", "C"];
		let factory = VisageValueFactory.getInstance();
		let result = <VisageObject>factory.create({
			"points": [
				[-0.2, 0.5, "x"],
				[-0.1, 0.5, "x"],
				[-0.2, 0.6, "x"],
				[-0.3, 0.5, "y"],
				[-0.1, 0.5, "y"],
				[-0.1, 0.4, "y"],
				[-0.3, -0.6, "y"],
				[-0.1, -0.5, "z"],
				[0.4, 0.5, "z"],
				[0.1, 0.4, "z"]
			],
			"corners":
				[[1, 0],
				[-0.5, 0.8],
				[-0.5, -0.8]]
		});
		this.create(names, size, result, callback, 0, 0, true);
	}

	public execute(assignments: XAssignment[], size: Point, callback: (panel: Panel) => void): void {

		// Inputs
		let name = RadViz.FUNCTION_NAME;
		this.evaluateFunction(name, assignments, callback, (result: VisageObject) => {

			let names = this.getFeatureNames(assignments, RadVizPlot.FEATURES_PLAN);
			this.create(names, size, result, callback, 20, 40, false);

		});

	}

	public create(names: string[], size: Point, result: VisageObject, callback: (panel: Panel) => void,
		spaceWidth: number, spaceHeight: number, preview: boolean): void {

		// Scatter and corner Layer
		let layerSpec = this.maker.createTopLevelLayerSpec();
		if (preview === true) {
			let legend = this.maker.createLegendConfigDisable();
			let config = layerSpec.getConfig();
			config.setLegend(legend);
		}
		this.adjustTopLevelSizeWithSpace(layerSpec, size, spaceWidth, spaceHeight);
		this.maker.setWidthEqualHeight(layerSpec);
		this.addScatterLayer(layerSpec, result);
		this.addLineLayer(layerSpec);
		this.addPointTextPart(names, layerSpec, result);

		let support = new OutputPartSupport(this.premise);
		support.createSpec(layerSpec, (spec: any) => {
			let panel = new VegazooPanel(spec);
			callback(panel);
		});

	}

	private addLineLayer(layerSpec: XTopLevelLayerSpec): void {

		// Line
		let scatterUnit = this.maker.addLineUnitSpecLayer(layerSpec);

		// Generator
		let count = 1001;
		let creator = VegazooCreator.eINSTANCE;
		let generator = creator.createSequenceGenerator(0, count, 1, RadVizPlot.X);
		scatterUnit.setData(generator);

		// Transform
		this.maker.addTransformCalculate(scatterUnit, "2 * PI * (datum.x / " + (count - 1) + ")", RadVizPlot.T);
		this.maker.addTransformCalculate(scatterUnit, "sin(datum.t)", RadVizPlot.SIN_T);
		this.maker.addTransformCalculate(scatterUnit, "cos(datum.t)", RadVizPlot.COS_T)

		// X
		let x = this.maker.addXFieldDef(scatterUnit, RadVizPlot.COS_T);
		this.maker.setFieldTypeQuantitative(x);
		this.maker.setFieldAxisNull(x);

		// Y
		let y = this.maker.addYFieldDef(scatterUnit, RadVizPlot.SIN_T);
		this.maker.setFieldTypeQuantitative(y);
		this.maker.setFieldAxisNull(y);

		// Order
		this.maker.addOrderFieldDef(scatterUnit, RadVizPlot.T);

	}

	private addScatterLayer(layerSpec: XTopLevelLayerSpec, result: VisageObject): void {

		// Scatter
		let scatterUnit = this.maker.addScatterUnitSpecLayer(layerSpec);
		let points = <VisageList>result.getField(RadVizPlot.POINTS);
		this.addData(scatterUnit, points);

		// Color
		this.maker.createColorFieldDef(scatterUnit, RadVizPlot.LABEL);

	}

	private addPointTextPart(names: string[], layerSpec: XTopLevelLayerSpec, result: VisageObject): void {

		let list = <VisageList>result.getField(RadVizPlot.CORNERS);
		let values = list.getValues()

		// Duplicate first record to last record to close polyline
		let first = <VisageList>list.get(0);
		let last = new VisageList();
		for (let value of first.toArray()) {
			let cell = new VisageNumber(value);
			last.add(cell);
		}

		// Add index and label
		for (let i = 0; i < values.length; i++) {
			let record = <VisageList>list.get(i);
			let label = new VisageText(names[i]);
			record.add(label);
		}

		this.addPointLayer(layerSpec, list);
		this.addTextLayer(layerSpec, list);
	}

	private addPointLayer(layerSpec: XTopLevelLayerSpec, records: VisageList): void {

		// Corner
		let cornerUnit = this.maker.addScatterUnitSpecLayer(layerSpec);
		let mark = cornerUnit.getMark();
		mark.setColor("green");

		// Tambah data
		this.addData(cornerUnit, records);

	}

	private addTextLayer(layerSpec: XTopLevelLayerSpec, records: VisageList): void {

		// Corners
		let labelUnit = this.maker.addTextUnitSpecLayer(layerSpec);

		// Tambah data
		this.addData(labelUnit, records);

		// Text
		this.maker.addTextFieldDef(labelUnit, RadVizPlot.LABEL);

		// Align
		let mark = labelUnit.getMark();
		this.maker.setMarkAlignExpr(mark, "round(datum.x * 10e3) == 0 ? 'center': round(datum.x * 10e3) < 0 ? 'right' : 'left'");
		this.maker.setMarkDxExpr(mark, "round(datum.x * 10e3) == 0 ? 0: round(datum.x * 10e3) < 0 ? -5 : 5");
		this.maker.setMarkDyExpr(mark, "round(datum.y * 10e3) == 0 ? 0: round(datum.y * 10e3) < 0 ? 10 : -10");

	}

	private addData(unitSpec: XUnitSpec, records: VisageList): void {

		// Data
		let columns = [RadVizPlot.X, RadVizPlot.Y, RadVizPlot.LABEL];
		this.maker.setCSVDatasetFromRowList(unitSpec, records, columns);

		// X
		let x = this.maker.addXFieldDef(unitSpec, RadVizPlot.X);
		this.maker.setFieldTypeQuantitative(x);
		this.maker.setFieldAxisNull(x);

		// Y
		let y = this.maker.addYFieldDef(unitSpec, RadVizPlot.Y);
		this.maker.setFieldTypeQuantitative(y);
		this.maker.setFieldAxisNull(y);

	}

}

let registry = PlotPlanRegistry.getInstance();
registry.registerPlan(RadVizPlot.getPlan());

let factory = PlotFactory.getInstance();
factory.register(RadVizPlot.PLOT_NAME, RadVizPlot);