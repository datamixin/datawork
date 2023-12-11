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

import SBinary from "sleman/SBinary";

import Printer from "sleman/model/Printer";
import * as model from "sleman/model/model";
import XExpression from "sleman/model/XExpression";

export default class XBinary extends XExpression implements SBinary {

    public static XCLASSNAME: string = model.getEClassName("XBinary");

    public static FEATURE_LEFT = new EReference("left", XExpression);
    public static FEATURE_RIGHT = new EReference("right", XExpression);
    public static FEATURE_OPERATOR = new EAttribute("operator", EAttribute.STRING);

    private left: XExpression = null;
    private right: XExpression = null;
    private operator: string = null;

    constructor() {
        super(model.createEClass(XBinary.XCLASSNAME), [
            XBinary.FEATURE_LEFT,
            XBinary.FEATURE_RIGHT,
            XBinary.FEATURE_OPERATOR
        ]);
    }

    public getLeft(): XExpression {
        return this.left;
    }

    public setLeft(newLeft: XExpression): void {
        let oldLeft = this.left;
        this.left = newLeft;
        this.eSetNotify(XBinary.FEATURE_LEFT, oldLeft, newLeft);
    }

    public getRight(): XExpression {
        return this.right;
    }

    public setRight(newRight: XExpression): void {
        let oldRight = this.right;
        this.right = newRight;
        this.eSetNotify(XBinary.FEATURE_RIGHT, oldRight, newRight);
    }

    public getOperator(): string {
        return this.operator;
    }

    public setOperator(newOperator: string): void {
        let oldOperator = this.operator;
        this.operator = newOperator;
        this.eSetNotify(XBinary.FEATURE_OPERATOR, oldOperator, newOperator);
    }

    public print(printer: Printer): void {
        let group = this.isGroup();
        printer.open(group ? "(" : "");
        printer.part(this.left);
        printer.space();
        printer.term(this.operator);
        printer.space();
        printer.part(this.right);
        printer.close(group ? ")" : "");
    }

}
