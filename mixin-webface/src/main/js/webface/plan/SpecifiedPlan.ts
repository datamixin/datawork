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
import Plan from "webface/plan/Plan";
import AssignedPlan from "webface/plan/AssignedPlan";

import { jsonLeanFactory } from "webface/constants";

export default class SpecifiedPlan extends Plan {

    public static LEAN_NAME = "SpecifiedPlan";

    private name: string = null
    private label: string = null;
    private plan: AssignedPlan = null;

    public constructor(name?: string, plan?: AssignedPlan) {
        super(SpecifiedPlan.LEAN_NAME);
        this.name = name;
        this.label = name;
        this.plan = plan;
    }

    public getName(): string {
        return this.name;
    }

    public getLabel(): string {
        return this.label;
    }

    public setLabel(label: string): SpecifiedPlan {
        this.label = label;
        return this;
    }

    public getPlan(): AssignedPlan {
        return this.plan;
    }

    public getAssignable(): string {
        return this.plan.getAssignable();
    }

}

jsonLeanFactory.register(SpecifiedPlan.LEAN_NAME, SpecifiedPlan);
