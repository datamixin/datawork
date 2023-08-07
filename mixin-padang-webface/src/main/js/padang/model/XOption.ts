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
import EAttribute from "webface/model/EAttribute";
import BasicEObject from "webface/model/BasicEObject";

import * as model from "padang/model/model";

export default class XOption extends BasicEObject {

    public static XCLASSNAME = model.getEClassName("XOption");

    public static FEATURE_NAME = new EAttribute("name", EAttribute.STRING);
    public static FEATURE_FORMULA = new EAttribute("formula", EAttribute.STRING);

    private name: string = null;
    private formula: string = null;

    constructor() {
        super(model.createEClass(XOption.XCLASSNAME), <EFeature[]>[
            XOption.FEATURE_NAME,
            XOption.FEATURE_FORMULA
        ]);
    }

    public getName(): string {
        return this.name;
    }

    public setName(newName: string): void {
        let oldName = this.name;
        this.name = newName;
        this.eSetNotify(XOption.FEATURE_NAME, oldName, newName);
    }

    public getFormula(): string {
        return this.formula;
    }

    public setFormula(newFormula: string): void {
        let oldFormula = this.formula;
        this.formula = newFormula;
        this.eSetNotify(XOption.FEATURE_FORMULA, oldFormula, newFormula);
    }

}
