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
import FunctionPlan from "padang/plan/FunctionPlan";
import ParameterPlan from "padang/plan/ParameterPlan";
import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";
import FunctionPlanRegistry from "padang/plan/FunctionPlanRegistry";

import Function from "padang/functions/Function";

export default class If extends Function {

    public static FUNCTION_NAME = "If";

    constructor(
        public logical: any,
        public consequent: any,
        public alternate: any,
    ) {
        super(If.FUNCTION_NAME);
    }

    public static LOGICAL_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
        "logical",
        "Logical",
        "Logical value",
        "=true"
    );

    public static CONSEQUENT: ParameterPlan = ParameterPlanUtils.createAnyPlan(
        "consequent",
        "Consequent",
        "Consequent value",
        "=true"
    );

    public static ALTERNATE: ParameterPlan = ParameterPlanUtils.createAnyPlan(
        "alternate",
        "Alternate",
        "Alternate value",
        "=false"
    );

    public static getPlan(): FunctionPlan {
        let plan = new FunctionPlan(
            If.FUNCTION_NAME,
            "If",
            "mdi-directions-fork",
            "Logical function If"
        );
        let parameters = plan.getParameterList();
        parameters.add(If.LOGICAL_PLAN);
        parameters.add(If.CONSEQUENT);
        parameters.add(If.ALTERNATE);
        return plan;
    }

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(If.getPlan());