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
import MapPlan from "webface/plan/MapPlan";
import AnyPlan from "webface/plan/AnyPlan";
import ListPlan from "webface/plan/ListPlan";
import TextPlan from "webface/plan/TextPlan";
import NumberPlan from "webface/plan/NumberPlan";
import EntityPlan from "webface/plan/EntityPlan";
import LogicalPlan from "webface/plan/LogicalPlan";
import AssignedPlan from "webface/plan/AssignedPlan";
import SpecifiedPlan from "webface/plan/SpecifiedPlan";

export default class PlanUtils {

    public static createTextPlan(defaultValue?: string): TextPlan {
        return new TextPlan(defaultValue);
    }

    public static createNumberPlan(defaultValue?: number): NumberPlan {
        return new NumberPlan(defaultValue);
    }

    public static createLogicalPlan(defaultValue?: boolean): LogicalPlan {
        return new LogicalPlan(defaultValue);
    }

    public static createMapPlan(keyPlan: SpecifiedPlan, valuePlan: SpecifiedPlan): MapPlan {
        return new MapPlan(keyPlan, valuePlan);
    }

    public static createListPlan(element: SpecifiedPlan): ListPlan {
        return new ListPlan(element);
    }

    public static createEntityPlan(fields: SpecifiedPlan[]): EntityPlan {
        return new EntityPlan(fields);
    }

    public static createAnyPlan(type?: string): AnyPlan {
        return new AnyPlan(type);
    }

    public static createSpecifiedPlan(name: string, plan: AssignedPlan): SpecifiedPlan {
        return new SpecifiedPlan(name, plan);
    }

}