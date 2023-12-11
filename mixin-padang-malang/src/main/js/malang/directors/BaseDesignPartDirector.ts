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
import EList from "webface/model/EList";
import EObject from "webface/model/EObject";

import VisageObject from "bekasi/visage/VisageObject";

import * as padang from "padang/padang";

import BuilderPremise from "padang/ui/BuilderPremise";

import XModeler from "malang/model/XModeler";
import XAlgorithm from "malang/model/XAlgorithm";
import XParameter from "malang/model/XParameter";
import MalangCreator from "malang/model/MalangCreator";
import XInstantResult from "malang/model/XInstantResult";
import XSupervisedLearning from "malang/model/XSupervisedLearning";

import * as directors from "malang/directors";

import BuilderPartViewer from "malang/ui/BuilderPartViewer";

import RecipeModifier from "malang/directors/RecipeModifier";
import DesignPartDirector from "malang/directors/DesignPartDirector";
import InputFeatureReader from "malang/directors/InputFeatureReader";
import BuilderPremiseEvaluator from "malang/directors/BuilderPremiseEvaluator";
import PreprocessingRecipeModifier from "malang/directors/PreprocessingRecipeModifier";

import ModelConverter from "malang/directors/converters/ModelConverter";

import InitiatorRegistry from "malang/directors/initiators/InitiatorRegistry";

export default class BaseDesignPartDirector implements DesignPartDirector {

	private viewer: BuilderPartViewer = null;
	private premise: BuilderPremise = null;
	private evaluator: BuilderPremiseEvaluator = null;

	constructor(viewer: BuilderPartViewer, premise: BuilderPremise) {
		this.viewer = viewer;
		this.premise = premise;
		this.evaluator = new BuilderPremiseEvaluator(premise);
	}

	public createModel(callback: (model: XModeler, pristine: boolean) => void): void {

		let mapping = this.premise.getMapping();
		let explanation = mapping.getValue(padang.EXPLANATION);
		if (explanation instanceof VisageObject) {

			let converter = new ModelConverter();
			let value = <VisageObject>explanation;
			let model = <XModeler>converter.convertValueToModel(value);
			callback(model, false);

		} else {

			let creator = MalangCreator.eINSTANCE;
			let model = creator.createModel();
			let converter = new ModelConverter();
			let value = converter.convertModelToValue(model);
			mapping.setValue(padang.EXPLANATION, value);
			callback(model, true);

		}
	}

	public createByEClassName(eClassName: string): EObject {
		let registry = InitiatorRegistry.getInstance();
		let initiator = registry.getInitiator(eClassName);
		return initiator.createNew(this.viewer);
	}

	public getBuilderResultBriefType(formula: string, callback: (type: string) => void): void {
		this.evaluator.getResultBriefType(formula, callback);
	}

	public getParameterType(model: XParameter): string {
		let container = model.eContainer();
		if (container instanceof XAlgorithm) {
			let director = directors.getAlgorithmPlanDirector(this.viewer);
			return director.getParameterType(model);
		} else {
			return null;
		}
	}

	public getParameterLabel(model: XParameter): string {
		let container = model.eContainer();
		if (container instanceof XAlgorithm) {
			let director = directors.getAlgorithmPlanDirector(this.viewer);
			return director.getParameterLabel(model);
		} else {
			return null;
		}
	}

	public getOtherParameters(model: XParameter): EList<XParameter> {
		let container = model.eContainer();
		if (container instanceof XAlgorithm) {
			return container.getHyperParameters();
		} else if (container instanceof XInstantResult) {
			return container.getParameters();
		} else {
			return null;
		}
	}

	private getModel(): XModeler {
		let rootController = this.viewer.getRootController();
		let contents = rootController.getContents();
		return <XModeler>contents.getModel();
	}

	public createRecipeModifier(): RecipeModifier {
		let model = this.getModel();
		let learning = model.getLearning();
		if (learning instanceof XSupervisedLearning) {
			let preprocessing = learning.getPreprocessing();
			return new PreprocessingRecipeModifier(preprocessing);
		}
		return new RecipeModifier();
	}

	public createInputFeatureReader(): InputFeatureReader {
		let model = this.getModel();
		return new InputFeatureReader(model);
	}

}