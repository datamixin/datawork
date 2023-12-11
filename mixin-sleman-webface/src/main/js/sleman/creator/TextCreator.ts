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
import TextPlan from "webface/plan/TextPlan";

import XText from "sleman/model/XText";

import Creator from "sleman/creator/Creator";
import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

export default class TextCreator extends Creator {

    public isProduce(expression: XExpression): boolean {
        return expression instanceof XText;
    }

    public createDefault(): XText {

        // Baca initial value
        let plan = <TextPlan><any>this.plan;
        let defaultValue = plan.getDefaultValue();
        let modelFactory = SlemanFactory.eINSTANCE;
        let expression = modelFactory.createXText();
        if (defaultValue !== null) {
            expression.setValue(defaultValue);
        }

        return expression;
    }

}
