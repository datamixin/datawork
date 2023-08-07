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
import ConstantPlan from "webface/plan/ConstantPlan";

import { jsonLeanFactory } from "webface/constants";

export default class LogicalPlan extends ConstantPlan {

    public static LEAN_NAME = "LogicalPlan";

    private defaultValue: boolean = false;

    public constructor(defaultValue?: boolean) {
        super(LogicalPlan.LEAN_NAME);
        this.defaultValue = defaultValue === undefined ? true : defaultValue;
        this.setAssignable("=[true, false]");
    }

    public getDefaultValue(): boolean {
        return this.defaultValue;
    }

}

jsonLeanFactory.register(LogicalPlan.LEAN_NAME, <any>LogicalPlan);
