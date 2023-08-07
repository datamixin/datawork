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
import XObject from "sleman/model/XObject";

import VisageObject from "bekasi/visage/VisageObject";

import ExpressionEvaluator from "padang/directors/evaluators/ExpressionEvaluator";
import ExpressionEvaluatorFactory from "padang/directors/evaluators/ExpressionEvaluatorFactory";

export default class ObjectEvaluator extends ExpressionEvaluator {

    private evaluators: { [name: string]: ExpressionEvaluator } = {};

    public init(expression: XObject): void {
        let fields = expression.getFields();
        for (let field of fields) {
            let identifier = field.getName();
            let name = identifier.getName();
            let value = field.getExpression();
            let factory = ExpressionEvaluatorFactory.getInstance();
            let evaluator = factory.create(value);
            this.evaluators[name] = evaluator;
        }
    }

    public evaluate(): any {
        let object = new VisageObject();
        for (let name of Object.keys(this.evaluators)) {
            let evaluator = this.evaluators[name];
            let value = evaluator.evaluate();
            object.setField(name, value);
        }
        return object;

    }

}

let factory = ExpressionEvaluatorFactory.getInstance();
factory.register(XObject.XCLASSNAME, ObjectEvaluator);
