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
import EClass from "webface/model/EClass";
import EObject from "webface/model/EObject";
import EFactory from "webface/model/EFactory";

import XInput from "malang/model/XInput";
import XModeler from "malang/model/XModeler";
import XLibrary from "malang/model/XLibrary";
import XParameter from "malang/model/XParameter";
import XAlgorithm from "malang/model/XAlgorithm";
import XInputFeature from "malang/model/XInputFeature";
import XInstantResult from "malang/model/XInstantResult";
import XCascadeResult from "malang/model/XCascadeResult";
import XPreprocessing from "malang/model/XPreprocessing";
import XAutomatedTask from "malang/model/XAutomatedTask";
import XBasicTraining from "malang/model/XBasicTraining";
import XSingleAssignment from "malang/model/XSingleAssignment";
import XAutomatedLearning from "malang/model/XAutomatedLearning";
import XHoldoutValidation from "malang/model/XHoldoutValidation";
import XSupervisedLearning from "malang/model/XSupervisedLearning";
import XMultipleAssignment from "malang/model/XMultipleAssignment";

export abstract class MalangFactory implements EFactory {

	public static eINSTANCE: MalangFactory = null;

	abstract create(xClass: EClass): EObject;

	abstract createModel(): XModeler;

	abstract createInstantResult(): XInstantResult;

	abstract createCascadeResult(): XCascadeResult;

	abstract createInput(): XInput;

	abstract createInputFeature(): XInputFeature;

	abstract createSingleAssignment(): XSingleAssignment;

	abstract createMultipleAssignment(): XMultipleAssignment;

	abstract createLibrary(): XLibrary;

	abstract createParameter(): XParameter;

	abstract createAlgorithm(): XAlgorithm;

	abstract createAutomatedTask(): XAutomatedTask;

	abstract createPreprocessing(): XPreprocessing;

	abstract createAutomatedLearning(): XAutomatedLearning;

	abstract createSupervisedLearning(): XSupervisedLearning;

	abstract createBasicTraining(): XBasicTraining;

	abstract createHoldoutValidation(): XHoldoutValidation;

}

export default MalangFactory;
