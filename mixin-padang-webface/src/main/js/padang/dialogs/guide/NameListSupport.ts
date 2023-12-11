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
import Conductor from "webface/wef/Conductor";

import AssignedPlan from "webface/plan/AssignedPlan";
import SpecifiedPlan from "webface/plan/SpecifiedPlan";

import ParameterPlan from "padang/plan/ParameterPlan";

import GuideSupport from "padang/dialogs/guide/GuideSupport";

import FormulaAssignableRequest from "padang/requests/FormulaAssignableRequest";

export default class NameListSupport extends GuideSupport {

    private plan: AssignedPlan = null;
    private names: string[] = null;

    constructor(conductor: Conductor, plan: SpecifiedPlan | ParameterPlan) {
        super(conductor);
        this.plan = plan instanceof SpecifiedPlan ? plan.getPlan() : (<ParameterPlan>plan).getAssignedPlan();
    }

    public load(callback: (names: string[]) => void): void {
        if (this.names === null) {
            let assignable = this.plan.getAssignable();
            let request = new FormulaAssignableRequest(assignable);
            this.conductor.submit(request, (names: any[]) => {
                callback(names);
                this.names = names;
            });
        } else {
            callback(this.names);
        }
    }

}