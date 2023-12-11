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
import SlemanCreator from "sleman/model/SlemanCreator";

import VisageValue from "bekasi/visage/VisageValue";

import BuilderPremise from "padang/ui/BuilderPremise";

import Predict from "padang/functions/model/Predict";
import Learning from "padang/functions/model/Learning";

import XModeler from "malang/model/XModeler";
import XSupervisedLearning from "malang/model/XSupervisedLearning";

import Executor from "malang/directors/executors/Executor";
import BuilderPremiseEvaluator from "malang/directors/BuilderPremiseEvaluator";
import PreprocessingRecipeModifier from "malang/directors/PreprocessingRecipeModifier";

export default class PredictionResultPremise {

	private premise: BuilderPremiseEvaluator = null;
	private model: XModeler = null;

	constructor(premise: BuilderPremise, model: XModeler) {
		this.premise = new BuilderPremiseEvaluator(premise);
		this.model = model;
	}

	public evaluate(features: XExpression, callback: (value: VisageValue) => void): void {

		let creator = SlemanCreator.eINSTANCE;
		let learning = this.model.getLearning();
		if (learning instanceof XSupervisedLearning) {

			let preprocessing = learning.getPreprocessing();
			let recipe = preprocessing.getRecipe();
			if (recipe !== null) {
				let modifier = new PreprocessingRecipeModifier(preprocessing);
				modifier.applyForPrediction(features);
				features = modifier.getPreprocessing();
			}
		}
		let pointer = creator.createMember(Executor.RESULT, Learning.MODEL);
		let call = this.premise.createCall(Predict.FUNCTION_NAME, pointer, [features]);
		this.premise.evaluate(call, callback);
	}

}