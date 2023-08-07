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

import SNumber from "sleman/SNumber";

import Printer from "sleman/model/Printer";
import * as model from "sleman/model/model";
import XConstant from "sleman/model/XConstant";

export default class XNumber extends XConstant implements SNumber {

    public static XCLASSNAME: string = model.getEClassName("XNumber");

    public static FEATURE_VALUE = new EAttribute("value", EAttribute.NUMBER);

    private value: number = null;

    constructor() {
        super(model.createEClass(XNumber.XCLASSNAME), [
            XNumber.FEATURE_VALUE
        ]);
    }

    public getValue(): number {
        return this.value;
    }

    public setValue(newValue: number): void {
        let oldValue = this.value;
        this.value = newValue;
        this.eSetNotify(XNumber.FEATURE_VALUE, oldValue, newValue);
    }

    public print(printer: Printer): void {
        printer.term(this.value);
    }

    public toValue(): number {
        return this.value;
    }

    public toString(): string {
        return this.toLiteral();
    }
}
