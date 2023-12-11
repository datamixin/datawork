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
import StructurePlan from "webface/plan/StructurePlan";
import SpecifiedPlan from "webface/plan/SpecifiedPlan";

import { jsonLeanFactory } from "webface/constants";

export default class ListPlan extends StructurePlan {

    public static LEAN_NAME = "ListPlan";

    private element: SpecifiedPlan = null;

    public constructor(element?: SpecifiedPlan) {
        super(ListPlan.LEAN_NAME);
        this.element = element === undefined ? null : element;
    }

    public setElement(element: SpecifiedPlan): void {
        this.element = element;
    }

    public getElement(): SpecifiedPlan {
        return this.element;
    }

}

jsonLeanFactory.register(ListPlan.LEAN_NAME, <any>ListPlan);
