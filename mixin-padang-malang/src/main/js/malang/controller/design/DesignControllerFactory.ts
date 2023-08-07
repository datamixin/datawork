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
import LeanControllerFactory from "bekasi/controller/LeanControllerFactory";

import XInput from "malang/model/XInput";
import XModeler from "malang/model/XModeler";
import XLibrary from "malang/model/XLibrary";
import XAlgorithm from "malang/model/XAlgorithm";
import XInputFeature from "malang/model/XInputFeature";
import XAutomatedTask from "malang/model/XAutomatedTask";
import XPreprocessing from "malang/model/XPreprocessing";
import XBasicTraining from "malang/model/XBasicTraining";
import XSingleAssignment from "malang/model/XSingleAssignment";
import XAutomatedLearning from "malang/model/XAutomatedLearning";
import XHoldoutValidation from "malang/model/XHoldoutValidation";
import XSupervisedLearning from "malang/model/XSupervisedLearning";
import XMultipleAssignment from "malang/model/XMultipleAssignment";

import InputDesignController from "malang/controller/design/InputDesignController";
import ModelerDesignController from "malang/controller/design/ModelerDesignController";
import LibraryDesignController from "malang/controller/design/LibraryDesignController";
import AlgorithmDesignController from "malang/controller/design/AlgorithmDesignController";
import InputListDesignController from "malang/controller/design/InputListDesignController";
import InputFeatureDesignController from "malang/controller/design/InputFeatureDesignController";
import AutomatedTaskDesignController from "malang/controller/design/AutomatedTaskDesignController";
import PreprocessingDesignController from "malang/controller/design/PreprocessingDesignController";
import BasicTrainingDesignController from "malang/controller/design/BasicTrainingDesignController";
import SingleAssignmentDesignController from "malang/controller/design/SingleAssignmentDesignController";
import AutomatedLearningDesignController from "malang/controller/design/AutomatedLearningDesignController";
import HoldoutValidationDesignController from "malang/controller/design/HoldoutValidationDesignController";
import SupervisedLearningDesignController from "malang/controller/design/SupervisedLearningDesignController";
import MultipleAssignmentDesignController from "malang/controller/design/MultipleAssignmentDesignController";

export default class DesignControllerFactory extends LeanControllerFactory {

	constructor() {
		super();

		this.register(XInput.XCLASSNAME, InputDesignController);
		this.register(XModeler.XCLASSNAME, ModelerDesignController);
		this.register(XLibrary.XCLASSNAME, LibraryDesignController);
		this.register(XAlgorithm.XCLASSNAME, AlgorithmDesignController);
		this.register(XAutomatedTask.XCLASSNAME, AutomatedTaskDesignController);
		this.register(XInputFeature.XCLASSNAME, InputFeatureDesignController);
		this.register(XPreprocessing.XCLASSNAME, PreprocessingDesignController);
		this.register(XBasicTraining.XCLASSNAME, BasicTrainingDesignController);
		this.register(XSingleAssignment.XCLASSNAME, SingleAssignmentDesignController);
		this.register(XAutomatedLearning.XCLASSNAME, AutomatedLearningDesignController);
		this.register(XSupervisedLearning.XCLASSNAME, SupervisedLearningDesignController);
		this.register(XHoldoutValidation.XCLASSNAME, HoldoutValidationDesignController);
		this.register(XMultipleAssignment.XCLASSNAME, MultipleAssignmentDesignController);

		this.registerList(XModeler.XCLASSNAME, XModeler.FEATURE_INPUTS, InputListDesignController);

	}

}