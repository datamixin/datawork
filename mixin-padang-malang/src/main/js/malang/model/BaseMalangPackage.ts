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
import EObject from "webface/model/EObject";
import EFactory from "webface/model/EFactory";
import ModelNamespace from "webface/model/ModelNamespace";

import { NAMESPACE } from "malang/model/model";
import MalangPackage from "malang/model/MalangPackage";
import MalangFactory from "malang/model/MalangFactory";

import XInput from "malang/model/XInput";
import XLibrary from "malang/model/XLibrary";
import XModeler from "malang/model/XModeler";
import XParameter from "malang/model/XParameter";
import XAlgorithm from "malang/model/XAlgorithm";
import XInputFeature from "malang/model/XInputFeature";
import XPreprocessing from "malang/model/XPreprocessing";
import XAutomatedTask from "malang/model/XAutomatedTask";
import XInstantResult from "malang/model/XInstantResult";
import XCascadeResult from "malang/model/XCascadeResult";
import XBasicTraining from "malang/model/XBasicTraining";
import XSingleAssignment from "malang/model/XSingleAssignment";
import XHoldoutValidation from "malang/model/XHoldoutValidation";
import XAutomatedLearning from "malang/model/XAutomatedLearning";
import XSupervisedLearning from "malang/model/XSupervisedLearning";
import XMultipleAssignment from "malang/model/XMultipleAssignment";

export default class BasicMalangPackage implements MalangPackage {

	private map: { [xClass: string]: typeof EObject } = {};

	constructor() {
		this.map[XInput.XCLASSNAME] = XInput;
		this.map[XModeler.XCLASSNAME] = XModeler;
		this.map[XLibrary.XCLASSNAME] = XLibrary;
		this.map[XParameter.XCLASSNAME] = XParameter;
		this.map[XAlgorithm.XCLASSNAME] = XAlgorithm;
		this.map[XAutomatedTask.XCLASSNAME] = XAutomatedTask;
		this.map[XInputFeature.XCLASSNAME] = XInputFeature;
		this.map[XInstantResult.XCLASSNAME] = XInstantResult;
		this.map[XPreprocessing.XCLASSNAME] = XPreprocessing;
		this.map[XCascadeResult.XCLASSNAME] = XCascadeResult;
		this.map[XBasicTraining.XCLASSNAME] = XBasicTraining;
		this.map[XSingleAssignment.XCLASSNAME] = XSingleAssignment;
		this.map[XHoldoutValidation.XCLASSNAME] = XHoldoutValidation;
		this.map[XAutomatedLearning.XCLASSNAME] = XAutomatedLearning;
		this.map[XSupervisedLearning.XCLASSNAME] = XSupervisedLearning;
		this.map[XMultipleAssignment.XCLASSNAME] = XMultipleAssignment;
	}

	public getNamespaces(): ModelNamespace[] {
		return [NAMESPACE];
	}

	public getDefinedEClass(eClassName: string): typeof EObject {
		return this.map[eClassName] || null;
	}

	public getEClass(eClassName: string): typeof EObject {
		return this.getDefinedEClass(eClassName);
	}

	public getEFactoryInstance(): EFactory {
		return MalangFactory.eINSTANCE;
	}

	public getEClassNames(): string[] {
		return Object.keys(this.map);
	}


}

MalangPackage.eINSTANCE = new BasicMalangPackage();

