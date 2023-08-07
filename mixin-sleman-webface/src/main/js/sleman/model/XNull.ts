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
import SNull from "sleman/SNull";

import Printer from "sleman/model/Printer";
import * as model from "sleman/model/model";
import XConstant from "sleman/model/XConstant";

export default class XNull extends XConstant implements SNull {

    public static XCLASSNAME: string = model.getEClassName("XNull");

    constructor() {
        super(model.createEClass(XNull.XCLASSNAME), []);
    }

    public toValue(): any {
        return null;
    }

    public print(printer: Printer): void {
        printer.term("null");
    }

    public toString(): string {
        return this.toLiteral();
    }


}
