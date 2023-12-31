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

import XModeler from "malang/model/XModeler";
import XInstantResult from "malang/model/XInstantResult";
import XCascadeResult from "malang/model/XCascadeResult";

import ModelerOutputController from "malang/controller/output/ModelerOutputController";
import InstantResultOutputController from "malang/controller/output/InstantResultOutputController";
import CascadeResultOutputController from "malang/controller/output/CascadeResultOutputController";

export default class OutputControllerFactory extends LeanControllerFactory {

	constructor() {
		super();

		this.register(XModeler.XCLASSNAME, ModelerOutputController);
		this.register(XInstantResult.XCLASSNAME, InstantResultOutputController);
		this.register(XCascadeResult.XCLASSNAME, CascadeResultOutputController);

	}

}