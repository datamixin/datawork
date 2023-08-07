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

export default class AddColumn extends DatasetFunction {

    public static FUNCTION_NAME = "AddColumn";

    constructor(
        public dataset: string,
        public name: string,
        public expression: string) {
        super(AddColumn.FUNCTION_NAME, dataset);
    }

    public static NAME_PLAN: ParameterPlan = ParameterPlanUtils.createTextPlan(
        "name",
        "Column Name",
        "New column name"
    );

    public static EXPRESSION_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
        "expression",
        "Column expression",
        "New column expression"
    );

    public static getPlan(): FunctionPlan {
        let plan = new FunctionPlan(
            AddColumn.FUNCTION_NAME,
            "Add Column",
            "mdi-table-column-plus-before",
            "Add column with an expression"
        );
        let parameters = plan.getParameterList();
        parameters.add(DatasetFunction.DATASET_PLAN);
        parameters.add(AddColumn.NAME_PLAN);
        parameters.add(AddColumn.EXPRESSION_PLAN);
        return plan;
    }

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(AddColumn.getPlan());