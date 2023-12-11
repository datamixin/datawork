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
import EList from "webface/model/EList";
import BasicEList from "webface/model/BasicEList";
import EReference from "webface/model/EReference";

import SLet from "sleman/SLet";

import Printer from "sleman/model/Printer";
import * as model from "sleman/model/model";
import XEvaluation from "sleman/model/XEvaluation";
import XExpression from "sleman/model/XExpression";
import XAssignment from "sleman/model/XAssignment";

export default class XLet extends XEvaluation implements SLet {

    public static XCLASSNAME: string = model.getEClassName("XLet");

    public static FEATURE_VARIABLES = new EReference("variables", XAssignment);
    public static FEATURE_RESULT = new EReference("result", XExpression);

    private variables: EList<XAssignment> = new BasicEList<XAssignment>(this, XLet.FEATURE_VARIABLES);
    private result: XExpression = null;

    constructor() {
        super(model.createEClass(XLet.XCLASSNAME), [
            XLet.FEATURE_VARIABLES,
            XLet.FEATURE_RESULT,
        ]);
    }

    public getVariables(): EList<XAssignment> {
        return this.variables;
    }

    public getResult(): XExpression {
        return this.result;
    }

    public setResult(newResult: XExpression): void {
        let oldResult = this.result;
        this.result = newResult;
        this.eSetNotify(XLet.FEATURE_RESULT, oldResult, newResult);
    }

    public print(printer: Printer): void {
        printer.term("let");
        for (let i = 0; i < this.variables.size; i++) {
            let assignment = this.variables.get(i);
            let identifier = assignment.getName();
            let name = identifier.getName();
            let expression = assignment.getExpression();
            printer.newLineIndentEntry(this.variables.size - i, name, "=", expression);
        }
        printer.newLine("in");
        if (this.result === null) {
            printer.newLineIndent(true);
            printer.term("null");
        } else {
            printer.newLineIndentPart(this.result);
        }
    }

    public toString(): string {
        return this.toLiteral();
    }

}
