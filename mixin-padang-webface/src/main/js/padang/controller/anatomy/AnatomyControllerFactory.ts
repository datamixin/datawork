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
import LeanControllerFactory from "bekasi/controller/LeanControllerFactory";

import XGraphic from "padang/model/XGraphic";
import XBuilder from "padang/model/XBuilder";
import XVariable from "padang/model/XVariable";

import PointerField from "padang/model/PointerField";
import VariableField from "padang/model/VariableField";

import BuilderAnatomyController from "padang/controller/anatomy/BuilderAnatomyController";
import GraphicAnatomyController from "padang/controller/anatomy/GraphicAnatomyController";
import VariableAnatomyController from "padang/controller/anatomy/VariableAnatomyController";
import VariableListAnatomyController from "padang/controller/anatomy/VariableListAnatomyController";

import PointerFieldAnatomyController from "padang/controller/anatomy/PointerFieldAnatomyController";
import VariableFieldAnatomyController from "padang/controller/anatomy/VariableFieldAnatomyController";
import PointerFieldListAnatomyController from "padang/controller/anatomy/PointerFieldListAnatomyController";

export default class AnatomyControllerFactory extends LeanControllerFactory {

	constructor() {
		super();

		super.register(XGraphic.XCLASSNAME, GraphicAnatomyController);
		super.register(XBuilder.XCLASSNAME, BuilderAnatomyController);
		super.register(XVariable.XCLASSNAME, VariableAnatomyController);

		super.register(PointerField.XCLASSNAME, PointerFieldAnatomyController);
		super.register(VariableField.XCLASSNAME, VariableFieldAnatomyController);

		super.registerList(XGraphic.XCLASSNAME, XGraphic.FEATURE_VARIABLES, VariableListAnatomyController);
		super.registerList(XBuilder.XCLASSNAME, XBuilder.FEATURE_VARIABLES, VariableListAnatomyController);
		super.registerList(PointerField.XCLASSNAME, PointerField.FEATURE_LIST, PointerFieldListAnatomyController);
		super.registerList(VariableField.XCLASSNAME, VariableField.FEATURE_LIST, PointerFieldListAnatomyController);

	}

}