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
import QualifiedPlan from "webface/plan/QualifiedPlan";

import XCall from "sleman/model/XCall";
import XExpression from "sleman/model/XExpression";
import SlemanFactory from "sleman/model/SlemanFactory";

import Creator from "sleman/creator/Creator";
import { creatorFactory } from "sleman/creator/CreatorFactory";

export default class QualifiedCreator extends Creator {

    public isProduce(expression: XExpression): boolean {
        return expression instanceof XCall;
    }

    public createDefault(): XCall {

        let modelFactory = SlemanFactory.eINSTANCE;
        let call = modelFactory.createXCall();
        let args = call.getArguments();

        let plan = <QualifiedPlan><any>this.plan;
        let qualifiedName = plan.getQualifiedName();
        let pointer = modelFactory.createXPointer(qualifiedName);
        call.setCallee(pointer);

        let parameters = plan.getParameters();
        for (let i = 0; i < parameters.size; i++) {

            let argPlan = parameters.get(i);
            let plan = argPlan.getPlan();
            let expression = creatorFactory.createDefaultValue(plan);
            let argument = modelFactory.createXArgument(expression);
            args.add(argument);
        }

        return call;
    }

}
