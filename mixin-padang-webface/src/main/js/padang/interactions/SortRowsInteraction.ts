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
import Interaction from "padang/interactions/Interaction";
import InteractionPlan from "padang/plan/InteractionPlan";
import InteractionPlanRegistry from "padang/plan/InteractionPlanRegistry";

import SortRows from "padang/functions/dataset/SortRows";

export default class SortRowsInteraction extends Interaction {

    constructor(
        public orders: any[]
    ) {
        super(SortRows.FUNCTION_NAME);
    }

    public static getPlan(): InteractionPlan {
        let plan = new InteractionPlan(SortRows.getPlan());
        let parameters = plan.getParameterList();
        parameters.add(SortRows.ORDERS_PLAN);
        return plan;
    }

}

let registry = InteractionPlanRegistry.getInstance();
registry.registerPlan(SortRowsInteraction.getPlan());