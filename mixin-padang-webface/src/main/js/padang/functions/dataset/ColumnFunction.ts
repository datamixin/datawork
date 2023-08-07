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
import SpecifiedPlan from "webface/plan/SpecifiedPlan";

import ColumnKeys from "padang/functions/dataset/ColumnKeys";
import DatasetFunction from "padang/functions/dataset/DatasetFunction";

export default class ColumnFunction extends DatasetFunction {

    public static SPECIFIED_PLAN: SpecifiedPlan = PlanUtils.createSpecifiedPlan(
        "column",
        PlanUtils.createTextPlan().setAssignable(ColumnFunction.getDefaultColumnKeysAssignable())
    );

    public static getDefaultColumnKeysAssignable(): string {
        let datasetName = DatasetFunction.DATASET_PLAN.getName();
        return ColumnFunction.getColumnKeysAssignable(datasetName);
    }

    public static getColumnKeysAssignable(datasetName: string): string {
        return "=" + ColumnKeys.FUNCTION_NAME + "(" + datasetName + ")";
    }

}