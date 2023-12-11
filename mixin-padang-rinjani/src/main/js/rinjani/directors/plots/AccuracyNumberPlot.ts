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

import VisageObject from "bekasi/visage/VisageObject";
import VisageNumber from "bekasi/visage/VisageNumber";

import XAssignment from "sleman/model/XAssignment";

import ClassificationLearning from "padang/functions/model/ClassificationLearning";

import OutputPartSupport from "vegazoo/directors/OutputPartSupport";

import PlotPlan from "rinjani/plan/PlotPlan";
import PlotPlanRegistry from "rinjani/plan/PlotPlanRegistry";

import Plot from "rinjani/directors/plots/Plot";
import PlotFactory from "rinjani/directors/plots/PlotFactory";
import VegazooPanel from "rinjani/directors/plots/VegazooPanel";

export default class AccuracyNumberPlot extends Plot {

	public static PLOT_NAME = "AccuracyNumberPlot";

	public static getPlan(): PlotPlan {

		let plan = new PlotPlan(
			AccuracyNumberPlot.PLOT_NAME,
			"AccuracyNumberPlot",
			"mdi-numeric",
			"Accuracy number"
		);

		return plan;
	}

	public execute(assignments: XAssignment[], size: Point, callback: (panel: Panel) => void): void {

		this.evaluate(assignments, callback, (result: VisageObject) => {

			let unitSpec = this.maker.createTextTopLevelUnitSpec();
			this.setMinimumSize(150, 60);
			this.adjustTopLevelSizeWithSpace(unitSpec, size, 0, 0);
			this.maker.setInlineDataEmpty(unitSpec);

			let mark = unitSpec.getMark();
			mark.setX(0);
			mark.setAlign("left");
			mark.setBaseline("top");
			mark.setFontSize(16);

			let lines = mark.getText();
			let accuracy = (<VisageNumber>result.getField(ClassificationLearning.ACCURACY_SCORE)).getValue();
			lines.add("Accuracy " + this.maker.format(accuracy, "#.00"));

			let support = new OutputPartSupport(this.premise);
			support.createSpec(unitSpec, (spec: any) => {
				let panel = new VegazooPanel(spec);
				callback(panel);
			});

		});
	}

}

let registry = PlotPlanRegistry.getInstance();
registry.registerPlan(AccuracyNumberPlot.getPlan());

let factory = PlotFactory.getInstance();
factory.register(AccuracyNumberPlot.PLOT_NAME, AccuracyNumberPlot);