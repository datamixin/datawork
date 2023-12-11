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

import ColumnFunction from "padang/functions/dataset/ColumnFunction";
import DatasetFunction from "padang/functions/dataset/DatasetFunction";

export default class ReplaceValue extends DatasetFunction {

    public static FUNCTION_NAME = "ReplaceValue";

    constructor(
        public dataset: string,
        public column: string,
        public target: string,
        public replacement: string,
        public regex: boolean) {
        super(ReplaceValue.FUNCTION_NAME, dataset);
    }

    public static COLUMN_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
        "column",
        "Column",
        "Column where value will be replaced",
        "",
        ColumnFunction.getDefaultColumnKeysAssignable()
    );
    public static TARGET_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
        "target",
        "Target",
        "Target value to be replaced"
    );
    public static REPLACEMENT_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
        "replacement",
        "Replacement",
        "New replacement value"
    );
    public static REGEX_PLAN: ParameterPlan = ParameterPlanUtils.createLogicalPlan(
        "regex",
        "Regex",
        "Use regex"
    );

    public static getPlan(): FunctionPlan {
        let plan = new FunctionPlan(
            ReplaceValue.FUNCTION_NAME,
            "Replace Value",
            "mdi-file-replace-outline",
            "Replace column target value into a new replacement value"
        );
        let parameters = plan.getParameterList();
        parameters.add(DatasetFunction.DATASET_PLAN);
        parameters.add(ReplaceValue.COLUMN_PLAN);
        parameters.add(ReplaceValue.TARGET_PLAN);
        parameters.add(ReplaceValue.REPLACEMENT_PLAN);
        parameters.add(ReplaceValue.REGEX_PLAN);
        return plan;
    }

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(ReplaceValue.getPlan());