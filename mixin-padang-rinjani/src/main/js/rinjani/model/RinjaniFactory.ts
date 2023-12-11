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
import EFactory from "webface/model/EFactory";

import XInput from "rinjani/model/XInput";
import XResult from "rinjani/model/XResult";
import XRoutine from "rinjani/model/XRoutine";
import XParameter from "rinjani/model/XParameter";
import XInputField from "rinjani/model/XInputField";
import XSingleMapping from "rinjani/model/XSingleMapping";
import XMultipleMapping from "rinjani/model/XMultipleMapping";

export abstract class RinjaniFactory implements EFactory {

	public static eINSTANCE: RinjaniFactory = null;

	abstract create(xClass: EClass): EObject;

	abstract createRoutine(): XRoutine;

	abstract createResult(): XResult;

	abstract createInput(): XInput;

	abstract createInputField(): XInputField;

	abstract createSingleMapping(): XSingleMapping;

	abstract createMultipleMapping(): XMultipleMapping;

	abstract createParameter(): XParameter;

}

export default RinjaniFactory;
