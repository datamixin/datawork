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
import Plan from "webface/plan/Plan";

export function copyPlan(plan: Plan, name?: string, label?: string): Plan {

    let newPlan = Object.create(plan);
    newPlan = jQuery.extend(true, newPlan, plan);

    for (let prop in plan) {
        newPlan[prop] = plan[prop];
    }

    if (label !== undefined) {
        newPlan["label"] = label;
    }

    if (name !== undefined) {
        newPlan["name"] = name;
    }

    return <Plan>newPlan;
}

