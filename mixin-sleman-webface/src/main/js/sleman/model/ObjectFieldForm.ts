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
import SpecifiedPlan from "webface/plan/SpecifiedPlan";

import XAssignment from "sleman/model/XAssignment";

export default class ObjectFieldForm {

    public static LEAN_NAME = "ObjectFieldForm";

    private plan: SpecifiedPlan;
    private assignment: XAssignment;
    private fixed: boolean = false;

    constructor(plan: SpecifiedPlan, model: XAssignment, fixed: boolean) {
        this.plan = plan;
        this.assignment = model;
        this.fixed = fixed;
    }

    public getPlan(): SpecifiedPlan {
        return this.plan;
    }

    public getEObject(): XAssignment {
        return this.assignment;
    }

    public isFixed(): boolean {
        return this.fixed;
    }

}