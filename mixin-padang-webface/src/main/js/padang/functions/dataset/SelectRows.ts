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

import DatasetFunction from "padang/functions/dataset/DatasetFunction";

export default class SelectRows extends DatasetFunction {

    public static FUNCTION_NAME = "SelectRows";

    constructor(
        public dataset: string,
        public condition: any) {
        super(SelectRows.FUNCTION_NAME, dataset);
    }

    public static CONDITION_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
        "condition",
        "Condition",
        "Row condition to select",
        "=foreach true"
    );

    public static getPlan(): FunctionPlan {
        let plan = new FunctionPlan(
            SelectRows.FUNCTION_NAME,
            "Select Rows",
            "mdi-filter-outline",
            "Select list of rows by condition"
        );
        let parameters = plan.getParameterList();
        parameters.add(DatasetFunction.DATASET_PLAN);
        parameters.add(SelectRows.CONDITION_PLAN);
        return plan;
    }

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(SelectRows.getPlan());