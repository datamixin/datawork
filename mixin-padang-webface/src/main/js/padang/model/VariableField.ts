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
import EFeature from "webface/model/EFeature";
import EReference from "webface/model/EReference";

import * as model from "padang/model/model";
import XVariable from "padang/model/XVariable";
import ValueField from "padang/model/ValueField";

export default class VariableField extends ValueField {

    public static XCLASSNAME = model.getEClassName("VariableField");

    public static FEATURE_VARIABLE = new EReference("variable", XVariable);

    private variable: XVariable = null;

    constructor(variable: XVariable) {
        super(model.createEClass(VariableField.XCLASSNAME), <EFeature[]>[
            VariableField.FEATURE_VARIABLE,
        ]);
        this.variable = variable;
    }

    public getVariable(): XVariable {
        return this.variable;
    }

}
