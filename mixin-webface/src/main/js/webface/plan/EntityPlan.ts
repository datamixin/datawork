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

import StructurePlan from "webface/plan/StructurePlan";
import SpecifiedPlan from "webface/plan/SpecifiedPlan";
import SpecifiedPlanList from "webface/plan/SpecifiedPlanList";

export default class EntityPlan extends StructurePlan {

    public static LEAN_NAME = "EntityPlan";

    protected fields = new SpecifiedPlanList();
    private categories: string[] = [];

    constructor(fields?: SpecifiedPlan[]) {
        super(EntityPlan.LEAN_NAME);
        if (fields !== undefined) {
            for (let field of fields) {
                this.fields.addPlan(field);
            }
        }
    }

    public getFields(): SpecifiedPlanList {
        return this.fields;
    }

    public getCategories(): string[] {
        return this.categories;
    }

}

jsonLeanFactory.register(EntityPlan.LEAN_NAME, <any>EntityPlan);
