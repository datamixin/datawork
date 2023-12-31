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
import FunctionPlanRegistry from "padang/plan/FunctionPlanRegistry";

import DatasetFunction from "padang/functions/dataset/DatasetFunction";

export default class ColumnKeys extends DatasetFunction {

    public static FUNCTION_NAME = "ColumnKeys";

    constructor(
        public dataset: string) {
        super(ColumnKeys.FUNCTION_NAME, dataset);
    }

    public static getPlan(): FunctionPlan {
        let plan = new FunctionPlan(
            ColumnKeys.FUNCTION_NAME,
            "Column Keys",
            "mdi-table-large",
            "List column keys"
        );
        let parameters = plan.getParameterList();
        parameters.add(DatasetFunction.DATASET_PLAN);
        return plan;
    }
}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(ColumnKeys.getPlan());