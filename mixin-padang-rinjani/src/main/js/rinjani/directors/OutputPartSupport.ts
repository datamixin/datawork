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

import EList from "webface/model/EList";

import Point from "webface/graphics/Point";

import ConductorPanel from "webface/wef/ConductorPanel";

import VisageValue from "bekasi/visage/VisageValue";

import GraphicPremise from "padang/ui/GraphicPremise";

import XRoutine from "rinjani/model/XRoutine";
import XParameter from "rinjani/model/XParameter";

import PlotPlanRegistry from "rinjani/plan/PlotPlanRegistry";

import OutputSpecPart from "rinjani/directors/OutputSpecPart";

import PlotFactory from "rinjani/directors/plots/PlotFactory";
import MappingMaker from "rinjani/directors/plots/MappingMaker";
import MessagePanel from "rinjani/directors/plots/MessagePanel";

export default class OutputPartSupport {

	private lastSpec: any = {};
	private premise: GraphicPremise = null;

	constructor(premise: GraphicPremise) {
		this.premise = premise;
	}

	public getPremise(): GraphicPremise {
		return this.premise;
	}

	public getLastSpec(): any {
		return this.lastSpec;
	}

	public getPlotResult(model: XRoutine, size: Point, callback: (panel: Panel) => void): void {
		let name = model.getName();
		if (name === null) {
			let message = "Routine name not defined";
			let panel = new MessagePanel(message, true);
			callback(panel);
		} else {
			let registry = PlotPlanRegistry.getInstance();
			let plan = registry.getPlan(name);
			let maker = new MappingMaker(this.premise);
			let message = maker.validateInputs(plan, model);
			if (message === null) {
				let parameters = model.getParameters();
				this.buildParameters(parameters, (options: Map<string, any>) => {
					let args = maker.createAssignments(plan, model);
					let factory = PlotFactory.getInstance();
					let plot = factory.create(name, plan, this.premise, options);
					plot.execute(args, size, (panel: ConductorPanel) => {
						let part = <OutputSpecPart><any>panel;
						if (part.getSpec) {
							this.lastSpec = part.getSpec();
						}
						callback(panel);
					});
				});
			} else {
				let panel = new MessagePanel(message);
				callback(panel);
			}
		}
	}

	public buildParameters(list: EList<XParameter>, callback: (options: Map<string, VisageValue>) => void): void {

		let options = new Map<string, any>();
		if (list.size === 0) {

			// Tidak menunggu parameter karena kosong
			callback(options);

		} else {

			// Parameter di evaluate di server terlebih dahulu
			let counter = 0;
			for (let parameter of list) {
				let value = parameter.getValue();
				let expression = this.premise.parse(value);
				this.premise.evaluate(expression, (result: VisageValue) => {
					let name = parameter.getName();
					options.set(name, result);
					counter++;
					if (counter === list.size) {
						callback(options);
					}
				});
			}
		}
	}

}

