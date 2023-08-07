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

import XList from "sleman/model/XList";

import VisageType from "bekasi/visage/VisageType";
import VisageTable from "bekasi/visage/VisageTable";
import VisageValueFactory from "bekasi/visage/VisageValueFactory";

import Learning from "padang/functions/model/Learning";

import CreateDataset from "padang/functions/source/CreateDataset";

import * as constants from "vegazoo/constants";

import XUnitSpec from "vegazoo/model/XUnitSpec";
import VegazooCreator from "vegazoo/model/VegazooCreator";
import XTopLevelLayerSpec from "vegazoo/model/XTopLevelLayerSpec";

import OutputPartSupport from "vegazoo/directors/OutputPartSupport";

import PlotPlan from "rinjani/plan/PlotPlan";
import PlotPlanRegistry from "rinjani/plan/PlotPlanRegistry";

import BasePlot from "rinjani/directors/plots/BasePlot";
import PlotFactory from "rinjani/directors/plots/PlotFactory";
import VegazooPanel from "rinjani/directors/plots/VegazooPanel";

import InputPlanUtils from "rinjani/plan/InputPlanUtils";

export default class ParallelCoordinatePlot extends BasePlot {

	public static PLOT_NAME = "ParallelCoordinatePlot";

	public static MIN = "min";
	public static MAX = "max";
	public static KEY = "key";
	public static VALUE = "value";
	public static INDEX = "index";
	public static LABEL = "label";
	public static NORMAL = "normal";

	public static FEATURES_PLAN = InputPlanUtils.createMultipleContinuousPlan(
		Learning.FEATURES, "Features", "Feature variables"
	)

	public static TARGET_PLAN = InputPlanUtils.createSingleDiscretePlan(
		Learning.TARGET, "Target", "Target variable"
	)

	public static getPlan(): PlotPlan {

		let plan = new PlotPlan(
			ParallelCoordinatePlot.PLOT_NAME,
			"Parallel Coordinate Plot",
			"mdi-view-parallel-outline",
			"Parallel coordinate plot"
		);

		let args = plan.getInputList();
		args.add(ParallelCoordinatePlot.FEATURES_PLAN);
		args.add(ParallelCoordinatePlot.TARGET_PLAN);

		return plan;
	}

	public thumbnail(size: Point, callback: (panel: Panel) => void): void {
		let factory = VisageValueFactory.getInstance();
		let columns = ["a", "b", "c", "class"];
		let table = <VisageTable>factory.create({
			"type": VisageTable.LEAN_NAME,
			"columnsKeys": columns,
			"columnsTypes": [VisageType.FLOAT64, VisageType.FLOAT64, VisageType.FLOAT64, VisageType.STRING],
			"records": [
				[1, 2, 3, "a"],
				[2, 3, 4, "a"],
				[2, 3, 3, "a"],
				[4, 3, 2, "b"],
				[2, 2, 3, "b"],
				[3, 6, 1, "b"],
				[4, 5, 2, "c"],
				[3, 4, 3, "c"],
				[2, 3, 2, "c"],
			]
		});
		this.create(size, table, 0, 10, true, callback);
	}

	public execute(assignments: XAssignment[], size: Point, callback: (panel: Panel) => void): void {

		if (this.validateAssignments(assignments, callback)) {

			// Tambahkan target ke dalam daftar features
			let features = <XList>assignments[0].getExpression();
			let target = assignments[1].getExpression();
			features.addElement(target);
			let name = CreateDataset.FUNCTION_NAME;
			let call = this.maker.createCall(name, [features]);
			this.inspectEvaluate(call, callback, (table: VisageTable) => {
				this.create(size, table, 20, 40, false, callback);
			});
		}

	}

	private create(size: Point, table: VisageTable, spaceWidth: number, spaceHeight: number,
		preview: boolean, callback: (panel: Panel) => void): void {

		// Layer
		let layerSpec = this.maker.createTopLevelLayerSpec();
		this.adjustTopLevelSizeWithSpace(layerSpec, size, spaceWidth, spaceHeight);

		// Data
		let names = this.maker.getTableColumnNames(table);
		let last = names.pop();
		names.splice(0, 1);
		this.maker.setCSVDatasetFromTable(layerSpec, table);
		this.maker.addTransformWindow(layerSpec, "count", ParallelCoordinatePlot.INDEX);
		this.maker.addTransformFold(layerSpec, names);

		// Transforms
		let creator = VegazooCreator.eINSTANCE;
		let aggregate = this.maker.addTransformJoinAggregate(layerSpec);
		creator.addJoinAggregateFieldDef(aggregate, "min", ParallelCoordinatePlot.VALUE, "min");
		creator.addJoinAggregateFieldDef(aggregate, "max", ParallelCoordinatePlot.VALUE, "max");
		creator.setJoinAggregateGroupBy(aggregate, [ParallelCoordinatePlot.KEY]);
		let formula = "(datum.value - datum.min) / (datum.max - datum.min)";
		this.maker.addTransformCalculate(layerSpec, formula, ParallelCoordinatePlot.NORMAL);

		// Layers
		this.addRuleLayer(layerSpec);
		this.addLineLayer(layerSpec, last);
		this.addMaxLayer(layerSpec);
		this.addMinLayer(layerSpec);

		// AxisX Config
		let config = layerSpec.getConfig();
		let axisXConfig = creator.createAxisConfig(false, constants.NULL);
		axisXConfig.setLabelAngle(0);
		axisXConfig.setLabelPadding(10);
		axisXConfig.setTicks(false);
		config.setAxisX(axisXConfig);

		// View Config
		let viewConfig = creator.createViewConfig(constants.NULL);
		config.setView(viewConfig);

		// Mark Config
		let markConfig = creator.createMarkConfig("middle");
		markConfig.setAlign("right");
		markConfig.setDx(-5);
		let style = config.getStyle();
		style.put(ParallelCoordinatePlot.LABEL, markConfig);

		// Legend
		if (preview === true) {
			let legend = creator.createLegendConfigDisable();
			config.setLegend(legend);
		}

		// Spec
		let support = new OutputPartSupport(this.premise);
		support.createSpec(layerSpec, (spec: any) => {
			let panel = new VegazooPanel(spec);
			callback(panel);
		});
	}

	private addRuleLayer(layerSpec: XTopLevelLayerSpec): void {
		let unitSpec = this.maker.addRuleUnitSpecLayer(layerSpec);
		let mark = unitSpec.getMark();
		mark.setColor("gray");
		this.maker.addXFieldDef(unitSpec, ParallelCoordinatePlot.KEY);
	}

	private addLineLayer(layerSpec: XTopLevelLayerSpec, target: string): void {

		let unitSpec = this.maker.addLineUnitSpecLayer(layerSpec);

		// X
		let x = this.maker.addXFieldDef(unitSpec, ParallelCoordinatePlot.KEY);
		this.maker.setFieldTypeNominal(x);

		// Y
		let y = this.maker.addYFieldDef(unitSpec, ParallelCoordinatePlot.NORMAL);
		this.maker.setFieldTypeQuantitative(y);
		this.maker.setFieldAxisNull(y);

		// Color
		let color = this.maker.addColorFieldDef(unitSpec, target);
		this.maker.setFieldTypeNominal(color);

		// Detail
		let detail = this.maker.addDetailFieldDef(unitSpec, ParallelCoordinatePlot.INDEX);
		this.maker.setFieldTypeNominal(detail);

		// Opacity
		this.maker.addOpacityFieldDef(unitSpec, 0.3);
	}

	private addMaxLayer(layerSpec: XTopLevelLayerSpec): void {

		let unitSpec = this.addTextLayer(layerSpec);

		// Y
		let y = this.maker.addYFieldDef(unitSpec, ParallelCoordinatePlot.NORMAL);
		this.maker.setFieldAggregateMax(y);
		this.maker.setFieldTypeQuantitative(y);

		// Text
		let text = this.maker.addTextFieldDef(unitSpec, ParallelCoordinatePlot.MAX);
		this.maker.setFieldAggregateMax(text);
	}

	private addMinLayer(layerSpec: XTopLevelLayerSpec): void {
		let unitSpec = this.addTextLayer(layerSpec);

		// Y
		let y = this.maker.addYFieldDef(unitSpec, ParallelCoordinatePlot.NORMAL);
		this.maker.setFieldAggregateMin(y);
		this.maker.setFieldTypeQuantitative(y);

		// Text
		let text = this.maker.addTextFieldDef(unitSpec, ParallelCoordinatePlot.MIN);
		this.maker.setFieldAggregateMin(text);
	}

	private addTextLayer(layerSpec: XTopLevelLayerSpec): XUnitSpec {

		// Mark
		let unitSpec = this.maker.addTextUnitSpecLayer(layerSpec);
		let mark = unitSpec.getMark();
		mark.setStyle(ParallelCoordinatePlot.LABEL);

		// X
		let x = this.maker.addXFieldDef(unitSpec, ParallelCoordinatePlot.KEY);
		this.maker.setFieldTypeNominal(x);

		return unitSpec;
	}

}

let registry = PlotPlanRegistry.getInstance();
registry.registerPlan(ParallelCoordinatePlot.getPlan());

let factory = PlotFactory.getInstance();
factory.register(ParallelCoordinatePlot.PLOT_NAME, ParallelCoordinatePlot);