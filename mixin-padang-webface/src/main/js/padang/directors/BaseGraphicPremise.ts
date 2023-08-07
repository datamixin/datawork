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
import EObject from "webface/model/EObject";

import BaseControllerViewer from "webface/wef/base/BaseControllerViewer";

import XExpression from "sleman/model/XExpression";

import VisageValue from "bekasi/visage/VisageValue";

import * as padang from "padang/padang";
import * as directors from "padang/directors";

import ValueMapping from "padang/util/ValueMapping";

import GraphicPremise from "padang/ui/GraphicPremise";

export default class BaseGraphicPremise implements GraphicPremise {

	protected viewer: BaseControllerViewer = null;
	protected model: EObject = null;
	protected mapping: ValueMapping = null;

	constructor(viewer: BaseControllerViewer, model: EObject, mapping: ValueMapping) {
		this.viewer = viewer;
		this.model = model;
		this.mapping = mapping;
	}

	public getModel(): EObject {
		return this.model;
	}

	public getMapping(): ValueMapping {
		return this.mapping;
	}

	public parse(literal: string): XExpression {
		let director = directors.getExpressionFormulaDirector(this.viewer);
		return director.parseFormula(literal);
	}

	public evaluate(expression: XExpression, callback: (result: any) => void): void {
		let director = directors.getProjectComposerDirector(this.viewer);
		director.inspectValue(this.model, padang.INSPECT_EVALUATE, [expression], (data: VisageValue) => {
			callback(data);
		});
	}

}