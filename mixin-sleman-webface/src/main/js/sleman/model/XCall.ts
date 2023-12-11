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
import * as model from "sleman/model/model";

import EList from "webface/model/EList";
import BasicEList from "webface/model/BasicEList";
import EReference from "webface/model/EReference";

import SCall from "sleman/SCall";

import Printer from "sleman/model/Printer";
import XPointer from "sleman/model/XPointer";
import XArgument from "sleman/model/XArgument";
import XAssignment from "sleman/model/XAssignment";
import XExpression from "sleman/model/XExpression";

export default class XCall extends XExpression implements SCall {

    public static XCLASSNAME: string = model.getEClassName("XCall");

    public static FEATURE_CALLEE = new EReference("callee", XPointer);
    public static FEATURE_ARGUMENTS = new EReference("arguments", XExpression);

    private callee: XPointer = null;
    private arguments: BasicEList<XArgument> = new BasicEList<XArgument>(this, XCall.FEATURE_ARGUMENTS);

    constructor() {
        super(model.createEClass(XCall.XCLASSNAME), [
            XCall.FEATURE_CALLEE,
            XCall.FEATURE_ARGUMENTS
        ]);
    }

    public getCallee(): XPointer {
        return this.callee;
    }

    public setCallee(newCallee: XPointer): void {
        let oldCallee = this.callee;
        this.callee = newCallee;
        this.eSetNotify(XCall.FEATURE_CALLEE, oldCallee, newCallee);
    }

    public getArguments(): EList<XArgument> {
        return this.arguments;
    }

    public print(printer: Printer): void {
        printer.part(this.callee);
        printer.open("(");
        for (let i = 0; i < this.arguments.size; i++) {
            let argument = this.arguments.get(i);
            let expression = argument.getExpression();
            if (argument instanceof XAssignment) {
                let identifier = argument.getName();
                identifier.print(printer);
                printer.term("=");
                expression.print(printer);
            } else {
                expression.print(printer);
            }
            printer.comma(this.arguments.size - i);
        }
        printer.close(")");
    }

    public toString(): string {
        return this.toLiteral();
    }
}
