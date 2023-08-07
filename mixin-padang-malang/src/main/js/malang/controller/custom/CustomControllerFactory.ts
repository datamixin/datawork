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

import XModeler from "malang/model/XModeler";
import XAlgorithm from "malang/model/XAlgorithm";
import XHoldoutValidation from "malang/model/XHoldoutValidation";

import ModelerCustomController from "malang/controller/custom/ModelerCustomController";
import AlgorithmCustomController from "malang/controller/custom/AlgorithmCustomController";
import HoldoutValidationCustomController from "malang/controller/custom/HoldoutValidationCustomController";

export default class CustomControllerFactory extends LeanControllerFactory {

	constructor() {
		super();

		this.register(XModeler.XCLASSNAME, ModelerCustomController);
		this.register(XAlgorithm.XCLASSNAME, AlgorithmCustomController);
		this.register(XHoldoutValidation.XCLASSNAME, HoldoutValidationCustomController);

	}

}