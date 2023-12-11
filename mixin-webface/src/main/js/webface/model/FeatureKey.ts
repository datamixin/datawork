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
import Lean from "webface/core/Lean";

import { jsonLeanFactory } from "webface/constants";

export default class FeatureKey extends Lean {

    public static LEAN_NAME = "FeatureKey";

    private name: string = null;

    constructor(name: string, leanName?: string) {
        super(leanName === undefined ? FeatureKey.LEAN_NAME : leanName);
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    public toQualified(): string {
        return this.name;
    }

    public toString(): string {
        return "FeatureKey{name=" + name + "}";
    }

}

jsonLeanFactory.register(FeatureKey.LEAN_NAME, <any>FeatureKey);
