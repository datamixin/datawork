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
import EAttribute from "webface/model/EAttribute";
import EReference from "webface/model/EReference";

import XFacet from "padang/model/XFacet";
import * as model from "padang/model/model";
import XVariable from "padang/model/XVariable";

export default class XOutcome extends XFacet {

    public static XCLASSNAME: string = model.getEClassName("XOutcome");

    public static FEATURE_FRONTAGE = new EAttribute("frontage", EAttribute.STRING);
    public static FEATURE_VARIABLE = new EReference("variable", XVariable);

    private frontage: string = null;
    private variable: XVariable = null;

    constructor() {
        super(model.createEClass(XOutcome.XCLASSNAME), [
            XOutcome.FEATURE_FRONTAGE,
            XOutcome.FEATURE_VARIABLE,
        ]);
    }

    public getFrontage(): string {
        return this.frontage;
    }

    public setFrontage(newFrontage: string) {
        let oldFrontage = this.frontage;
        this.frontage = newFrontage;
        this.eSetNotify(XOutcome.FEATURE_FRONTAGE, oldFrontage, newFrontage);
    }

    public getVariable(): XVariable {
        return this.variable;
    }

    public setVariable(newVariable: XVariable) {
        let oldVariable = this.variable;
        this.variable = newVariable;
        this.eSetNotify(XOutcome.FEATURE_VARIABLE, oldVariable, newVariable);
    }

}