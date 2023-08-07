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

import GraphicPremise from "padang/ui/GraphicPremise";

import MessagePanel from "rinjani/directors/plots/MessagePanel";

import * as malang from "malang/malang";

import XModeler from "malang/model/XModeler";

import PreloadPanel from "malang/panels/PreloadPanel";

import Preload from "malang/directors/preloads/Preload";

import DatasetPreloadPanel from "malang/directors/preloads/DatasetPreloadPanel";

export abstract class DatasetPreload extends Preload {

	constructor(name: string, group: string) {
		super(name, group);
	}

	public getPresume(): string {
		return malang.RESULT_ICON_MAP.TABLE;
	}

	public getResult(premise: GraphicPremise, model: XModeler,
		size: Point, callback: (panel: PreloadPanel) => void): void {
		let expression = this.createExpression(premise, model);
		premise.evaluate(expression, (result: any) => {
			if (result instanceof VisageError) {
				let message = result.getMessage();
				let panel = new MessagePanel(message);
				callback(panel);
			} else if (result instanceof VisageTable) {
				let caption = this.getCaption();
				let panel = new DatasetPreloadPanel(caption, result, size);
				callback(panel);
			} else {
				this.alternateResult(result, size, callback);
			}
		});
	}

	public alternateResult(_value: VisageValue, _size: Point, _callback: (panel: PreloadPanel) => void): void {
	}

	public abstract createExpression(premise: GraphicPremise, model: XModeler): XExpression;

}

export default DatasetPreload;
