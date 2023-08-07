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
import Lean from "webface/core/Lean";

import ObjectMap from "webface/util/ObjectMap";

import QualifiedPlan from "webface/plan/QualifiedPlan";

import { jsonLeanFactory } from "webface/constants";

export default class QualifiedPlanRegistry extends Lean {

    public static LEAN_NAME = "QualifiedPlanRegistry";

    private planMap = new ObjectMap<QualifiedPlan>();

    constructor(leanName?: string) {
        super(leanName === undefined ? QualifiedPlanRegistry.LEAN_NAME : leanName);
    }

    public register(plan: QualifiedPlan): void {
        let qualifiedName = plan.getQualifiedName();
        this.planMap.put(qualifiedName, plan);
    }

    public getPlan(qualifiedName: string): QualifiedPlan {
        return this.planMap.get(qualifiedName);
    }

    public getPlans(): QualifiedPlan[] {
        return this.planMap.values();
    }

    public getNameLabelMap(): ObjectMap<string> {
        let map = new ObjectMap<string>();
        for (let name of this.planMap.keySet()) {
            let plan = this.planMap.get(name);
            let label = plan.getLabel();
            map[name] = label;
        }
        return map;
    }

}

jsonLeanFactory.register(QualifiedPlanRegistry.LEAN_NAME, QualifiedPlanRegistry);
