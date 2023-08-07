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
import EReference from "webface/model/EReference";

import SUnary from "sleman/SUnary";

import Printer from "sleman/model/Printer";
import * as model from "sleman/model/model";
import XExpression from "sleman/model/XExpression";

export default class XUnary extends XExpression implements SUnary {

    public static XCLASSNAME: string = model.getEClassName("XUnary");

    public static FEATURE_OPERATOR = new EAttribute("operator", EAttribute.STRING);
    public static FEATURE_ARGUMENT = new EReference("argument", XExpression);
    public static FEATURE_PREFIX = new EAttribute("prefix", EAttribute.STRING);

    private operator: string = null;
    private argument: XExpression = null;
    private prefix: boolean = true;

    constructor() {
        super(model.createEClass(XUnary.XCLASSNAME), [
            XUnary.FEATURE_OPERATOR,
            XUnary.FEATURE_ARGUMENT,
            XUnary.FEATURE_PREFIX,
        ]);
    }

    public getOperator(): string {
        return this.operator;
    }

    public setOperator(newOperator: string): void {
        let oldOperator = this.operator;
        this.operator = newOperator;
        this.eSetNotify(XUnary.FEATURE_OPERATOR, oldOperator, newOperator);
    }

    public getArgument(): XExpression {
        return this.argument;
    }

    public setArgument(newArgument: XExpression): void {
        let oldArgument = this.argument;
        this.argument = newArgument;
        this.eSetNotify(XUnary.FEATURE_ARGUMENT, oldArgument, newArgument);
    }

    public isPrefix(): boolean {
        return this.prefix;
    }

    public setPrefix(newPrefix: boolean): void {
        let oldPrefix = this.prefix;
        this.prefix = newPrefix;
        this.eSetNotify(XUnary.FEATURE_PREFIX, oldPrefix, newPrefix);
    }

    public print(printer: Printer): void {
        if (this.prefix === true) {
            printer.term(this.operator);
            if (this.operator.length >= 1 && this.operator.match(/[a-z]/i)) {
                printer.space();
            }
            printer.part(this.argument);
        } else {
            printer.part(this.argument);
            if (this.operator.length >= 1 && this.operator.match(/[a-z]/i)) {
                printer.space();
            }
            printer.term(this.operator);
        }
    }

    public toString(): string {
        return this.toLiteral();
    }
}
