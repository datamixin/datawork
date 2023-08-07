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
import Controller from "webface/wef/Controller";
import PartViewer from "webface/wef/PartViewer";

import Learning from "padang/functions/model/Learning";

import InputPlan from "rinjani/plan/InputPlan";

import * as directors from "malang/directors";

import XInput from "malang/model/XInput";
import XLibrary from "malang/model/XLibrary";
import XModeler from "malang/model/XModeler";
import XAlgorithm from "malang/model/XAlgorithm";
import XAutomatedTask from "malang/model/XAutomatedTask";
import XInputFeature from "malang/model/XInputFeature";
import MalangFactory from "malang/model/MalangFactory";
import XInstantResult from "malang/model/XInstantResult";
import XCascadeResult from "malang/model/XCascadeResult";
import XSupervisedLearning from "malang/model/XSupervisedLearning";
import XAutomatedLearning from "malang/model/XAutomatedLearning";

export default class MalangCreator {

	public static eINSTANCE: MalangCreator = null;

	public createModel(): XModeler {

		// Model
		let factory = MalangFactory.eINSTANCE;
		let model = factory.createModel();

		// Input
		let inputs = model.getInputs();

		// Features		
		let featuresInput = factory.createInput();
		let featuresName = Learning.FEATURES;
		featuresInput.setName(featuresName);
		let features = factory.createMultipleAssignment();
		featuresInput.setAssignment(features);
		inputs.add(featuresInput);

		// Target		
		let targetInput = factory.createInput();
		let targetName = Learning.TARGET;
		targetInput.setName(targetName);
		let target = factory.createSingleAssignment();
		targetInput.setAssignment(target);
		inputs.add(targetInput);

		// Learning
		let learning = this.createBasicSupervisedLearning();
		model.setLearning(learning);

		return model;
	}

	public createBasicSupervisedLearning(): XSupervisedLearning {

		// Training
		let factory = MalangFactory.eINSTANCE;
		let learning = factory.createSupervisedLearning();

		// Proprocessing
		let preprocessing = factory.createPreprocessing();
		learning.setPreprocessing(preprocessing);

		// Training
		let training = factory.createBasicTraining();
		learning.setTraining(training);

		// Algorithm
		let algorithm = factory.createAlgorithm();
		training.setEstimator(algorithm);

		// Validation
		let validation = factory.createHoldoutValidation();
		learning.setValidation(validation);

		return learning;

	}

	public createAutomatedLearning(): XAutomatedLearning {

		// Training
		let factory = MalangFactory.eINSTANCE;
		let learning = factory.createAutomatedLearning();

		// Task
		let task = factory.createAutomatedTask();
		learning.setTask(task);

		// Library
		let library = factory.createLibrary();
		learning.setLibrary(library);

		return learning;

	}

	public createAlgorithm(origin: PartViewer | Controller, name: string): XAlgorithm {

		// Algorithm
		let factory = MalangFactory.eINSTANCE;
		let algorithm = factory.createAlgorithm();
		algorithm.setName(name);
		let parameters = algorithm.getHyperParameters();

		let director = directors.getAlgorithmPlanDirector(origin);
		let parameterMap = director.getDefaultParameters(name);
		for (let name of parameterMap.keys()) {
			let parameter = factory.createParameter();
			let value = parameterMap.get(name);
			parameter.setName(name);
			parameter.setValue(value);
			parameters.add(parameter);
		}

		return algorithm;
	}

	public createLibrary(origin: PartViewer | Controller, name: string): XLibrary {

		// Algorithm
		let factory = MalangFactory.eINSTANCE;
		let library = factory.createLibrary();
		library.setName(name);
		let parameters = library.getParameters();

		let director = directors.getAlgorithmPlanDirector(origin);
		let parameterMap = director.getDefaultParameters(name);
		for (let name of parameterMap.keys()) {
			let parameter = factory.createParameter();
			let value = parameterMap.get(name);
			parameter.setName(name);
			parameter.setValue(value);
			parameters.add(parameter);
		}

		return library;
	}

	public createAutomatedTask(name: string): XAutomatedTask {

		// Task name
		let factory = MalangFactory.eINSTANCE;
		let learningTask = factory.createAutomatedTask();
		learningTask.setName(name);

		return learningTask;
	}


	public createArgument(plan: InputPlan): XInput {

		// Argument
		let factory = MalangFactory.eINSTANCE;
		let argument = factory.createInput();
		let name = plan.getName();
		argument.setName(name);

		// Assignment
		if (plan.isSingle()) {
			let assignment = factory.createSingleAssignment();
			argument.setAssignment(assignment);
		} else {
			let assignment = factory.createMultipleAssignment();
			argument.setAssignment(assignment);
		}

		return argument;
	}

	public createFeature(formula: string): XInputFeature {
		let factory = MalangFactory.eINSTANCE;
		let feature = factory.createInputFeature();
		feature.setValue(formula);
		return feature;
	}

	public createInstantResult(preload: string, width?: number, height?: number): XInstantResult {
		let factory = MalangFactory.eINSTANCE;
		let result = factory.createInstantResult();
		result.setPreload(preload);
		result.setWidth(width === undefined ? null : width);
		result.setHeight(height === undefined ? null : height);
		return result;
	}

	public createCascadeResult(): XCascadeResult {
		let factory = MalangFactory.eINSTANCE;
		let result = factory.createCascadeResult();
		return result;
	}

}

MalangCreator.eINSTANCE = new MalangCreator();
