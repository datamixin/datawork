/*
 * Copyright (c) 2020-2023 Datamixin.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import FunctionPlan from "padang/plan/FunctionPlan";
import ParameterPlan from "padang/plan/ParameterPlan";
import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";
import FunctionPlanRegistry from "padang/plan/FunctionPlanRegistry";

import ColumnFunction from "padang/functions/dataset/ColumnFunction";
import DatasetFunction from "padang/functions/dataset/DatasetFunction";

export default class SelectColumns extends DatasetFunction {

    public static FUNCTION_NAME = "SelectColumns";

    constructor(
        public dataset: string,
        public values: string[]) {
        super(SelectColumns.FUNCTION_NAME, dataset);
    }

    public static VALUES_PLAN: ParameterPlan = ParameterPlanUtils.createListPlan(
        "values",
        "Values",
        "Column name list or values to select",
        ColumnFunction.SPECIFIED_PLAN
    );

    public static getPlan(): FunctionPlan {
        let plan = new FunctionPlan(
            SelectColumns.FUNCTION_NAME,
            "Select Columns",
            "mdi-table-column-width",
            "Select list of columns by names"
        );
        let parameters = plan.getParameterList();
        parameters.add(DatasetFunction.DATASET_PLAN);
        parameters.add(SelectColumns.VALUES_PLAN);
        return plan;
    }

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(SelectColumns.getPlan());