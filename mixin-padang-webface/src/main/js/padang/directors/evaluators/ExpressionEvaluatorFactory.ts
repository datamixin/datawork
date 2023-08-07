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
import ObjectMap from "webface/util/ObjectMap";

import XExpression from "sleman/model/XExpression";

import ExpressionEvaluator from "padang/directors/evaluators/ExpressionEvaluator";

export default class ExpressionEvaluatorFactory {

    private static instance = new ExpressionEvaluatorFactory();

    private evaluators = new ObjectMap<typeof ExpressionEvaluator>();

    constructor() {
        if (ExpressionEvaluatorFactory.instance) {
            throw new Error("Error: Instantiation failed: Use ExpressionEvaluatorFactory.getInstance() instead of new");
        }
        ExpressionEvaluatorFactory.instance = this;
    }

    public static getInstance(): ExpressionEvaluatorFactory {
        return ExpressionEvaluatorFactory.instance;
    }

    public register(name: string, evaluator: typeof ExpressionEvaluator): void {
        this.evaluators.put(name, evaluator);
    }

    public create(expression: XExpression): ExpressionEvaluator {
        let eClass = expression.eClass();
        let name = eClass.getName();
        let evaluatorType: any = this.evaluators.get(name);
        let evaluator = <ExpressionEvaluator>new evaluatorType();
        evaluator.init(expression);
        return evaluator;
    }

}