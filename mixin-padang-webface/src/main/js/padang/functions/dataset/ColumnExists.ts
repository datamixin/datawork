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

import DatasetFunction from "padang/functions/dataset/DatasetFunction";

export default class ColumnExists extends DatasetFunction {

    public static FUNCTION_NAME = "ColumnExists";

    constructor(
        public dataset: string,
        public name: string) {
        super(ColumnExists.FUNCTION_NAME, dataset);
    }

    public static NAME_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
        "name",
        "Name",
        "Column name subject to check"
    );

    public static getPlan(): FunctionPlan {
        let plan = new FunctionPlan(
            ColumnExists.FUNCTION_NAME,
            "Column Exists",
            "mdi-table-column",
            "Check a column is exists"
        );
        let parameters = plan.getParameterList();
        parameters.add(DatasetFunction.DATASET_PLAN);
        parameters.add(ColumnExists.NAME_PLAN);
        return plan;
    }
}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(ColumnExists.getPlan());