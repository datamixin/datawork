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

import XInput from "rinjani/model/XInput";
import XRoutine from "rinjani/model/XRoutine";
import XParameter from "rinjani/model/XParameter";
import XInputField from "rinjani/model/XInputField";
import XSingleMapping from "rinjani/model/XSingleMapping";
import XMultipleMapping from "rinjani/model/XMultipleMapping";

import InputDesignController from "rinjani/controller/design/InputDesignController";
import RoutineDesignController from "rinjani/controller/design/RoutineDesignController";
import InputListDesignController from "rinjani/controller/design/InputListDesignController";
import ParameterDesignController from "rinjani/controller/design/ParameterDesignController";
import InputFieldDesignController from "rinjani/controller/design/InputFieldDesignController";
import SingleMappingDesignController from "rinjani/controller/design/SingleMappingDesignController";
import ParameterListDesignController from "rinjani/controller/design/ParameterListDesignController";
import MultipleMappingDesignController from "rinjani/controller/design/MultipleMappingDesignController";

export default class DesignControllerFactory extends LeanControllerFactory {

	constructor() {
		super();

		this.register(XInput.XCLASSNAME, InputDesignController);
		this.register(XRoutine.XCLASSNAME, RoutineDesignController);
		this.register(XParameter.XCLASSNAME, ParameterDesignController);
		this.register(XInputField.XCLASSNAME, InputFieldDesignController);
		this.register(XSingleMapping.XCLASSNAME, SingleMappingDesignController);
		this.register(XMultipleMapping.XCLASSNAME, MultipleMappingDesignController);

		this.registerList(XRoutine.XCLASSNAME, XRoutine.FEATURE_INPUTS, InputListDesignController);
		this.registerList(XRoutine.XCLASSNAME, XRoutine.FEATURE_PARAMETERS, ParameterListDesignController);

	}

}