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

export default class Left extends Function {

    public static FUNCTION_NAME = "Left";

    constructor(
        public text: string,
        public count: number) {
        super(Left.FUNCTION_NAME);
    }

    public static TEXT_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
        "text",
        "Text",
        "Text expression"
    );

    public static COUNT_PLAN: ParameterPlan = ParameterPlanUtils.createNumberPlan(
        "count",
        "Count",
        "Text count"
    );

    public static getPlan(): FunctionPlan {
        let plan = new FunctionPlan(
            Left.FUNCTION_NAME,
            "Left",
            "mdi-format-horizontal-align-left",
            "Get left text from string"
        );
        let parameters = plan.getParameterList();
        parameters.add(Left.TEXT_PLAN);
        parameters.add(Left.COUNT_PLAN);
        return plan;
    }

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(Left.getPlan());