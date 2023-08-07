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

export default class NumberPlan extends ConstantPlan {

    public static LEAN_NAME = "NumberPlan";

    private defaultValue: number = 0;

    public constructor(defaultValue?: number) {
        super(NumberPlan.LEAN_NAME);
        this.defaultValue = defaultValue === undefined ? 0 : defaultValue;
    }

    public getDefaultValue(): number {
        return this.defaultValue;
    }

}

jsonLeanFactory.register(NumberPlan.LEAN_NAME, <any>NumberPlan);
