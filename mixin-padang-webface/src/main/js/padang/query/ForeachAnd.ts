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
import * as util from "webface/model/util";

import SExpression from "sleman/SExpression";

import XCall from "sleman/model/XCall";
import XList from "sleman/model/XList";
import XUnary from "sleman/model/XUnary";
import XAlias from "sleman/model/XAlias";
import XBinary from "sleman/model/XBinary";
import XForeach from "sleman/model/XForeach";
import XConstant from "sleman/model/XConstant";
import XReference from "sleman/model/XReference";
import XExpression from "sleman/model/XExpression";

import And from "padang/functions/logical/And";
import IsNull from "padang/functions/logical/IsNull";

import SlemanFactory from "sleman/model/SlemanFactory";

export default class ForeachAnd {

    private factory = SlemanFactory.eINSTANCE;

    private foreach: XForeach = null;
    private call: XCall = null;
    private list: XList = null;

    constructor(foreach?: XForeach) {
        if (foreach !== undefined) {
            this.call = <XCall>foreach.getExpression();
            let args = this.call.getArguments();
            let arg = args.get(0);
            this.list = <XList>arg.getExpression();
            this.foreach = foreach;
        } else {
            this.list = this.factory.createXList();
            this.call = this.factory.createXCall(And.FUNCTION_NAME, this.list);
            this.foreach = this.factory.createXForeach();
            this.foreach.setExpression(this.call);
        }
    }

    public getForeach(): XForeach {
        return this.foreach;
    }

    public getElements(): EList<XExpression> {
        return this.list.getElements();
    }

    public addCondition(condition: SExpression): void {

        let expression = <XExpression>condition;
        let elements = this.list.getElements();

        // Kumpulkan And argument yang pegang single column
        let map = new Map<string, XExpression>();
        for (let element of elements) {
            let names = this.getColumnNames(element);
            if (names.length === 1) {
                map.set(names[0], element);
            }
        }

        // Ambil nama column yang di akan apply
        let columns = this.getColumnNames(expression);
        if (columns.length === 1) {
            let column = columns[0];
            if (map.has(column)) {

                // Replace argument untuk kolom yang sama
                let arg = map.get(column);
                util.replace(arg, expression);
                return;
            }
        }

        // Tambahkan argument ke logical and
        elements.add(expression);

    }

    private getColumnNames(element: XExpression): string[] {
        let names: string[] = [];
        let aliases = <XAlias[]>util.getDescendantsByModelClass(element, XAlias, true);
        for (let alias of aliases) {
            let name = alias.getName();
            if (names.indexOf(name) === -1) {
                names.push(name);
            }
        }
        return names;
    }

    public getColumnOperatorValues(): Map<string, Map<string, any>> {
        let map = new Map<string, Map<string, any>>();
        let elements = this.list.getElements();
        for (let element of elements) {
            this.collectColumnOperatorValues(map, element);
        }
        return map;
    }

    private collectColumnOperatorValues(map: Map<string, Map<string, any>>, expression: XExpression): void {
        if (expression instanceof XBinary) {
            let left = expression.getLeft();
            let right: XExpression = expression.getRight();
            if (left instanceof XAlias && (right instanceof XConstant || right instanceof XCall)) {
                let column = left.getName();
                if (!map.has(column)) {
                    map.set(column, new Map<string, any>());
                }
                let values = map.get(column);
                let operator = expression.getOperator();
                if (right instanceof XConstant) {
                    let value = right.toValue();
                    values.set(operator, value);
                } else if (right instanceof XCall) {
                    let args = right.getArguments();
                    if (args.size > 0) {
                        let firstArg = args.get(0);
                        let expr = firstArg.getExpression();
                        if (expr instanceof XConstant) {
                            let value = expr.toValue();
                            values.set(operator, value);
                        } else {
                            if (expr instanceof XUnary) {
                                let arg = expr.getArgument();
                                if (arg instanceof XConstant) {
                                    let op = expr.getOperator();
                                    if (op === "-") {
                                        let value = arg.toValue();
                                        values.set(operator, -value);
                                    } else {
                                        throw new Error("Unexpected unary operator '" + op + "'");
                                    }
                                } else {
                                    throw new Error("Expected constant value for unary argument");
                                }
                            } else {
                                throw new Error("Expected constant value for call argument");
                            }
                        }
                    } else {
                        throw new Error("Expected call argument for right binary expression");
                    }
                } else {
                    throw new Error("Unexpected right binary expression '" + right + "'");
                }
            } else {
                this.collectColumnOperatorValues(map, left);
                this.collectColumnOperatorValues(map, right);
            }
        } else if (expression instanceof XCall) {
            let args = expression.getArguments();
            let callee = <XReference>expression.getCallee();
            let name = callee.getName();
            if (name === IsNull.FUNCTION_NAME) {
                let arg = args.get(0);
                let first = arg.getExpression();
                if (first instanceof XAlias) {
                    let column = first.getName();
                    if (!map.has(column)) {
                        map.set(column, new Map<string, any>());
                    }
                    let values = map.get(column);
                    values.set(name, null);
                }
            }
        }
    }

    public getFormula(): string {
        return "=" + this.foreach.toLiteral();
    }

}