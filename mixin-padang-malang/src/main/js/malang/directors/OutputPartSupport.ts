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
import Conductor from "webface/wef/Conductor";
import ConductorPanel from "webface/wef/ConductorPanel";

import EList from "webface/model/EList";

import Point from "webface/graphics/Point";

import Control from "webface/widgets/Control";
import Composite from "webface/widgets/Composite";

import VisageValue from "bekasi/visage/VisageValue";

import BuilderPremise from "padang/ui/BuilderPremise";

import MessagePanel from "rinjani/directors/plots/MessagePanel";

import XModeler from "malang/model/XModeler";
import XParameter from "malang/model/XParameter";

import * as directors from "malang/directors";

import PreloadPanel from "malang/panels/PreloadPanel";
import PredictionTryoutPanel from "malang/panels/PredictionTryoutPanel";

import OutputPartViewer from "malang/ui/OutputPartViewer";

import Executor from "malang/directors/executors/Executor";

import BaseOutputPartDirector from "malang/directors/BaseOutputPartDirector";
import BaseExposePartDirector from "malang/directors/BaseExposePartDirector";

import PreloadRegistry from "malang/directors/preloads/PreloadRegistry";

import OutputControllerFactory from "malang/controller/output/OutputControllerFactory";
import XBuilder from "padang/model/XBuilder";

export default class OutputPartSupport {

	private premise: BuilderPremise = null;

	constructor(premise: BuilderPremise) {
		this.premise = premise;
	}

	public getPremise(): BuilderPremise {
		return this.premise;
	}

	public getPreloadResult(name: string, model: XModeler, size: Point, callback: (panel: PreloadPanel) => void): void {
		let registry = PreloadRegistry.getInstance();
		let preload = registry.get(name);
		preload.getResult(this.premise, model, size, callback);
	}

	public getResultPanel(model: XModeler, callback: (panel: ConductorPanel) => void): void {
		let conductor = new OutputPartConductor();
		let panel = new OutputPartViewerPanel(conductor, this.premise, model);
		callback(panel);
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


	public getTryoutPanel(model: XModeler, callback: (panel: Panel) => void): void {
		if (this.premise.isVariableExists(Executor.RESULT)) {
			let panel = new PredictionTryoutPanel(this.premise, model);
			callback(panel);
		} else {
			let message = "Model learning is missing";
			let panel = new MessagePanel(message);
			callback(panel);
		}
	}

}

class OutputPartConductor implements Conductor {

	public submit(): void {

	}
}

class OutputPartViewerPanel extends ConductorPanel {

	private premise: BuilderPremise = null;
	private viewer: OutputPartViewer = null;
	private model: XModeler = null;

	constructor(conductor: Conductor, premise: BuilderPremise, model: XModeler) {
		super(conductor);
		this.premise = premise;
		this.model = model;
		let builder = <XBuilder>premise.getModel();
		this.viewer = new OutputPartViewer(builder);
		this.viewer.setControllerFactory(new OutputControllerFactory());
		this.registerOutputPartDirector();
		this.registerExposePartDirector();
	}

	private registerOutputPartDirector(): void {
		let director = new BaseOutputPartDirector(this.viewer, this.premise);
		this.viewer.registerDirector(directors.OUTPUT_PART_DIRECTOR, director);
	}

	private registerExposePartDirector(): void {
		let director = new BaseExposePartDirector(this.viewer, this.premise);
		this.viewer.registerDirector(directors.EXPOSE_PART_DIRECTOR, director);
	}

	public createControl(parent: Composite, index: number) {
		this.viewer.createControl(parent, index);
		this.viewer.setContents(this.model);
	}

	public getControl(): Control {
		return this.viewer.getControl();
	}

}
