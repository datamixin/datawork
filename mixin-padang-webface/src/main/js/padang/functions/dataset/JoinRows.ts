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

import ColumnFunction from "padang/functions/dataset/ColumnFunction";
import DatasetFunction from "padang/functions/dataset/DatasetFunction";

export default class JoinRows extends DatasetFunction {

    public static FUNCTION_NAME = "JoinRows";

    public static TYPE_INNER = "inner";
    public static TYPE_LEFT = "left";
    public static TYPE_RIGHT = "right";
    public static TYPE_FULL = "outer";

    constructor(
        public dataset: any,
        public leftKeys: any[],
        public rightDataset: any,
        public rightKeys: any[],
        public type: string) {
        super(JoinRows.FUNCTION_NAME, dataset);
    }

    public static LEFT_KEYS_PLAN: ParameterPlan = ParameterPlanUtils.createListPlan(
        "leftKeys",
        "Left Keys",
        "Left Key list",
        ColumnFunction.SPECIFIED_PLAN
    );

    public static RIGHT_DATASET_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
        "rightDataset",
        "Right Dataset",
        "Right Dataset",
        DatasetFunction.DATASET_NAMES_ASSIGNABLE
    );

    public static RIGHT_KEYS_PLAN: ParameterPlan = ParameterPlanUtils.createListPlan(
        "rightKeys",
        "Right Keys",
        "Right key list",
        PlanUtils.createSpecifiedPlan(
            "column",
            PlanUtils.createTextPlan()
                .setAssignable(ColumnFunction.getColumnKeysAssignable(JoinRows.RIGHT_DATASET_PLAN.getName()))
        )
    );

    public static TYPE: ParameterPlan = ParameterPlanUtils.createTextPlan(
        "type",
        "type",
        "Join Type",
        JoinRows.TYPE_INNER,
        "=[" +
        "'" + JoinRows.TYPE_INNER + "', " +
        "'" + JoinRows.TYPE_LEFT + "', " +
        "'" + JoinRows.TYPE_RIGHT + "', " +
        "'" + JoinRows.TYPE_FULL + "']"
    );

    public static getPlan(): FunctionPlan {
        let plan = new FunctionPlan(
            JoinRows.FUNCTION_NAME,
            "Join Rows",
            "mdi-set-none",
            "Join rows based on keys and foreign keys"
        );
        let parameters = plan.getParameterList();
        parameters.add(DatasetFunction.DATASET_PLAN);
        parameters.add(JoinRows.LEFT_KEYS_PLAN);
        parameters.add(JoinRows.RIGHT_DATASET_PLAN);
        parameters.add(JoinRows.RIGHT_KEYS_PLAN);
        parameters.add(JoinRows.TYPE);
        return plan;
    }

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(JoinRows.getPlan());