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
import EClass from "webface/model/EClass";
import EObject from "webface/model/EObject";

import MalangFactory from "malang/model/MalangFactory";
import MalangPackage from "malang/model/MalangPackage";

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
import XHoldoutValidation from "malang/model/XHoldoutValidation";
import XAutomatedLearning from "malang/model/XAutomatedLearning";
import XSupervisedLearning from "malang/model/XSupervisedLearning";
import XMultipleAssignment from "malang/model/XMultipleAssignment";

export default class BaseMalangFactory extends MalangFactory {

	public create(eClass: EClass): EObject {
		let name = eClass.getName();
		let ePackage = MalangPackage.eINSTANCE;
		let eObject: any = ePackage.getEClass(name);
		try {
			return new eObject();
		} catch (e) {
			throw new Error("Fail create model from " + eClass);
		}
	}

	public createModel(): XModeler {
		return new XModeler();
	}

	public createInstantResult(): XInstantResult {
		return new XInstantResult();
	}

	public createCascadeResult(): XCascadeResult {
		return new XCascadeResult();
	}

	public createLibrary(): XLibrary {
		return new XLibrary();
	}

	public createAlgorithm(): XAlgorithm {
		return new XAlgorithm();
	}

	public createParameter(): XParameter {
		return new XParameter();
	}

	public createAutomatedTask(): XAutomatedTask {
		return new XAutomatedTask();
	}

	public createInput(): XInput {
		return new XInput();
	}

	public createInputFeature(): XInputFeature {
		return new XInputFeature();
	}

	public createSingleAssignment(): XSingleAssignment {
		return new XSingleAssignment();
	}

	public createMultipleAssignment(): XMultipleAssignment {
		return new XMultipleAssignment();
	}

	public createPreprocessing(): XPreprocessing {
		return new XPreprocessing();
	}

	public createAutomatedLearning(): XAutomatedLearning {
		return new XAutomatedLearning();
	}

	public createSupervisedLearning(): XSupervisedLearning {
		return new XSupervisedLearning();
	}

	public createBasicTraining(): XBasicTraining {
		return new XBasicTraining();
	}

	public createHoldoutValidation(): XHoldoutValidation {
		return new XHoldoutValidation();
	}

}

MalangFactory.eINSTANCE = new BaseMalangFactory();
