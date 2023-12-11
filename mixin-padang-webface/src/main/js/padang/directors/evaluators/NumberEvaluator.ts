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
import XNumber from "sleman/model/XNumber";

import VisageNumber from "bekasi/visage/VisageNumber";

import ExpressionEvaluator from "padang/directors/evaluators/ExpressionEvaluator";
import ExpressionEvaluatorFactory from "padang/directors/evaluators/ExpressionEvaluatorFactory";

export default class NumberEvaluator extends ExpressionEvaluator {

    private value: number = 0;

    public init(expression: XNumber): void {
        this.value = expression.toValue();
    }

    public evaluate(): any {
        return new VisageNumber(this.value);
    }
}

let factory = ExpressionEvaluatorFactory.getInstance();
factory.register(XNumber.XCLASSNAME, NumberEvaluator);
