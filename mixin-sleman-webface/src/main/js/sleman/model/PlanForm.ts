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
import EObject from "webface/model/EObject";
import AssignedPlan from "webface/plan/AssignedPlan";

export default class PlanForm {

    private eObject: EObject;
    private plan: AssignedPlan;

    constructor(eObject: EObject, plan?: AssignedPlan) {
        this.eObject = eObject;
        this.plan = plan === undefined ? null : plan;
    }

    public getEObject(): EObject {
        return this.eObject;
    }

    public getPlan(): AssignedPlan {
        return this.plan;
    }
}