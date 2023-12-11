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
import VisageColumn from "bekasi/visage/VisageColumn";
import VisageValueFactory from "bekasi/visage/VisageValueFactory";

import CorrelationRank from "padang/functions/feature/CorrelationRank";

import OutputPartSupport from "vegazoo/directors/OutputPartSupport";

import * as rinjani from "rinjani/rinjani";

import PlotPlan from "rinjani/plan/PlotPlan";
import PlotPlanRegistry from "rinjani/plan/PlotPlanRegistry";

import Plot from "rinjani/directors/plots/Plot";
import MatrixPlot from "rinjani/directors/plots/MatrixPlot";
import PlotFactory from "rinjani/directors/plots/PlotFactory";
import VegazooPanel from "rinjani/directors/plots/VegazooPanel";

import InputPlanUtils from "rinjani/plan/InputPlanUtils";
import VisageType from "bekasi/visage/VisageType";

export default class CorrelationRankPlot extends Plot {

	public static PLOT_NAME = "CorrelationRankPlot";

	public static LEFT = "left";
	public static RIGHT = "right";
	public static VALUE = "value";

	public static FEATURES_PLAN = InputPlanUtils.createMultipleContinuousPlanFromParameter(
		CorrelationRank.FEATURES_PLAN
	)

	public static getPlan(): PlotPlan {

		let base = CorrelationRank.getPlan();
		let plan = new PlotPlan(
			CorrelationRankPlot.PLOT_NAME,
			"Correlation Rank Plot",
			base.getImage(),
			"Correlation rank plot"
		);

		let parameters = plan.getParameterList();
		parameters.add(CorrelationRank.ALGORITHM_PLAN);

		let args = plan.getInputList();
		args.add(CorrelationRankPlot.FEATURES_PLAN);

		return plan;
	}

	public thumbnail(size: Point, callback: (panel: Panel) => void): void {
		let factory = VisageValueFactory.getInstance();
		let columns = ["column", "a", "b", "c"];
		let table = <VisageTable>factory.create({
			"type": VisageTable.LEAN_NAME,
			"columnsKeys": columns,
			"columnsTypes": [VisageType.STRING, VisageType.FLOAT64, VisageType.FLOAT64, VisageType.FLOAT64],
			"records": [
				["a", 1, -0.1, 0.8],
				["b", -0.1, 1, -0.4],
				["c", 0.8, -0.4, 1],
			]
		});
		this.create(size, table, 10, 10, callback);
	}

	public execute(assignments: XAssignment[], size: Point, callback: (panel: Panel) => void): void {

		// Inputs
		let name = CorrelationRank.FUNCTION_NAME;
		this.evaluateFunction(name, assignments, callback, (table: VisageTable) => {
			this.create(size, table, 0, 0, callback);
		});
	}

	private create(size: Point, table: VisageTable,
		spaceWidth: number, spaceHeight: number, callback: (panel: Panel) => void): void {

		// Unpivot
		let unpivot = new VisageTable();
		let passed = new Map<string, []>();
		for (let i = 0; i < table.recordCount(); i++) {

			let record = table.getRecord(i);
			let columns = table.getColumns();
			let left = record.getValue(1);

			for (let j = 2; j < columns.length; j++) {

				let right = columns[j].getKey();
				let output = record.getValue(j);

				if (passed.has(right)) {
					let list = <any[]>passed.get(right);
					if (list.indexOf(left) >= 0) {
						continue;
					}
				}
				unpivot.addRecord([left, right, output]);

				if (!passed.has(left)) {
					passed.set(left, []);
				}
				let list = <any[]>passed.get(left);
				list.push(right);
			}
		}
		unpivot.setColumns([
			new VisageColumn(CorrelationRankPlot.LEFT),
			new VisageColumn(CorrelationRankPlot.RIGHT),
			new VisageColumn(CorrelationRankPlot.VALUE),
		]);

		let layerSpec = this.maker.createTopLevelLayerSpec();
		let minimumWidth = passed.size * MatrixPlot.STEP;
		let minimumHeight = passed.size * MatrixPlot.STEP;
		this.setMinimumSize(minimumWidth, minimumHeight);
		this.adjustTopLevelSizeWithSpace(layerSpec, size, spaceWidth, spaceHeight);
		this.maker.setWidthEqualHeight(layerSpec);
		this.maker.setCSVDatasetFromTable(layerSpec, unpivot);

		// X
		let x = this.maker.addXFieldDef(layerSpec, CorrelationRankPlot.LEFT);
		this.maker.setFieldTitleNull(x);
		this.maker.setFieldSortNull(x);

		// Y
		let y = this.maker.addYFieldDef(layerSpec, CorrelationRankPlot.RIGHT);
		this.maker.setFieldTitleNull(y);
		this.maker.setFieldSortNull(y);

		// Rect
		let rectSpec = this.maker.addRectUnitSpecLayer(layerSpec);
		let color = this.maker.addColorFieldDef(rectSpec, CorrelationRankPlot.VALUE);
		this.maker.setFieldTypeQuantitative(color);
		this.maker.setFieldScaleRangeDomain(color, rinjani.BLUE_WHITE_RED, -1, 1);

		// Text
		let textSpec = this.maker.addTextUnitSpecLayer(layerSpec);
		let text = this.maker.addTextFieldDef(textSpec, CorrelationRankPlot.VALUE);
		text.setFormat(".2f");

		// Spec
		let support = new OutputPartSupport(this.premise);
		support.createSpec(layerSpec, (spec: any) => {
			let panel = new VegazooPanel(spec);
			callback(panel);
		});

	}

}

let registry = PlotPlanRegistry.getInstance();
registry.registerPlan(CorrelationRankPlot.getPlan());

let factory = PlotFactory.getInstance();
factory.register(CorrelationRankPlot.PLOT_NAME, CorrelationRankPlot);