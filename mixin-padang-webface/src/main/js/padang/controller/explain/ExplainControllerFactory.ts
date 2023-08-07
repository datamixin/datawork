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

import XVariable from "padang/model/XVariable";

import PointerField from "padang/model/PointerField";
import VariableField from "padang/model/VariableField";

import VariableExplainController from "padang/controller/explain/VariableExplainController";
import PointerFieldExplainController from "padang/controller/explain/PointerFieldExplainController";
import VariableFieldExplainController from "padang/controller/explain/VariableFieldExplainController";

export default class ExplainControllerFactory extends LeanControllerFactory {

    constructor() {
        super();
        super.register(XVariable.XCLASSNAME, VariableExplainController);

        super.register(PointerField.XCLASSNAME, PointerFieldExplainController);
        super.register(VariableField.XCLASSNAME, VariableFieldExplainController);

    }

}