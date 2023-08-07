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

import XInput from "padang/model/XInput";
import XDataset from "padang/model/XDataset";

import InputOvertopController from "padang/controller/overtop/InputOvertopController";
import InputListOvertopController from "padang/controller/overtop/InputListOvertopController";

export default class OvertopControllerFactory extends LeanControllerFactory {

    constructor() {
        super();
        super.register(XInput.XCLASSNAME, InputOvertopController);

        super.registerList(XDataset.XCLASSNAME, XDataset.FEATURE_INPUTS, InputListOvertopController);
    }

}