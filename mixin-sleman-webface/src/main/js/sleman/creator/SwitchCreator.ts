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
import SwitchPlan from "webface/plan/SwitchPlan";

import XExpression from "sleman/model/XExpression";

import Creator from "sleman/creator/Creator";
import { creatorFactory } from "sleman/creator/CreatorFactory";

export default class SwitchCreator extends Creator {

    public isProduce(expression: XExpression): boolean {
        return false;
    }

    public createDefault(): XExpression {

        let switchPlan = <SwitchPlan><any>this.plan;
        let plans = switchPlan.getCases();

        let defaultCase = switchPlan.getDefaultCase();
        if (defaultCase > plans.size) {
            defaultCase = plans.size - 1;
        }
        let firstPlan = plans.get(defaultCase);
        let plan = firstPlan.getPlan();
        return creatorFactory.createDefaultValue(plan);
    }

}
