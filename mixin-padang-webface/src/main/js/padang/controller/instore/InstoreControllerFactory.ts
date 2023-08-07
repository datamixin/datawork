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

import XOption from "padang/model/XOption";
import XMutation from "padang/model/XMutation";

import OptionInstoreController from "padang/controller/instore/OptionInstoreController";
import MutationInstoreController from "padang/controller/instore/MutationInstoreController";
import OptionListInstoreController from "padang/controller/instore/OptionListInstoreController";

export default class InstoreControllerFactory extends LeanControllerFactory {

	constructor() {
		super();
		super.register(XOption.XCLASSNAME, OptionInstoreController);
		super.register(XMutation.XCLASSNAME, MutationInstoreController);

		super.registerList(XMutation.XCLASSNAME, XMutation.FEATURE_OPTIONS, OptionListInstoreController);

	}

}