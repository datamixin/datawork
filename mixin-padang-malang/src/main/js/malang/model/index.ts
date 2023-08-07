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
import * as model from "malang/model/model";
import MalangCreator from "malang/model/MalangCreator";
import MalangFactory from "malang/model/MalangFactory";
import MalangPackage from "malang/model/MalangPackage";
import BaseMalangFactory from "malang/model/BaseMalangFactory";
import BaseMalangPackage from "malang/model/BaseMalangPackage";

import XLearning from "malang/model/XLearning";
import XAlgorithm from "malang/model/XAlgorithm";
import XParameter from "malang/model/XParameter";
import XAutomatedTask from "malang/model/XAutomatedTask";
import XPreprocessing from "malang/model/XPreprocessing";
import XModeler from "malang/model/XModeler";

import XAutomatedLearning from "malang/model/XAutomatedLearning";
import XSupervisedLearning from "malang/model/XSupervisedLearning";
import XUnsupervisedLearning from "malang/model/XUnsupervisedLearning";

import XTraining from "malang/model/XTraining";
import XBasicTraining from "malang/model/XBasicTraining";

import XLibrary from "malang/model/XLibrary";

import XInput from "malang/model/XInput";
import XInputFeature from "malang/model/XInputFeature";
import XInputAssignment from "malang/model/XInputAssignment";
import XSingleAssignment from "malang/model/XSingleAssignment";
import XMultipleAssignment from "malang/model/XMultipleAssignment";

import XResult from "malang/model/XResult";
import XInstantResult from "malang/model/XInstantResult";
import XCascadeResult from "malang/model/XCascadeResult";

import XValidation from "malang/model/XValidation";
import XHoldoutValidation from "malang/model/XHoldoutValidation";

import PreloadContent from "malang/model/PreloadContent";

export {

	model,
	MalangCreator,
	MalangFactory,
	MalangPackage,
	BaseMalangFactory,
	BaseMalangPackage,

	XAlgorithm,
	XAutomatedTask,
	XPreprocessing,
	XModeler,

	XLearning,
	XAutomatedLearning,
	XSupervisedLearning,
	XUnsupervisedLearning,

	XTraining,
	XBasicTraining,

	XLibrary,
	XParameter,

	XInput,
	XInputFeature,
	XInputAssignment,
	XSingleAssignment,
	XMultipleAssignment,

	XValidation,
	XHoldoutValidation,

	XResult,
	XInstantResult,
	XCascadeResult,

	PreloadContent,

}