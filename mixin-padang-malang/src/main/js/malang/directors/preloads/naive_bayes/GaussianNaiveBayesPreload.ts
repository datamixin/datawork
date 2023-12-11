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

import GaussianNaiveBayesAlgorithm from "malang/directors/algorithms/naive_bayes/GaussianNaiveBayesAlgorithm";

export default class GaussianNaiveBayesPreload {

	public static GROUP = "GaussianNaiveBayes";

	public static ATTR_VAR = "var_";
	public static ATTR_TETHA = "theta_";
	public static ATTR_CLASSES = "classes_";
	public static ATTR_CLASS_PRIOR = "class_prior_";

}

export class ProbabilitiesPreload extends SupervisedModelDatasetPreload {

	constructor() {
		super(GaussianNaiveBayesPreload.GROUP, "Probabilities", 3, GaussianNaiveBayesAlgorithm.getPlan());
	}

	public createExpression(_premise: GraphicPremise, _model: XModeler): XExpression {

		// Classes
		let classes = this.maker.createModelPropertyReshapeCall(GaussianNaiveBayesPreload.ATTR_CLASSES);

		// Property
		let prior = this.maker.createModelProperty(GaussianNaiveBayesPreload.ATTR_CLASS_PRIOR);
		let probabs = this.maker.createReshapeCall(prior, -1, 1);
		let dataset = this.maker.createHStackCall(classes, probabs);

		// Dataset
		return this.maker.createDatasetWithColumnNames(dataset, ["Classes", "Probability"]);
	}

}

export class ColumnsPreload extends SupervisedModelDatasetPreload {

	private property: string = null;

	constructor(name: string, priority: number, property: string) {
		super(GaussianNaiveBayesPreload.GROUP, name, priority, GaussianNaiveBayesAlgorithm.getPlan());
		this.property = property;
	}

	public createExpression(_premise: GraphicPremise, model: XModeler): XExpression {

		// Columns
		let columns = this.maker.getInputFeatureNameList(model);
		this.creator.addTextElement(columns, "Classes", 0);

		// Classes
		let classes = this.maker.createModelProperty(GaussianNaiveBayesPreload.ATTR_CLASSES);
		let reshape = this.maker.createReshapeCall(classes, -1, 1);

		// Property
		let means = this.maker.createModelProperty(this.property);
		let dataset = this.maker.createHStackCall(reshape, means);

		// Dataset
		return this.maker.createDatasetWithColumnList(dataset, columns);
	}

}

let registry = PreloadRegistry.getInstance();
registry.register(new ProbabilitiesPreload());
registry.register(new ColumnsPreload("Means", 4, GaussianNaiveBayesPreload.ATTR_TETHA));
registry.register(new ColumnsPreload("Variants", 5, GaussianNaiveBayesPreload.ATTR_VAR));
