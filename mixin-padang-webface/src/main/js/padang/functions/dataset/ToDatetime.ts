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

export default class ToDatetime extends DatasetFunction {

    public static FUNCTION_NAME = "ToDatetime";

    constructor(
        public dataset: string,
        public column: string,
        public format: string,
        public autoDetect: boolean) {
        super(ToDatetime.FUNCTION_NAME, dataset);
    }

    public static COLUMN_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
        "column",
        "Column",
        "Column where value will be replaced",
        "",
        ColumnFunction.getDefaultColumnKeysAssignable()
    );
    public static FORMAT_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
        "format",
        "Format",
        "Datetime column format"
    );
    public static AUTO_DETECT_PLAN: ParameterPlan = ParameterPlanUtils.createLogicalPlan(
        "autoDetect",
        "Auto Detect",
        "Automatically detect format",
        true
    );

    public static getPlan(): FunctionPlan {
        let plan = new FunctionPlan(
            ToDatetime.FUNCTION_NAME,
            "To Datetime",
            "mdi-calendar-clock",
            "Convert text or numeric column into datetime column"
        );
        let parameters = plan.getParameterList();
        parameters.add(DatasetFunction.DATASET_PLAN);
        parameters.add(ToDatetime.COLUMN_PLAN);
        parameters.add(ToDatetime.FORMAT_PLAN);
        parameters.add(ToDatetime.AUTO_DETECT_PLAN);
        return plan;
    }

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(ToDatetime.getPlan());