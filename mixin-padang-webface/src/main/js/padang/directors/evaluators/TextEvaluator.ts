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
import XText from "sleman/model/XText";

import VisageText from "bekasi/visage/VisageText";

import ExpressionEvaluator from "padang/directors/evaluators/ExpressionEvaluator";
import ExpressionEvaluatorFactory from "padang/directors/evaluators/ExpressionEvaluatorFactory";

export default class TextEvaluator extends ExpressionEvaluator {

    private value: string = null;

    public init(expression: XText): void {
        this.value = expression.toValue();
    }

    public evaluate(): VisageText {
        return new VisageText(this.value);
    }
}

let factory = ExpressionEvaluatorFactory.getInstance();
factory.register(XText.XCLASSNAME, TextEvaluator);
