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
import NumberPlan from "webface/plan/NumberPlan";

import XNumber from "sleman/model/XNumber";
import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

import Creator from "sleman/creator/Creator";

export default class NumberCreator extends Creator {

    public isProduce(expression: XExpression): boolean {
        return expression instanceof XNumber;
    }

    public createDefault(): XNumber {

        // Baca initial value
        let plan = <NumberPlan><any>this.plan;
        let defaultValue = plan.getDefaultValue();
        let modelFactory = SlemanFactory.eINSTANCE;
        let expression = modelFactory.createXNumber();
        if (defaultValue !== null) {
            expression.setValue(defaultValue);
        }

        return expression;
    }

}
