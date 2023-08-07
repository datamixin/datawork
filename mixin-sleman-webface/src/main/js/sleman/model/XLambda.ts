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
import EList from "webface/model/EList";
import BasicEList from "webface/model/BasicEList";
import EReference from "webface/model/EReference";

import SLambda from "sleman/SLambda";

import Printer from "sleman/model/Printer";
import * as model from "sleman/model/model";
import XEvaluation from "sleman/model/XEvaluation";
import XExpression from "sleman/model/XExpression";
import XIdentifier from "sleman/model/XIdentifier";

export default class XLambda extends XEvaluation implements SLambda {

    public static XCLASSNAME: string = model.getEClassName("XLambda");

    public static FEATURE_PARAMETERS = new EReference("parameters", XIdentifier);
    public static FEATURE_EXPRESSION = new EReference("expression", XExpression);

    private parameters: EList<XIdentifier> = new BasicEList<XIdentifier>(this, XLambda.FEATURE_PARAMETERS);
    private expression: XExpression = null;

    constructor() {
        super(model.createEClass(XLambda.XCLASSNAME), [
            XLambda.FEATURE_PARAMETERS,
            XLambda.FEATURE_EXPRESSION,
        ]);
    }

    public getParameters(): EList<XIdentifier> {
        return this.parameters;
    }

    public getExpression(): XExpression {
        return this.expression;
    }

    public setExpression(newExpression: XExpression): void {
        let oldExpression = this.expression;
        this.expression = newExpression;
        this.eSetNotify(XLambda.FEATURE_EXPRESSION, oldExpression, newExpression);
    }

    public print(printer: Printer): void {
        printer.open("(");
        for (let i = 0; i < this.parameters.size; i++) {
            let parameter = this.parameters.get(i);
            printer.element(i, this.parameters.size - i, <XExpression><any>parameter);
        }
        printer.close(")");
        printer.space();
        printer.term("->");
        printer.space();
        printer.part(this.expression);
    }

    public toString(): string {
        return this.toLiteral();
    }

}
