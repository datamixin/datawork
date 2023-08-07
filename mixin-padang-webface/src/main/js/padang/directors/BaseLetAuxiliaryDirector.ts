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
import * as functions from "webface/util/functions";

import BaseControllerViewer from "webface/wef/base/BaseControllerViewer";

import XCall from "sleman/model/XCall";
import XMember from "sleman/model/XMember";
import XReference from "sleman/model/XReference";
import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

import LetAuxiliary from "sleman/graph/LetAuxiliary";

import * as directors from "padang/directors";

import Frontage from "padang/directors/frontages/Frontage";

import LetAuxiliaryDirector from "padang/directors/LetAuxiliaryDirector";

export default class BaseLetAuxiliaryDirector implements LetAuxiliaryDirector {

    private viewer: BaseControllerViewer = null;

    constructor(viewer: BaseControllerViewer) {
        this.viewer = viewer;
    }

    private parseFormula(formula: string): XExpression {
        let director = directors.getExpressionFormulaDirector(this.viewer);
        let expression = director.parseFormula(formula);
        return expression;
    }

    private createAuxiliary(formula: string): LetAuxiliary {
        let expression = this.parseFormula(formula);
        let auxiliary = LetAuxiliary.create(expression);
        return auxiliary;
    }

    private generateLiteral(auxiliary: LetAuxiliary): string {
        let model = auxiliary.getModel();
        let literal = model.toLiteral();
        return "=" + literal;
    }

    private generateName(auxiliary: LetAuxiliary, expression: XExpression): string {
        let names = auxiliary.listVariableNames();
        let name: string = LetAuxiliary.RESULT;
        if (expression instanceof XCall) {
            let pointer = expression.getCallee();
            if (pointer instanceof XMember) {
                let reference = <XReference>pointer.getProperty();
                name = reference.getName();
            } else {
                let reference = <XReference>pointer;
                name = reference.getName();
            }
        }
        return functions.getIncrementedName(name, names);
    }

    public augmentFormulaWithField(formula: string, key: string): string {
        let auxiliary = this.createAuxiliary(formula);
        let resultName = auxiliary.getResultName();
        let factory = SlemanFactory.eINSTANCE;
        let member = factory.createXMember(resultName, key);
        auxiliary.addExpressionVariable(key, member);
        return this.generateLiteral(auxiliary);
    }

    public enhanceFormulaWithFormula(formula: string, addition: string): string {
        let auxiliary = this.createAuxiliary(formula);
        let resultName = auxiliary.getResultName();
        addition = addition.replace(Frontage.CURRENT_SYMBOL, resultName);
        let complete = this.parseFormula(addition);
        let outputName = this.generateName(auxiliary, complete);
        auxiliary.addExpressionVariable(outputName, complete);
        return this.generateLiteral(auxiliary);
    }

}
