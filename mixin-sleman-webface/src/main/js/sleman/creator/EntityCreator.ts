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
import EntityPlan from "webface/plan/EntityPlan";
import SpecifiedPlanList from "webface/plan/SpecifiedPlanList";

import XObject from "sleman/model/XObject";
import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

import Creator from "sleman/creator/Creator";
import { creatorFactory } from "sleman/creator/CreatorFactory";

export default class EntityCreator extends Creator {

    public isProduce(expression: XExpression): boolean {
        if (expression instanceof XObject) {
            let fields = expression.getFields();
            let plans = this.getFieldPlans();

            if (fields.size !== plans.size) {
                return false;
            }

            let matches = 0;
            for (let i = 0; i < fields.size; i++) {
                let field = fields.get(i);
                let identifier = field.getName();
                let name = identifier.getName();
                let plan = plans.get(name);
                if (plan !== null) {
                    matches++;
                }
            }
            return plans.size === matches;
        }
        return false
    }

    private getFieldPlans(): SpecifiedPlanList {
        let entityPlan = <EntityPlan><any>this.plan;
        let plans = entityPlan.getFields();
        return plans;
    }

    public createDefault(): XObject {

        let modelFactory = SlemanFactory.eINSTANCE;
        let object = modelFactory.createXObject();
        let fields = object.getFields();

        let entityPlan = <EntityPlan><any>this.plan;
        let plans = entityPlan.getFields();
        for (let i = 0; i < plans.size; i++) {

            let fieldPlan = plans.get(i);
            let name = fieldPlan.getName();
            let plan = fieldPlan.getPlan();
            let expression = creatorFactory.createDefaultValue(plan);
            let assignment = modelFactory.createXAssignment(name, expression);

            fields.add(assignment)
        }
        return object;
    }

}
