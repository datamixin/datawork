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
import VisageTable from "bekasi/visage/VisageTable";
import VisageObject from "bekasi/visage/VisageObject";
import VisageNumber from "bekasi/visage/VisageNumber";

import ClassificationLearning from "padang/functions/model/ClassificationLearning";

import OutputPartSupport from "vegazoo/directors/OutputPartSupport";

import PlotPlan from "rinjani/plan/PlotPlan";
import PlotPlanRegistry from "rinjani/plan/PlotPlanRegistry";

import MatrixPlot from "rinjani/directors/plots/MatrixPlot";
import PlotFactory from "rinjani/directors/plots/PlotFactory";
import VegazooPanel from "rinjani/directors/plots/VegazooPanel";

export default class ClassificationPerformancePlot extends MatrixPlot {

	public static PLOT_NAME = "ClassificationPerformancePlot";

	public static getPlan(): PlotPlan {

		let plan = new PlotPlan(
			ClassificationPerformancePlot.PLOT_NAME,
			"ClassificationPerformancePlot",
			"mdi-shape-outline",
			"Classification Visualization (RadVis) plot"
		);

		return plan;
	}

	public execute(assignments: XAssignment[], size: Point, callback: (panel: Panel) => void): void {

		this.evaluate(assignments, callback, (result: VisageObject) => {

			let classes = (<VisageList>result.getField(ClassificationLearning.CLASSES)).toArray();
			let matrix = <VisageList>result.getField(ClassificationLearning.CONFUSION_MATRIX);

			let minimumWidth = classes.length * MatrixPlot.STEP + 140;
			let minimumHeight = classes.length * MatrixPlot.STEP + 100;
			this.setMinimumSize(minimumWidth, minimumHeight);

			let max = 0;
			for (let i = 0; i < matrix.size(); i++) {
				let record = <VisageList>matrix.get(i);
				for (let j = 0; j < record.size(); j++) {
					let result = (<VisageNumber>record.get(j)).getValue();
					max = Math.max(max, result);
				}
			}

			let unpivot = new VisageTable();
			for (let i = 0; i < matrix.size(); i++) {
				let record = <VisageList>matrix.get(i);
				let x = classes[i];
				for (let j = 0; j < record.size(); j++) {
					let y = classes[j];
					let result = (<VisageNumber>record.get(j)).getValue();
					unpivot.addRecord([x, y, result, result / max]);
				}
			}
			unpivot.setColumns([
				this.maker.createStringColumn(MatrixPlot.X),
				this.maker.createStringColumn(MatrixPlot.Y),
				this.maker.createNumberColumn(MatrixPlot.LABEL),
				this.maker.createNumberColumn(MatrixPlot.VALUE)
			]);

			let width = MatrixPlot.STEP * classes.length;
			let height = MatrixPlot.STEP * classes.length;
			let layerSpec = this.createMatrix(unpivot, size, MatrixPlot.LABEL, MatrixPlot.VALUE, width, height);

			let support = new OutputPartSupport(this.premise);
			support.createSpec(layerSpec, (spec: any) => {
				let panel = new VegazooPanel(spec);
				callback(panel);
			});

		});

	}

}

let registry = PlotPlanRegistry.getInstance();
registry.registerPlan(ClassificationPerformancePlot.getPlan());

let factory = PlotFactory.getInstance();
factory.register(ClassificationPerformancePlot.PLOT_NAME, ClassificationPerformancePlot);