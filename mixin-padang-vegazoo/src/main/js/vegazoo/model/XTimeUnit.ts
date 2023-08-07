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
import EAttribute from "webface/model/EAttribute";

import * as model from "vegazoo/model/model";
import XValueDef from "vegazoo/model/XValueDef";

import { TimeUnit } from "vegazoo/constants";

export default class XTimeUnit extends XValueDef {

    public static XCLASSNAME: string = model.getEClassName("XTimeUnit");

    public static FEATURE_VALUE = new EAttribute("value", EAttribute.STRING);

    private value: TimeUnit = null;

    constructor() {
        super(model.createEClass(XTimeUnit.XCLASSNAME), [
            XTimeUnit.FEATURE_VALUE
        ]);
    }

    public getValue(): TimeUnit {
        return this.value;
    }

    public setValue(newValue: TimeUnit): void {
        let oldValue = this.value;
        this.value = newValue;
        this.eSetNotify(XTimeUnit.FEATURE_VALUE, oldValue, newValue);
    }

}