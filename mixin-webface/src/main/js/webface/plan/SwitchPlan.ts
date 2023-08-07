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
import { jsonLeanFactory } from "webface/constants";

import AssignedPlan from "webface/plan/AssignedPlan";
import SpecifiedPlanList from "webface/plan/SpecifiedPlanList";

export default class SwitchPlan extends AssignedPlan {

    public static LEAN_NAME = "SwitchPlan";

    private cases = new SpecifiedPlanList();
    private defaultCase: number = 0;

    public constructor() {
        super(SwitchPlan.LEAN_NAME);
    }

    public getCases(): SpecifiedPlanList {
        return this.cases;
    }

    public getDefaultCase(): number {
        return this.defaultCase;
    }

}

jsonLeanFactory.register(SwitchPlan.LEAN_NAME, SwitchPlan);
