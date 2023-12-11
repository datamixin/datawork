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

export default class RowRange extends DatasetFunction {

    public static FUNCTION_NAME = "RowRange";

    constructor(
        public dataset: string,
        public startRow: number,
        public endRow: number,
        public startColumn: number,
        public endColumn: number,
    ) {
        super(RowRange.FUNCTION_NAME, dataset);
    }

    public static START_ROW_PLAN: ParameterPlan = ParameterPlanUtils.createNumberPlan(
        "startRow",
        "Start Row",
        "Start row index start from 0",
        0
    );

    public static END_ROW_PLAN: ParameterPlan = ParameterPlanUtils.createNumberPlan(
        "endRow",
        "End Row",
        "End row index start from 0",
        -1
    );

    public static START_COLUMN_PLAN: ParameterPlan = ParameterPlanUtils.createNumberPlan(
        "startColumn",
        "Start Column",
        "Start column index start from 0",
        0
    );

    public static END_COLUMN: ParameterPlan = ParameterPlanUtils.createNumberPlan(
        "endColumn",
        "End Column",
        "End column index start from 0",
        -1
    );

    public static getPlan(): FunctionPlan {
        let plan = new FunctionPlan(
            RowRange.FUNCTION_NAME,
            "Row Range",
            "mdi-table-row",
            "Get range of rows for a range of column"
        );
        let parameters = plan.getParameterList();
        parameters.add(DatasetFunction.DATASET_PLAN);
        parameters.add(RowRange.START_ROW_PLAN);
        parameters.add(RowRange.END_ROW_PLAN);
        parameters.add(RowRange.START_COLUMN_PLAN);
        parameters.add(RowRange.END_COLUMN);
        return plan;
    }
}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(RowRange.getPlan());