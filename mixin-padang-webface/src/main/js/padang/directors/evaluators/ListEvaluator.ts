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
import XList from "sleman/model/XList";

import VisageList from "bekasi/visage/VisageList";

import ExpressionEvaluator from "padang/directors/evaluators/ExpressionEvaluator";
import ExpressionEvaluatorFactory from "padang/directors/evaluators/ExpressionEvaluatorFactory";

export default class ListEvaluator extends ExpressionEvaluator {

    private evaluators: ExpressionEvaluator[] = [];

    public init(expression: XList): void {
        let elements = expression.getElements();
        for (let i = 0; i < elements.size; i++) {
            let element = elements.get(i);
            let factory = ExpressionEvaluatorFactory.getInstance();
            let evaluator = factory.create(element);
            this.evaluators.push(evaluator);
        }
    }

    public evaluate(): any {
        let values = new VisageList();
        for (let i = 0; i < this.evaluators.length; i++) {
            let evaluator = this.evaluators[i];
            let value = evaluator.evaluate();
            values.add(value);
        }
        return values;

    }

}

let factory = ExpressionEvaluatorFactory.getInstance();
factory.register(XList.XCLASSNAME, ListEvaluator);
