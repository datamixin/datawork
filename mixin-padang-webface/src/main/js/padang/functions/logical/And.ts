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
import PlanUtils from "webface/plan/PlanUtils";

import FunctionPlan from "padang/plan/FunctionPlan";
import ParameterPlan from "padang/plan/ParameterPlan";
import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";
import FunctionPlanRegistry from "padang/plan/FunctionPlanRegistry";

import Function from "padang/functions/Function";

export default class And extends Function {

    public static FUNCTION_NAME = "And";

    constructor(
        public keys: any[]) {
        super(And.FUNCTION_NAME);
    }

    public static KEYS_PLAN: ParameterPlan = ParameterPlanUtils.createListPlan(
        "conditions",
        "Conditions",
        "Condition list",
        PlanUtils.createSpecifiedPlan("condition", PlanUtils.createAnyPlan())
    );

    public static getPlan(): FunctionPlan {
        let plan = new FunctionPlan(
            And.FUNCTION_NAME,
            "And",
            "mdi-set-center",
            "Logical function And"
        );
        let parameters = plan.getParameterList();
        parameters.add(And.KEYS_PLAN);
        return plan;
    }

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(And.getPlan());