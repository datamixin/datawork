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
import ConstantPlan from "webface/plan/ConstantPlan";

import { jsonLeanFactory } from "webface/constants";

export default class TextPlan extends ConstantPlan {

    public static LEAN_NAME = "TextPlan";

    private defaultValue: string = "";
    private password: boolean = false;

    public constructor(defaultValue?: string) {
        super(TextPlan.LEAN_NAME);
        this.defaultValue = defaultValue === undefined ? "" : defaultValue;
    }

    public getDefaultValue(): string {
        return this.defaultValue;
    }

    public isPassword(): boolean {
        return this.password;
    }

    public setPassword(password: boolean) {
        this.password = password;
    }
}

jsonLeanFactory.register(TextPlan.LEAN_NAME, TextPlan);
