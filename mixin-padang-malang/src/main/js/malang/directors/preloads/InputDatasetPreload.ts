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
import * as util from "webface/model/util";

import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

import GraphicPremise from "padang/ui/GraphicPremise";

import CreateDataset from "padang/functions/source/CreateDataset";

import BaseMaker from "rinjani/directors/plots/BaseMaker";

import XModeler from "malang/model/XModeler";
import XInputFeature from "malang/model/XInputFeature";

import DatasetPreload from "malang/directors/preloads/DatasetPreload";
import PreloadSupport from "malang/directors/preloads/PreloadSupport";
import PreloadRegistry from "malang/directors/preloads/PreloadRegistry";

export default class InputDatasetPlotPreload extends DatasetPreload {

	public static GROUP = "Input";
	public static NAME = "InputDataset";

	constructor() {
		super(InputDatasetPlotPreload.GROUP, InputDatasetPlotPreload.NAME);
	}

	public getSequence(): number {
		return 0;
	}

	public isApplicable(_support: PreloadSupport, model: XModeler): boolean {
		let features = this.getInputFeatures(model);
		return features.length > 0;
	}

	private getInputFeatures(model: XModeler): XInputFeature[] {
		return <XInputFeature[]>util.getDescendantsByModelClass(model, XInputFeature);
	}

	public createExpression(premise: GraphicPremise, model: XModeler): XExpression {
		let maker = new BaseMaker();
		let features = this.getInputFeatures(model);
		let factory = SlemanFactory.eINSTANCE;
		let list = factory.createXList();
		for (let feature of features) {
			let value = feature.getValue();
			let expression = premise.parse(value);
			list.addElement(expression);
		}
		let call = maker.createCall(CreateDataset.FUNCTION_NAME, [list]);
		return call;
	}

}

let registry = PreloadRegistry.getInstance();
registry.register(new InputDatasetPlotPreload());
