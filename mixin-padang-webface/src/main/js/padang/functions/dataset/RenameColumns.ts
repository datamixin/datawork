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

import ColumnFunction from "padang/functions/dataset/ColumnFunction";
import DatasetFunction from "padang/functions/dataset/DatasetFunction";

export default class RenameColumns extends DatasetFunction {

    public static FUNCTION_NAME = "RenameColumns";

    constructor(
        public dataset: string,
        public nameMap: { [oldName: string]: string }) {
        super(RenameColumns.FUNCTION_NAME, dataset);
    }

    public static NAME_MAP_PLAN: ParameterPlan = ParameterPlanUtils.createMapPlan(
        "nameMap",
        "Name Map",
        "Old column name to new column name mapping",
        ColumnFunction.SPECIFIED_PLAN,
        PlanUtils.createSpecifiedPlan(
            "newName",
            PlanUtils.createTextPlan()
        )
    );

    public static getPlan(): FunctionPlan {
        let plan = new FunctionPlan(
            RenameColumns.FUNCTION_NAME,
            "Rename Columns",
            "mdi-rename-box",
            "Rename column with old name and new name mapping"
        );
        let parameters = plan.getParameterList();
        parameters.add(DatasetFunction.DATASET_PLAN);
        parameters.add(RenameColumns.NAME_MAP_PLAN);
        return plan;
    }

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(RenameColumns.getPlan());