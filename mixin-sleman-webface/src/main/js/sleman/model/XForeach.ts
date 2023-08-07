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
import EReference from "webface/model/EReference";

import SForeach from "sleman/SForeach";

import Printer from "sleman/model/Printer";
import * as model from "sleman/model/model";
import XEvaluation from "sleman/model/XEvaluation";
import XExpression from "sleman/model/XExpression";

export default class XForeach extends XEvaluation implements SForeach {

    public static XCLASSNAME: string = model.getEClassName("XForeach");

    public static FEATURE_EXPRESSION = new EReference("expression", XExpression);

    private expression: XExpression = null;

    constructor() {
        super(model.createEClass(XForeach.XCLASSNAME), [
            XForeach.FEATURE_EXPRESSION,
        ]);
    }

    public getExpression(): XExpression {
        return this.expression;
    }

    public setExpression(newExpression: XExpression): void {
        let oldExpression = this.expression;
        this.expression = newExpression;
        this.eSetNotify(XForeach.FEATURE_EXPRESSION, oldExpression, newExpression);
    }

    public print(printer: Printer): void {
        printer.term("foreach");
        printer.space();
        printer.part(this.expression);
    }

    public toString(): string {
        return this.toLiteral();
    }

}
