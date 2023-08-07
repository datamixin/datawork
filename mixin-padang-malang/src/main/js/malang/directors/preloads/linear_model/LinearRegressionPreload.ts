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
import XExpression from "sleman/model/XExpression";

import GraphicPremise from "padang/ui/GraphicPremise";

import XModeler from "malang/model/XModeler";

import PreloadRegistry from "malang/directors/preloads/PreloadRegistry";
import SupervisedModelDatasetPreload from "malang/directors/preloads/SupervisedModelDatasetPreload";

import LinearRegressionAlgorithm from "malang/directors/algorithms/linear_model/LinearRegressionAlgorithm";

export default class LinearRegressionPreload {

	public static GROUP = "LinearRegression";

	public static ATTR_INTECEPT = "intercept_";
	public static ATTR_COEFFICIENT = "coef_";

}

export class InterceptCoefficientsPreload extends SupervisedModelDatasetPreload {

	constructor() {
		super(LinearRegressionPreload.GROUP, "InterceptCoefficients", 1, LinearRegressionAlgorithm.getPlan());
	}

	public createExpression(_premise: GraphicPremise, model: XModeler): XExpression {

		// Intercept Label
		let firstColumn = this.maker.getInputFeatureNameList(model);
		this.creator.addTextElement(firstColumn, "Intercept", 0);

		// Intercept Value
		let secondColumn = this.creator.createList();
		this.maker.addModelPropertyTextElement(secondColumn, LinearRegressionPreload.ATTR_INTECEPT);

		// Feature Coefficients
		let count = firstColumn.getElementCount() - 1;
		for (let i = 0; i < count; i++) {
			this.maker.addModelPropertyIndexElement(secondColumn, LinearRegressionPreload.ATTR_COEFFICIENT, i);
		}

		// CreateDataset
		let object = this.creator.createObject();
		this.creator.addField(object, "Variable", firstColumn);
		this.creator.addField(object, "Coefficient", secondColumn);
		return this.maker.createDataset(object);

	}

}

let registry = PreloadRegistry.getInstance();
registry.register(new InterceptCoefficientsPreload());
