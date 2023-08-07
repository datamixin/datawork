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
import Function from "padang/functions/Function";
import DatasetNames from "padang/functions/system/DatasetNames";

import ParameterPlan from "padang/plan/ParameterPlan";
import ParameterPlanUtils from "padang/plan/ParameterPlanUtils";

export default class DatasetFunction extends Function {

    constructor(
        public functionName: string,
        public dataset: string) {
        super(functionName);
    }

    public static DATASET_NAMES_ASSIGNABLE = "=" + DatasetNames.FUNCTION_NAME + "()";

    public static DATASET_PLAN: ParameterPlan = ParameterPlanUtils.createAnyPlan(
        "dataset",
        "Dataset",
        "Source dataset to be evaluated"
    );

}