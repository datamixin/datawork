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
import EReference from "webface/model/EReference";

import * as model from "sleman/model/model";
import XExpression from "sleman/model/XExpression";
import XEvaluation from "sleman/model/XEvaluation";

import Printer from "sleman/model/Printer";
import SConditional from "sleman/SConditional";

export default class XConditional extends XEvaluation implements SConditional {

    public static XCLASSNAME: string = model.getEClassName("XConditional");

    public static FEATURE_LOGICAL = new EReference("logical", XExpression);
    public static FEATURE_CONSEQUENT = new EReference("consequent", XExpression);
    public static FEATURE_ALTERNATE = new EReference("alternate", XExpression);

    private logical: XExpression = null;
    private consequent: XExpression = null;
    private alternate: XExpression = null;

    constructor() {
        super(model.createEClass(XConditional.XCLASSNAME), [
            XConditional.FEATURE_LOGICAL,
            XConditional.FEATURE_CONSEQUENT,
            XConditional.FEATURE_ALTERNATE,
        ]);
    }

    public getLogical(): XExpression {
        return this.logical;
    }

    public setLogical(newLogical: XExpression): void {
        let oldLogical = this.logical;
        this.logical = newLogical;
        this.eSetNotify(XConditional.FEATURE_LOGICAL, oldLogical, newLogical);
    }

    public getConsequent(): XExpression {
        return this.consequent;
    }

    public setConsequent(newConsequent: XExpression): void {
        let oldConsequent = this.consequent;
        this.consequent = newConsequent;
        this.eSetNotify(XConditional.FEATURE_CONSEQUENT, oldConsequent, newConsequent);
    }

    public getAlternate(): XExpression {
        return this.alternate;
    }

    public setAlternate(newAlternate: XExpression): void {
        let oldAlternate = this.alternate;
        this.alternate = newAlternate;
        this.eSetNotify(XConditional.FEATURE_ALTERNATE, oldAlternate, newAlternate);
    }

    public print(printer: Printer): void {
        printer.term("if");
        printer.space();
        printer.part(this.logical);
        printer.space();
        printer.term("then");
        printer.space();
        printer.part(this.consequent);
        printer.space();
        printer.term("else");
        printer.space();
        printer.part(this.alternate);
    }

    public toString(): string {
        return this.toLiteral();
    }
}
