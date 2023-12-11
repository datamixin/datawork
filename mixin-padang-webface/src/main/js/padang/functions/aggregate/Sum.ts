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

import SeriesFunction from "padang/functions/aggregate/SeriesFunction";

export default class Sum extends SeriesFunction {

    public static FUNCTION_NAME = "Sum";

    constructor(
        public series: string) {
        super(Sum.FUNCTION_NAME, series);
    }

    public static getPlan(): FunctionPlan {
        let plan = new FunctionPlan(
            Sum.FUNCTION_NAME,
            "Sum",
            "mdi-table-column",
            "Sum column values"
        );
        let parameters = plan.getParameterList();
        parameters.add(SeriesFunction.SERIES_PLAN);
        return plan;
    }
}

let registry = FunctionPlanRegistry.getInstance();
registry.registerPlan(Sum.getPlan());