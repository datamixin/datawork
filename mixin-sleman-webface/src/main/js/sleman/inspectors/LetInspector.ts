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
import XLet from "sleman/model/XLet";
import XReference from "sleman/model/XReference";
import XExpression from "sleman/model/XExpression";
import Inspector from "sleman/inspectors/Inspector";
import InspectorFactory from "sleman/inspectors/InspectorFactory";

export default class LetInspector implements Inspector {

    public collect(type: any, expressions: XExpression[], object: any): void {

        let xLet = <XLet>object;

        // Kumpulkan expression yang ada di result
        let result = xLet.getResult();
        let descendingExpressions: XExpression[] = [];
        let factory = InspectorFactory.getInstance();
        let inspector = factory.create(result);
        inspector.collect(type, descendingExpressions, result);

        // Baca semua variable assignment di let
        let assignments = xLet.getVariables();
        for (let i = 0; i < assignments.size; i++) {

            let assignment = assignments.get(i);
            let expression = assignment.getExpression();
            inspector = factory.create(expression);
            inspector.collect(type, descendingExpressions, expression);

        }

        for (let i = 0; i < assignments.size; i++) {

            let assignment = assignments.get(i);
            let identifier = assignment.getName();
            let identifierName = identifier.getName();

            for (let expression of descendingExpressions) {

                if (expression instanceof XReference) {

                    // Hapus reference yang menggunakan variable let
                    let reference = <XReference>expression;
                    let referenceName = reference.getName();
                    if (referenceName === identifierName) {
                        let index = descendingExpressions.indexOf(expression);
                        descendingExpressions.splice(index, 1);
                        break;
                    }
                }
            }
        }

        // Gabungkan dengan pointer yang sudah terkumpul
        expressions = expressions.concat(descendingExpressions);
    }

}
