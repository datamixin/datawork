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
import AnyPlan from "webface/plan/AnyPlan";

import EObject from "webface/model/EObject";

import PlanForm from "sleman/model/PlanForm";

import PlanFormFactory from "sleman/model/PlanFormFactory";

export default class BasePlanFormFactory implements PlanFormFactory {

    public create(eObject: EObject, plan: AnyPlan): PlanForm {
        let planForm = new PlanForm(eObject, plan);
        return planForm;
    }

}