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
import Function from "padang/functions/Function";

import FunctionPlan from "padang/plan/FunctionPlan";
import ParameterPlan from "padang/plan/ParameterPlan";
import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";
import FunctionPlanRegistry from "padang/plan/FunctionPlanRegistry";
import DatasetFunction from "padang/functions/dataset/DatasetFunction";

export default class FromPreparation extends Function {

    public static FUNCTION_NAME = "FromPreparation";

    constructor(
        dataset: string,
        mutation: number,
        display: boolean) {
        super(FromPreparation.FUNCTION_NAME);
    }

    public static DATASET_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
        "dataset",
        "Dataset",
        "Source dataset name",
        DatasetFunction.DATASET_NAMES_ASSIGNABLE
    );
    public static MUTATION_PLAN: ParameterPlan = ParameterPlanUtils.createNumberPlan(
        "mutation",
        "Mutation",
        "Mutation index",
        -1
    );
    public static DISPLAY_PLAN: ParameterPlan = ParameterPlanUtils.createLogicalPlan(
        "display",
        "Display",
        "State whether to use result after for display",
        false
    );

    public static getPlan(): FunctionPlan {
        let plan = new FunctionPlan(
            FromPreparation.FUNCTION_NAME,
            "From Preparation",
            "mdi-table",
            "Create dataset from preparation result"
        );
        let parameters = plan.getParameterList();
        parameters.add(FromPreparation.DATASET_PLAN);
        parameters.add(FromPreparation.MUTATION_PLAN);
        parameters.add(FromPreparation.DISPLAY_PLAN);
        return plan;
    }

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(FromPreparation.getPlan());