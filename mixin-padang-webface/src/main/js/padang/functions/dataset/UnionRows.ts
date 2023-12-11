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

import DatasetFunction from "padang/functions/dataset/DatasetFunction";

export default class UnionRows extends DatasetFunction {

    public static FUNCTION_NAME = "UnionRows";

    constructor(
        public dataset: any,
        public others: any[]) {
        super(UnionRows.FUNCTION_NAME, dataset);
    }

    public static OTHERS_PLAN: ParameterPlan = ParameterPlanUtils.createListPlan(
        "others",
        "Others",
        "Other dataset list",
        PlanUtils.createSpecifiedPlan(
            "dataset",
            PlanUtils.createAnyPlan().setAssignable(DatasetFunction.DATASET_NAMES_ASSIGNABLE)
        )
    );

    public static getPlan(): FunctionPlan {
        let plan = new FunctionPlan(
            UnionRows.FUNCTION_NAME,
            "Union Rows",
            "mdi-vector-union",
            "Union rows from other datasets"
        );
        let parameters = plan.getParameterList();
        parameters.add(DatasetFunction.DATASET_PLAN);
        parameters.add(UnionRows.OTHERS_PLAN);
        return plan;
    }

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(UnionRows.getPlan());