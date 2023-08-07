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
import FunctionPlanRegistry from "padang/plan/FunctionPlanRegistry";

import UniqueRows from "padang/functions/dataset/UniqueRows";

export default class DistinctRows extends UniqueRows {

    public static FUNCTION_NAME = "DistinctRows";

    constructor(
        public dataset: string,
        public keys: any[]) {
        super(DistinctRows.FUNCTION_NAME, dataset);
    }

    public static getPlan(): FunctionPlan {
        let plan = new FunctionPlan(
            DistinctRows.FUNCTION_NAME,
            "Distinct Rows",
            "mdi-format-list-bulleted-type",
            "Distinct rows based on keys"
        );
        let parameters = plan.getParameterList();
        parameters.add(DistinctRows.DATASET_PLAN);
        parameters.add(DistinctRows.KEYS_PLAN);
        return plan;
    }

}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(DistinctRows.getPlan());