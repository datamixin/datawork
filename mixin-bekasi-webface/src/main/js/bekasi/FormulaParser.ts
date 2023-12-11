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
import { expressionFactory } from "sleman/ExpressionFactory";

import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

import LiteralFormula from "bekasi/LiteralFormula";

export default class FormulaParser {

    public parse(input: LiteralFormula | string): XExpression {

        let formula: LiteralFormula = null;
        if (input instanceof LiteralFormula) {
            formula = <LiteralFormula>input;
        } else {
            formula = new LiteralFormula(input);
        }

        let model: XExpression = null;
        if (formula.isConstant()) {

            let factory = SlemanFactory.eINSTANCE;
            if (formula.literal === 'true') {
                model = factory.createXLogical(true);
            } else if (formula.literal === 'false') {
                model = factory.createXLogical(false);
            } else {
                let float = parseFloat(formula.literal);
                if (!isNaN(float)) {
                    model = factory.createXNumber(float);
                } else {
                    model = factory.createXText(formula.literal);
                }
            }

        } else {

            if (formula.evaluation.length === 0) {
                throw new Error("Please specify expression literal");
            }
            model = <XExpression>expressionFactory.parse(formula.evaluation);

        }

        return model;
    }
}