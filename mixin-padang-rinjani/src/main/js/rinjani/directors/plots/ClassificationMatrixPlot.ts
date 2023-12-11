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

export default class ClassificationMatrixPlot extends MatrixPlot {

	public static PLOT_NAME = "ClassificationMatrixPlot";

	public static getPlan(): PlotPlan {

		let plan = new PlotPlan(
			ClassificationMatrixPlot.PLOT_NAME,
			"ClassificationMatrixPlot",
			"mdi-grid",
			"Classification matrix plot"
		);

		return plan;
	}

	public execute(assignments: XAssignment[], size: Point, callback: (panel: Panel) => void): void {

		this.evaluate(assignments, callback, (result: VisageObject) => {

			let measures = ["Precision", "Recall", "F-Score", "Support"];
			let classes = (<VisageList>result.getField(ClassificationLearning.CLASSES)).toArray();
			let summary = <VisageList>result.getField(ClassificationLearning.SUMMARY);
			let unpivot = new VisageTable();
			let sum = 0;

			let minimumWidth = 4 * MatrixPlot.STEP + 140;
			let minimumHeight = classes.length * MatrixPlot.STEP + 100;
			this.setMinimumSize(minimumWidth, minimumHeight);

			// Precision, Recall and F-Score
			for (let i = 0; i < measures.length; i++) {
				let record = <VisageList>summary.get(i);
				let x = measures[i];
				for (let j = 0; j < record.size(); j++) {
					let y = classes[j];
					let result = (<VisageNumber>record.get(j)).getValue();
					if (i < 3) {
						unpivot.addRecord([x, y, Math.round(1e2 * result) / 1e2, result]);
					} else {
						sum += result;
					}
				}
			}

			// Support
			let record = <VisageList>summary.get(3);
			let x = measures[3];
			for (let j = 0; j < record.size(); j++) {
				let y = classes[j];
				let result = (<VisageNumber>record.get(j)).getValue();
				unpivot.addRecord([x, y, result, result / sum]);
			}
			unpivot.setColumns([
				this.maker.createStringColumn(MatrixPlot.X),
				this.maker.createStringColumn(MatrixPlot.Y),
				this.maker.createNumberColumn(MatrixPlot.LABEL),
				this.maker.createNumberColumn(MatrixPlot.VALUE)
			]);

			let width = MatrixPlot.STEP * measures.length;
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
registry.registerPlan(ClassificationMatrixPlot.getPlan());

let factory = PlotFactory.getInstance();
factory.register(ClassificationMatrixPlot.PLOT_NAME, ClassificationMatrixPlot);