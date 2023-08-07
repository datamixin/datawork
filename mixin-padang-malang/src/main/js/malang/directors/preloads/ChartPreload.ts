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
import Point from "webface/graphics/Point";

import XExpression from "sleman/model/XExpression";

import VisageValue from "bekasi/visage/VisageValue";
import VisageError from "bekasi/visage/VisageError";
import VisageTable from "bekasi/visage/VisageTable";
import VisageObject from "bekasi/visage/VisageObject";

import BuilderPremise from "padang/ui/BuilderPremise";

import XTopLevelSpec from "vegazoo/model/XTopLevelSpec";

import OutputPartSupport from "vegazoo/directors/OutputPartSupport";

import MessagePanel from "rinjani/directors/plots/MessagePanel";

import XModeler from "malang/model/XModeler";

import PreloadPanel from "malang/panels/PreloadPanel";

import Preload from "malang/directors/preloads/Preload";

import ChartPreloadPanel from "malang/directors/preloads/ChartPreloadPanel";

export abstract class ChartPreload extends Preload {

	private presume: string = null;

	constructor(group: string, name: string, presume: string) {
		super(group, name);
		this.presume = presume;
	}

	public getPresume(): string {
		return this.presume;
	}

	public getResult(premise: BuilderPremise, model: XModeler,
		size: Point, callback: (panel: PreloadPanel) => void): void {
		let expression = this.createExpression(premise, model);
		premise.evaluate(expression, (result: any) => {
			let caption = this.getCaption();
			if (result instanceof VisageError) {
				let message = result.getMessage();
				let panel = new MessagePanel(message);
				callback(panel);
			} else if (result instanceof VisageTable || result instanceof VisageObject) {
				this.createSpec(result, size, (spec: XTopLevelSpec) => {
					let support = new OutputPartSupport(premise);
					support.createSpec(spec, (spec: any) => {
						let panel = new ChartPreloadPanel(caption, spec, size);
						callback(panel);
					});
				});
			} else {
				this.alternateResult(result, size, callback);
			}
		});
	}

	public abstract getCaption(): string;

	public abstract createExpression(premise: BuilderPremise, model: XModeler): XExpression;

	public abstract createSpec(result: VisageValue, size: Point, callback: (spec: XTopLevelSpec) => void): void;

	public alternateResult(_value: VisageValue, _size: Point, _callback: (panel: PreloadPanel) => void): void {
	}

}

export default ChartPreload;
