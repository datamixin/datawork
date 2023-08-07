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
import EMap from "webface/model/EMap";
import EList from "webface/model/EList";

import XAssignment from "sleman/model/XAssignment";
import XExpression from "sleman/model/XExpression";

import Inspector from "sleman/inspectors/Inspector";

export default class DefaultInspector implements Inspector {

    private static instance: DefaultInspector;

    public static getInstance(): Inspector {
        if (DefaultInspector.instance == null) {
            DefaultInspector.instance = new DefaultInspector();
        }
        return DefaultInspector.instance;
    }

    public collect(type: any, expressions: XExpression[], object: any): void {
        if (object instanceof type) {
            let pointer = <XExpression>object;
            expressions.push(pointer);
        } else if (object instanceof EList) {
            let list = <EList<any>>object;
            for (let i = 0; i < list.size; i++) {
                let element = list.get(i);
                this.collect(type, expressions, element);
            }
        } else if (object instanceof EMap) {
            let map = <EMap<any>>object;
            for (let key in map.keySet()) {
                let value = map.get(key);
                this.collect(type, expressions, value);
            }
        } else if (object instanceof XExpression) {
            let expression = <XExpression>object;
            this.collectSubExpressions(type, expressions, expression);
        } else if (object instanceof XAssignment) {
            let assignment = <XAssignment>object;
            let expression = assignment.getExpression();
            this.collectSubExpressions(type, expressions, expression);
        }
    }

    private collectSubExpressions(type: any, expressions: XExpression[], expression: XExpression): void {
        let features = expression.eFeatures();
        for (let feature of features) {
            let object = expression.eGet(feature);
            this.collect(type, expressions, object);
        }
    }

}
