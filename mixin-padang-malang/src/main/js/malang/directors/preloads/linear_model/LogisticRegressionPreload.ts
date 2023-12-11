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
import XExpression from "sleman/model/XExpression";

import GraphicPremise from "padang/ui/GraphicPremise";

import XModeler from "malang/model/XModeler";

import PreloadRegistry from "malang/directors/preloads/PreloadRegistry";
import SupervisedModelDatasetPreload from "malang/directors/preloads/SupervisedModelDatasetPreload";

import LogisticRegressionAlgorithm from "malang/directors/algorithms/linear_model/LogisticRegressionAlgorithm";

export default class LogisticRegressionPreload {

	public static GROUP = "LogisticRegression";

	public static ATTR_CLASSES = "classes_";
	public static ATTR_INTECEPT = "intercept_";
	public static ATTR_COEFFICIENT = "coef_";

}

export class InterceptCoefficientsPreload extends SupervisedModelDatasetPreload {

	constructor() {
		super(LogisticRegressionPreload.GROUP, "InterceptCoefficients", 1, LogisticRegressionAlgorithm.getPlan());
	}

	public createExpression(_premise: GraphicPremise, model: XModeler): XExpression {

		// Column names
		let columnNames = this.maker.getInputFeatureNames(model);
		columnNames.splice(0, 0, "Intercept");
		columnNames.splice(0, 0, "Classes");

		// Dataset
		let classes = this.maker.createModelPropertyReshapeCall(LogisticRegressionPreload.ATTR_CLASSES);
		let intercepts = this.maker.createModelPropertyReshapeCall(LogisticRegressionPreload.ATTR_INTECEPT);
		let coefficients = this.maker.createModelProperty(LogisticRegressionPreload.ATTR_COEFFICIENT);
		let dataset = this.maker.createHStackCall(classes, intercepts, coefficients);
		return this.maker.createDatasetWithColumnNames(dataset, columnNames);

	}

}

let registry = PreloadRegistry.getInstance();
registry.register(new InterceptCoefficientsPreload());
