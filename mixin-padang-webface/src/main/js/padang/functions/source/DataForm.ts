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
import PlanUtils from "webface/plan/PlanUtils";

import FunctionPlan from "padang/plan/FunctionPlan";
import ParameterPlan from "padang/plan/ParameterPlan";
import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";
import FunctionPlanRegistry from "padang/plan/FunctionPlanRegistry";

import Function from "padang/functions/Function";

export default class DataForm extends Function {

    public static FUNCTION_NAME = "DataForm";

    constructor(
        public data: any,
        public types: any) {
        super(DataForm.FUNCTION_NAME);
    }

    public static DATA_PLAN: ParameterPlan = ParameterPlanUtils.createMapPlan(
        "data",
        "Data",
        "Data content in form or column to values mapping",
        PlanUtils.createSpecifiedPlan(
            "column",
            PlanUtils.createTextPlan()
        ),
        PlanUtils.createSpecifiedPlan(
            "values",
            PlanUtils.createListPlan(
                PlanUtils.createSpecifiedPlan("value", PlanUtils.createAnyPlan())
            )
        )
    );
    public static TYPES_PLAN: ParameterPlan = ParameterPlanUtils.createMapPlan(
        "types",
        "Types",
        "Mapping from column name to data type",
        PlanUtils.createSpecifiedPlan(
            "column",
            PlanUtils.createTextPlan()
        ),
        PlanUtils.createSpecifiedPlan(
            "type",
            PlanUtils.createTextPlan().setAssignable("=['string', 'float64', 'bool']")
        )
    );

    public static getPlan(): FunctionPlan {
        let plan = new FunctionPlan(
            DataForm.FUNCTION_NAME,
            "Create Blank Data Form",
            "mdi-table-star",
            "Create initial empty dataset"
        );
        let list = plan.getParameterList();
        list.add(DataForm.DATA_PLAN);
        list.add(DataForm.TYPES_PLAN);
        return plan;
    }

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(DataForm.getPlan());